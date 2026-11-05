import 'dotenv/config';
import { Sequelize } from 'sequelize';

const storage = process.env.DB_FILE_NAME;

if (!storage) {
  throw new Error('DB_FILE_NAME environment variable needed.');
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
});
