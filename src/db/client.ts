import Database from 'better-sqlite3';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const filename = process.env.DB_FILE_NAME;
if (!filename) throw new Error('DB_FILE_NAME is required');

const sqlite = new Database(filename);

export const db = drizzle(sqlite);
