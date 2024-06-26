require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rutaLogin = require('./src/rutas/loginRutas');
const rutaCRUD = require('./src/rutas/crudRutas');
const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones
app.use(cookieParser());

app.use('/api/login', rutaLogin);
app.use('/api', rutaCRUD);

// Manejo de errores global
app.use(function (err, req, res, next) {
    if (err.statusCode) res.status(err.statusCode).send(err.message);
    else res.status(500).send("Ha ocurrido un error inesperado.");
    console.error(err.stack);
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').send();
});

app.listen(PORT, () => {
    console.log(`--------> Backend parando bolas en http://localhost:${PORT} <--------`);
});