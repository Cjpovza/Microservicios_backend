import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',              
  database: 'microservicios2_db', 
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
