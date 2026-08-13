import { createRemoteJWKSet, jwtVerify } from 'jose';
import { config, issuer } from './config.js';
import { pool } from './db.js';
const jwks = createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`));

export const authenticate = async (request, reply) => {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return reply.code(401).send({ message: 'Chybí přihlášení.' });
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer });
    const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (payload.azp !== config.keycloakClientId && !audience.includes(config.keycloakClientId)) throw new Error('Wrong client');
    const roles = new Set([...(payload.realm_access?.roles || []), ...(payload.resource_access?.[config.keycloakClientId]?.roles || [])]);
    request.identity = { id: payload.sub, email: payload.email || '', name: payload.name || payload.preferred_username || payload.email, role: roles.has('admin') ? 'admin' : 'user' };
  } catch { return reply.code(401).send({ message: 'Přihlášení vypršelo nebo není platné.' }); }
};

export const requireActive = async (request, reply) => {
  const result = await pool.query('select status from users where id=$1', [request.identity.id]);
  if (result.rows[0]?.status !== 'active') return reply.code(403).send({ message: 'Účet není aktivní.' });
};
export const requireAdmin = async (request, reply) => {
  if (request.identity.role !== 'admin') return reply.code(403).send({ message: 'Přístup je pouze pro administrátora.' });
};
