import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { createReadStream } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';
import { pool, transaction } from './db.js';

const allowedTags = new Set(['bag','bikini','bonfire','cafe','family','stroller','tent','glutenfree']);
const sign = (value) => createHmac('sha256', config.photoSecret).update(value).digest('hex');
const photoUrl = (id, ownerId) => {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  return `/api/photos/${id}?expires=${expires}&signature=${sign(`${id}:${ownerId}:${expires}`)}`;
};
const validateTrip = (body) => {
  const title = String(body.title || '').trim(); const lat = Number(body.lat); const lng = Number(body.lng);
  if (title.length < 3 || title.length > 80) throw new Error('Název musí mít 3 až 80 znaků.');
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) throw new Error('Souřadnice nejsou platné.');
  const tags = [...new Set(Array.isArray(body.tags) ? body.tags : [])];
  if (tags.some((tag) => !allowedTags.has(tag))) throw new Error('Neplatný tag.');
  return { title, lat, lng, tags, description: Array.isArray(body.description) ? body.description.map(String) : [], notes: Array.isArray(body.notes) ? body.notes.map(String) : [], photos: Array.isArray(body.photos) ? body.photos : [] };
};
const getTrip = async (db, id, ownerId) => {
  const { rows } = await db.query(`select t.*,
    coalesce((select json_agg(tt.tag order by tt.tag) from trip_tags tt where tt.trip_id=t.id),'[]') tags,
    coalesce((select json_agg(json_build_object('id',p.id,'src','', 'caption',p.caption,'name',p.original_name,'position',p.position) order by p.position) from trip_photos p where p.trip_id=t.id),'[]') photos
    from trips t where t.id=$1 and t.owner_id=$2`, [id, ownerId]);
  const trip = rows[0]; if (!trip) return null;
  trip.photos = trip.photos.map((photo) => ({ ...photo, src: photoUrl(photo.id, ownerId) }));
  return trip;
};
const safeUnlink = (file) => unlink(file).catch(() => {});

