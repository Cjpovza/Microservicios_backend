import express from 'express';
import cors from 'cors';
import { pool } from './db.mjs'; 
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(cors());
app.use(express.json());


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Registros (CRUD)',
      version: '1.0.0',
      description: 'CRUD para registros de operaciones (CREATE, READ, UPDATE, DELETE)'
    },
    servers: [{ url: 'http://localhost:3004' }],
  },
  apis: ['./backend/RegistrosService.mjs'],
};



const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * tags:
 *   - name: Registros
 *     description: Operaciones CRUD sobre registros
 */

/**
 * @swagger
 * /registros:
 *   post:
 *     tags: [Registros]
 *     summary: Inserta un nuevo registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [metodo, dato1, dato2, resultado]
 *             properties:
 *               metodo: { type: string, example: "suma" }
 *               dato1: { type: string, example: "5" }
 *               dato2: { type: string, example: "3" }
 *               resultado: { type: string, example: "8" }
 *     responses:
 *       200:
 *         description: Registro insertado correctamente
 */

/**
 * @swagger
 * /registros:
 *   get:
 *     tags: [Registros]
 *     summary: Obtiene todos los registros
 *     responses:
 *       200:
 *         description: Lista de registros
 */

/**
 * @swagger
 * /registros/{id}:
 *   get:
 *     tags: [Registros]
 *     summary: Obtiene un registro por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Registro encontrado
 */

/**
 * @swagger
 * /registros/{id}:
 *   put:
 *     tags: [Registros]
 *     summary: Actualiza un registro por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo: { type: string }
 *               dato1: { type: string }
 *               dato2: { type: string }
 *               resultado: { type: string }
 *     responses:
 *       200:
 *         description: Registro actualizado
 */

/**
 * @swagger
 * /registros/{id}:
 *   delete:
 *     tags: [Registros]
 *     summary: Elimina un registro por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Registro eliminado
 */

// Verificar conexión con la base de datos
try {
  const [rows] = await pool.query('SELECT 1');
  console.log('Conexión exitosa con la base de datos');
} catch (err) {
  console.error('Error al conectar con la base de datos:', err.message);
}


// CREATE
app.post('/registros', async (req, res) => {
  const { metodo, dato1, dato2, resultado } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO registros (metodo, dato1, dato2, resultado) VALUES (?, ?, ?, ?)',
      [metodo, dato1, dato2, resultado]
    );

    const [nuevoRegistro] = await pool.query(
      'SELECT * FROM registros WHERE id = ?',
      [result.insertId]
    );

    res.json({ mensaje: 'Registro insertado', registro: nuevoRegistro[0] });
  } catch (error) {
    console.error('Error al insertar registro:', error);
    res.status(500).json({ error: 'No se pudo insertar' });
  }
});


// READ ALL
app.get('/registros', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM registros ORDER BY fecha DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// READ ONE
app.get('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM registros WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
});

// UPDATE
app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { metodo, dato1, dato2, resultado } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE registros SET metodo = ?, dato1 = ?, dato2 = ?, resultado = ? WHERE id = ?',
      [metodo, dato1, dato2, resultado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ mensaje: 'Registro actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
});

// DELETE
app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM registros WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ mensaje: 'Registro eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Microservicio Registros corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});
