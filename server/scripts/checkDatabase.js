import { pool } from "../config/database.js";
import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function checkDatabase() {
  let connection;

  try {
    // Get DB connection
    connection = await pool.getConnection();
    console.log("Successfully connected to MariaDB!");
    
      const sqlPath = path.join(__dirname, 'db.sql');
      // Read SQL script
    const sqlScript = await fs.readFile(sqlPath, 'utf8');

    
  

    // Execute script
    await connection.query(sqlScript);
    console.log("All tables created!");
  } catch (error) {
    console.error("Database check failed:", error);
    process.exit(1); // Exit the process with failure
  } finally {
    // Ensure the connection is released
    if (connection) connection.release();
  }
}


// checkDatabase();