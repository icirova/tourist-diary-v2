import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { mkdir } from 'node:fs/promises';
import { authenticate, requireActive, requireAdmin } from './auth.js';
import { config } from './config.js';
import { pool } from './db.js';
import { registerTripRoutes } from './trips.js';
import { startRetentionSchedule } from './retention.js';

const app = Fastify({ logger: true, bodyLimit: 3 * 1024 * 1024 });
await mkdir(config.uploadsDir, { recursive: true });
await app.register(cors, { origin: config.frontendOrigin });
await app.register(multipart, { limits: { files: 3, fileSize: 768000, parts: 8 } });
await app.register(rateLimit, { global: false });

app.addHook('preHandler', async (request, reply) => {
  if (!request.url.startsWith('/api/') || request.url.startsWith('/api/photos/') || request.url === '/api/health') return;
  await authenticate(request, reply); if (reply.sent || request.url === '/api/me') return;
  await requireActive(request, reply);
});

app.get('/api/health', { preHandler: [] }, () => ({ ok: true }));
app.get('/api/me', async (request) => {
  const identity=request.identity;
  const { rows }=await pool.query(`insert into users(id,email,display_name,role,last_active_at)
    values($1,$2,$3,$4,now()) on conflict(id) do update set email=excluded.email,display_name=excluded.display_name,
    role=excluded.role,last_active_at=case when users.status='active' and users.last_active_at<now()-interval '1 day' then now() else users.last_active_at end,
    warned_at=case when users.status='active' then null else users.warned_at end,updated_at=now()
    returning id,email,display_name,role,status,last_active_at`,[identity.id,identity.email,identity.name,identity.role]);
  return { id:rows[0].id,email:rows[0].email,name:rows[0].display_name,role:rows[0].role,status:rows[0].status,lastActiveAt:rows[0].last_active_at };
});
app.get('/api/admin/usage', { preHandler: [requireAdmin] }, async () => {
  const { rows }=await pool.query(`select u.id "userId",u.email,u.status,count(distinct t.id)::int "tripCount",coalesce((select sum(size_bytes) from trip_photos p where p.owner_id=u.id),0)::bigint "photoBytes" from users u left join trips t on t.owner_id=u.id group by u.id order by u.email`);
  return rows;
});
await registerTripRoutes(app);
app.setErrorHandler((error,_request,reply)=>reply.code(error.statusCode||500).send({message:error.statusCode?error.message:'Serverová operace se nezdařila.'}));
startRetentionSchedule(app.log);
await app.listen({ port:config.port, host:'0.0.0.0' });
