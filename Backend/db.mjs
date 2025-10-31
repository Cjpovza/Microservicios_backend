import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './Backend/.env' });


let pool;

try {
  // Railway usa la variable MYSQLPUBLICURL o MYSQL_URL según el caso
  const dbUrl = process.env.MYSQLPUBLICURL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

  if (!dbUrl) {
    throw new Error('No se encontró la variable de conexión (MYSQL_PUBLIC_URL o MYSQL_URL)');
  }

  pool = mysql.createPool(dbUrl);

  console.log('Conexión establecida exitosamente con la base de datos en Railway.');
} catch (error) {
  console.error('Error al conectar con la base de datos:', error);
}
export { pool };

