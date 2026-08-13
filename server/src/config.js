import process from 'node:process';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};
export const config = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: required('DATABASE_URL'),
  keycloakUrl: required('KEYCLOAK_URL').replace(/\/$/, ''),
  keycloakRealm: required('KEYCLOAK_REALM'),
  keycloakClientId: required('KEYCLOAK_CLIENT_ID'),
  uploadsDir: process.env.UPLOADS_DIR || '/data/uploads',
  photoSecret: required('PHOTO_SIGNING_SECRET'),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  retentionEnabled: process.env.RETENTION_ENABLED === 'true',
  keycloakAdminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
  keycloakAdminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
  smtp: process.env.SMTP_HOST ? { host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD, from: process.env.SMTP_FROM } : null,
};
export const issuer = `${config.keycloakUrl}/realms/${config.keycloakRealm}`;
