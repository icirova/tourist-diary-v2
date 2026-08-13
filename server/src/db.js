import pg from 'pg';
import { config } from './config.js';
export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 });
export const transaction = async (callback) => {
  const client = await pool.connect();
  try { await client.query('begin'); const result = await callback(client); await client.query('commit'); return result; }
  catch (error) { await client.query('rollback'); throw error; }
  finally { client.release(); }
};
