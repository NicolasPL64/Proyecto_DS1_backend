const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // En caso de que no se haya definido el puerto (por si hosteamos en Vercel o algo), se usa el 3000

app.use(cors()); // Habilitar CORS para todas las rutas

// Conexión a la base de datos desactivada para evitar tiempo de computación innecesario


/* const pool = new Pool({
    connectionString: "postgres://default:cZVGF62eRQsa@ep-floral-dream-a4cqkv4k-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
}) */


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


app.post('/admin', async (req, res) => {
    console.log('Admin123');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`----> Backend iniciado en http://localhost:${PORT}`);
});