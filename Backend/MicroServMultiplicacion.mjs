import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const REGISTROS_URL = process.env.REGISTROS_URL || 'http://localhost:3004/registros';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio Multiplicacion',
      version: '1.0.0',
      description: 'Realiza la operación de multiplicacion y registra los resultados',
    },
    servers: [{ url: 'http://localhost:3002' }],
  },
  apis: ['./backend/MicroServMultiplicacion.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Multiplicacion
 *     description: Métodos de multiplicacion usando distintos tipos de parámetros
 */

/**
 * @swagger
 * /multiplicacion/{dato1}/{dato2}:
 *   get:
 *     tags: [Multiplicacion]
 *     summary: Multiplica dos números mediante Path Params
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
 *         description: Resultado de la multiplicacion
 */

/**
 * @swagger
 * /multiplicacion:
 *   get:
 *     tags: [Multiplicacion]
 *     summary: Multiplica dos números mediante Query Params
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
 *         description: Resultado de la multiplicacion
 */

/**
 * @swagger
 * /multiplicacion:
 *   post:
 *     tags: [Multiplicacion]
 *     summary: Multiplica dos números mediante Body Params
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
 *         description: Resultado de la multiplicacion
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
    console.log('Registro insertado correctamente desde /multiplicacion');
  } catch (err) {
    console.error('Error notificando a registros:', err.message);
  }
}

app.get('/multiplicacion/:dato1/:dato2', async (req, res) => {
  const { dato1, dato2 } = req.params;

if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) * Number(dato2);
  await notificarRegistro({
    metodo: 'multiplicacion',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'multiplicacion', dato1, dato2, resultado });
});

app.get('/multiplicacion', async (req, res) => {
  const { dato1, dato2 } = req.query;

if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) * Number(dato2);
  await notificarRegistro({
    metodo: 'multiplicacion',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'multiplicacion', dato1, dato2, resultado });
});

app.post('/multiplicacion', async (req, res) => {
  const { dato1, dato2 } = req.body;

if (!validarNumeros(dato1, dato2, res)) return;

  const resultado = Number(dato1) * Number(dato2);
  await notificarRegistro({
    metodo: 'multiplicacion',
    dato1: String(dato1),
    dato2: String(dato2),
    resultado: String(resultado)
  });

  res.json({ metodo: 'multiplicacion', dato1, dato2, resultado });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Microservicio Multiplicacion corriendo en http://localhost:${PORT}`));
