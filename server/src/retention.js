import { unlink } from 'node:fs/promises';
import nodemailer from 'nodemailer';
import { config, issuer } from './config.js';
import { pool } from './db.js';

const mailer = config.smtp ? nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure, auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined }) : null;
const notify = async (to, subject, text) => {
  if (!mailer || !config.smtp.from) throw new Error('SMTP is not configured');
  await mailer.sendMail({ from: config.smtp.from, to, subject, text });
};
const keycloakAdminToken = async () => {
  const response = await fetch(`${issuer}/protocol/openid-connect/token`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({ grant_type:'client_credentials', client_id:config.keycloakAdminClientId, client_secret:config.keycloakAdminClientSecret }) });
  if(!response.ok) throw new Error(`Keycloak admin token failed: ${response.status}`); return (await response.json()).access_token;
};

export const runRetention = async (log = console) => {
  if (!config.retentionEnabled) return;
  const warnings=(await pool.query(`select id,email from users where role='user' and status='active' and warned_at is null and last_active_at <= now()-interval '5 months'`)).rows;
  for(const user of warnings) try { await notify(user.email,'Upozornění na neaktivní cestovní deník','Přihlaste se prosím. Po šesti měsících neaktivity bude účet přesunut do 30denní karantény.'); await pool.query('update users set warned_at=now() where id=$1',[user.id]); } catch(error){ log.error(error); }
  const quarantines=(await pool.query(`update users set status='quarantined',scheduled_delete_at=now()+interval '30 days' where role='user' and status='active' and last_active_at <= now()-interval '6 months' returning id,email`)).rows;
  for(const user of quarantines) try { await notify(user.email,'Účet cestovního deníku je v karanténě','Účet bude za 30 dní trvale smazán. Pro obnovení kontaktujte administrátorku.'); } catch(error){ log.error(error); }
  const expired=(await pool.query(`select id from users where role='user' and status='quarantined' and scheduled_delete_at <= now()`)).rows;
  if(!expired.length) return;
  const token=await keycloakAdminToken();
  for(const user of expired) {
    const photos=(await pool.query('select storage_path from trip_photos where owner_id=$1',[user.id])).rows;
    const response=await fetch(`${config.keycloakUrl}/admin/realms/${encodeURIComponent(config.keycloakRealm)}/users/${encodeURIComponent(user.id)}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
    if(!response.ok && response.status!==404){log.error(`Keycloak delete failed for ${user.id}: ${response.status}`);continue;}
    await pool.query('delete from users where id=$1',[user.id]); await Promise.all(photos.map((p)=>unlink(p.storage_path).catch(()=>{})));
  }
};

export const startRetentionSchedule = (log) => {
  if(!config.retentionEnabled) return;
  runRetention(log).catch((error)=>log.error(error));
  setInterval(()=>runRetention(log).catch((error)=>log.error(error)),24*60*60*1000).unref();
};