export const registerTripRoutes = async (app) => {
  app.get('/api/trips', async (request) => {
    const { rows } = await pool.query('select id from trips where owner_id=$1 order by created_at desc', [request.identity.id]);
    return Promise.all(rows.map(({ id }) => getTrip(pool, id, request.identity.id)));
  });
  app.get('/api/trips/:id', async (request, reply) => {
    const trip = await getTrip(pool, request.params.id, request.identity.id);
    return trip || reply.code(404).send({ message: 'Výlet nebyl nalezen.' });
  });
  app.post('/api/trips', async (request, reply) => {
    let data; try { data = validateTrip(request.body); } catch (error) { return reply.code(400).send({ message: error.message }); }
    const count = await pool.query('select count(*)::int count from trips where owner_id=$1', [request.identity.id]);
    if (count.rows[0].count >= 100) return reply.code(409).send({ message: 'Byl dosažen limit 100 výletů.' });
    const id = await transaction(async (db) => {
      const result = await db.query('insert into trips(owner_id,title,lat,lng,description,notes) values($1,$2,$3,$4,$5,$6) returning id', [request.identity.id,data.title,data.lat,data.lng,JSON.stringify(data.description),JSON.stringify(data.notes)]);
      if (data.tags.length) await db.query('insert into trip_tags(trip_id,tag) select $1, unnest($2::text[])', [result.rows[0].id,data.tags]);
      return result.rows[0].id;
    });
    return reply.code(201).send(await getTrip(pool, id, request.identity.id));
  });
  app.put('/api/trips/:id', async (request, reply) => {
    let data; try { data = validateTrip(request.body); } catch (error) { return reply.code(400).send({ message: error.message }); }
    const removedPaths = await transaction(async (db) => {
      const updated = await db.query('update trips set title=$1,lat=$2,lng=$3,description=$4,notes=$5,updated_at=now() where id=$6 and owner_id=$7 returning id', [data.title,data.lat,data.lng,JSON.stringify(data.description),JSON.stringify(data.notes),request.params.id,request.identity.id]);
      if (!updated.rowCount) throw Object.assign(new Error('Výlet nebyl nalezen.'), { statusCode: 404 });
      await db.query('delete from trip_tags where trip_id=$1', [request.params.id]);
      if (data.tags.length) await db.query('insert into trip_tags(trip_id,tag) select $1, unnest($2::text[])', [request.params.id,data.tags]);
      const retained = data.photos.map((p) => p.id).filter(Boolean);
      const removed = await db.query('delete from trip_photos where trip_id=$1 and not(id = any($2::uuid[])) returning storage_path', [request.params.id,retained]);
      for (const [position, photo] of data.photos.entries()) await db.query('update trip_photos set caption=$1,position=$2 where id=$3 and trip_id=$4', [String(photo.caption||''),position,photo.id,request.params.id]);
      return removed.rows.map((row) => row.storage_path);
    });
    await Promise.all(removedPaths.map(safeUnlink));
    return getTrip(pool, request.params.id, request.identity.id);
  });
  app.post('/api/trips/:id/photos', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  }, async (request, reply) => {
    if (!(await getTrip(pool, request.params.id, request.identity.id))) return reply.code(404).send({ message: 'Výlet nebyl nalezen.' });
    const current = await pool.query('select count(*)::int count, coalesce(sum(size_bytes),0)::bigint bytes from trip_photos where owner_id=$1', [request.identity.id]);
    const tripCount = await pool.query('select count(*)::int count from trip_photos where trip_id=$1', [request.params.id]);
    const files = []; const captions = [];
    for await (const part of request.parts()) {
      if (part.type === 'file') files.push({ buffer: await part.toBuffer(), name: part.filename, mime: part.mimetype });
      else if (part.fieldname === 'captions') captions.push(String(part.value || ''));
    }
    if (tripCount.rows[0].count + files.length > 3) return reply.code(409).send({ message: 'K výletu lze uložit nejvýše 3 fotografie.' });
    if (files.some((file) => !['image/jpeg','image/webp'].includes(file.mime) || file.buffer.length > 768000)) return reply.code(400).send({ message: 'Fotografie musí být JPEG/WebP a mít nejvýše 750 kB.' });
    if (Number(current.rows[0].bytes) + files.reduce((sum,f)=>sum+f.buffer.length,0) > 52428800) return reply.code(409).send({ message: 'Byl dosažen limit 50 MB fotografií.' });
    const created = [];
    try {
      for (const [index,file] of files.entries()) {
        const id=randomUUID(); const storagePath=path.join(config.uploadsDir,`${id}.${file.mime==='image/webp'?'webp':'jpg'}`); await writeFile(storagePath,file.buffer,{flag:'wx'});
        await pool.query('insert into trip_photos(id,trip_id,owner_id,storage_path,original_name,caption,position,size_bytes,mime_type) values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [id,request.params.id,request.identity.id,storagePath,file.name,captions[index]||'',tripCount.rows[0].count+index,file.buffer.length,file.mime]);
        created.push(storagePath);
      }
    } catch (error) { await Promise.all(created.map(safeUnlink)); throw error; }
    return reply.code(201).send(await getTrip(pool, request.params.id, request.identity.id));
  });
  app.delete('/api/trips/:id', async (request, reply) => {
    const removed = await transaction(async (db) => {
      const photos=await db.query('select storage_path from trip_photos where trip_id=$1 and owner_id=$2',[request.params.id,request.identity.id]);
      const result=await db.query('delete from trips where id=$1 and owner_id=$2',[request.params.id,request.identity.id]);
      if(!result.rowCount) throw Object.assign(new Error('Výlet nebyl nalezen.'),{statusCode:404}); return photos.rows;
    });
    await Promise.all(removed.map((p)=>safeUnlink(p.storage_path))); return reply.code(204).send();
  });
  app.get('/api/photos/:id', {
    preHandler: [],
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
  }, async (request, reply) => {
    const { expires, signature } = request.query; const photo=(await pool.query('select * from trip_photos where id=$1',[request.params.id])).rows[0];
    if (!photo || Number(expires)<Date.now()/1000 || typeof signature!=='string') return reply.code(404).send();
    const expected=sign(`${photo.id}:${photo.owner_id}:${expires}`); const supplied=Buffer.from(signature); const valid=supplied.length===expected.length&&timingSafeEqual(supplied,Buffer.from(expected));
    if(!valid) return reply.code(403).send(); reply.type(photo.mime_type); return reply.send(createReadStream(photo.storage_path));
  });
};
