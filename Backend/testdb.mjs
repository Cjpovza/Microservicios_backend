import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './Backend/.env' });

console.log("🔍 Variables de entorno cargadas:", process.env);

const dbUrl = process.env.MYSQLPUBLICURL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

if (!dbUrl) {
  console.error("No se encontró la variable de conexión MYSQL_PUBLIC_URL o MYSQL_URL");
  process.exit(1);
}

try {
  const pool = mysql.createPool(dbUrl);
  const [rows] = await pool.query("SELECT NOW() AS fecha_actual;");
  console.log("Conexión exitosa. Fecha actual del servidor:", rows[0].fecha_actual);
  process.exit(0);
} catch (err) {
  console.error("Error al conectar con la base de datos:", err.message);
  process.exit(1);
}
