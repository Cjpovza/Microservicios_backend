import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const REGISTROS_URL = 'http://localhost:3004/registros';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio Resta',
      version: '1.0.0',
      description: 'Realiza la operación de resta y registra los resultados',
    },
    servers: [{ url: 'http://localhost:3001' }],
  },
  apis: ['./backend/MicroServResta.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Resta
 *     description: Métodos de resta usando distintos tipos de parámetros
 */

/**
 * @swagger
 * /resta/{dato1}/{dato2}:
 *   get:
 *     tags: [Resta]
 *     summary: Resta dos números mediante Path Params
 *     parameters:
 *       - in: path
 *         name: dato1
 *         required: true
 *         schema: { type: number }
 *       - in: path
 *         name: dato2
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Resultado de la Resta
 */

/**
 * @swagger
 * /resta:
 *   get:
 *     tags: [Resta]
 *     summary: Resta dos números mediante Query Params
 *     parameters:
 *       - in: query
 *         name: dato1
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: dato2
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Resultado de la resta
 */

/**
 * @swagger
 * /resta:
 *   post:
 *     tags: [Resta]
 *     summary: Resta dos números mediante Body Params
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dato1, dato2]
 *             properties:
 *               dato1: { type: number, example: 5 }
 *               dato2: { type: number, example: 3 }
 *     responses:
 *       200:
 *         description: Resultado de la resta
 */


function validarNumeros(d1, d2, res) {
  if (isNaN(d1) || isNaN(d2)) {
    res.status(400).json({ error: 'Los parámetros deben ser numéricos' });
    return false;
  }
  return true;
}


async function notificarRegistro(payload) {
  try {
    await fetch(REGISTROS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Registro insertado correctamente desde /resta');
  } catch (err) {
    console.error('Error notificando a registros:', err.message);
  }
}

app.get('/resta/:dato1/:dato2', async (req, res) => {
  const { dato1, dato2 } = req.params;

  if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) - Number(dato2);
  await notificarRegistro({
    metodo: 'resta',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'resta', dato1, dato2, resultado });
});

app.get('/resta', async (req, res) => {
  const { dato1, dato2 } = req.query;

  if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) - Number(dato2);
  await notificarRegistro({
    metodo: 'resta',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'resta', dato1, dato2, resultado });
});

app.post('/resta', async (req, res) => {
  const { dato1, dato2 } = req.body;

   if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) - Number(dato2);
  await notificarRegistro({
    metodo: 'resta',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'resta', dato1, dato2, resultado });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Microservicio Resta corriendo en http://localhost:${PORT}`));
