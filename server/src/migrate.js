import { readFile } from 'node:fs/promises';
import { pool } from './db.js';
const sql = await readFile(new URL('../migrations/001_initial.sql', import.meta.url), 'utf8');
await pool.query(sql);
await pool.end();
console.log('Database migration completed.');
