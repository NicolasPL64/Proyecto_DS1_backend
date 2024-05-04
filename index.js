const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // En caso de que no se haya definido el puerto (por si hosteamos en Vercel o algo), se usa el 3000

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones

// Conexión a la base de datos desactivada para evitar tiempo de computación innecesario

const pool = new Pool({
    connectionString: "postgres://default:cZVGF62eRQsa@ep-floral-dream-a4cqkv4k-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
})



/* app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.personita;');
        //const result = await pool.query(`INSERT INTO public.personita(nombre) VALUES ('Luchoo');`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}); */

app.post('/api/login', async (req, res) => {
    try {
        const { id, pass } = req.body;
        const validacion = await validarEmpleado(id, pass);

        res.status(validacion.codigoEstado)
            .json({ existe: validacion.existeUsuario, correcto: validacion.passCorrecto });
    } catch (error) {
        throw error;
    }
});

app.listen(PORT, () => {
    console.log(`--------> Backend escuchando en http://localhost:${PORT} <--------`);
});

const validarEmpleado = async (id, pass) => {
    try {
        const resultado = await pool.query('SELECT * FROM public."EMPLEADO" WHERE "ID" = $1', [id]);

        if (resultado.rowCount > 0) {
            const empleado = resultado.rows[0];

            if (empleado.Contrasenia === pass) {
                console.log('Contraseña correcta');
                return { existeUsuario: true, passCorrecto: true, codigoEstado: 200 };
            } else {
                console.log('Contraseña incorrecta');
                return { existeUsuario: true, passCorrecto: false, codigoEstado: 401 };
            }
        } else {
            console.log('Usuario no encontrado');
            return { existeUsuario: false, passCorrecto: false, codigoEstado: 401 };
        }
    } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
        throw error;
    }
};