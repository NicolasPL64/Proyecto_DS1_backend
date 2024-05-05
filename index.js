require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutaLogin = require('./src/rutas/loginRutas');
const app = express();
const PORT = process.env.PORT;

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones
app.use('/api/login', rutaLogin)

app.listen(PORT, () => {
    console.log(`--------> Backend escuchando en http://localhost:${PORT} <--------`);
});