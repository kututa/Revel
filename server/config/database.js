import dotenv from 'dotenv'
dotenv.config()
import pkg from 'mariadb';
export const pool = pkg.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  queueLimit: 0
});