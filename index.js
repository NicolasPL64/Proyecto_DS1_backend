require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutaLogin = require('./src/rutas/loginRutas');
const rutaCRUD = require('./src/rutas/crudRutas');
const app = express();
const PORT = process.env.PORT;

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones

app.use('/api/login', rutaLogin);
app.use('/api', rutaCRUD);

// Manejo de errores global
app.use(function (err, req, res, next) {
    if (err.statusCode) res.status(err.statusCode).send(err.message);
    else res.sendStatus(500);
    console.error(err.stack); // Imprime el error en la consola
    console.log("Error capturado por Express, probablemente fue culpa de Petro.")
});

app.listen(PORT, () => {
    console.log(`--------> Backend parando bolas en http://localhost:${PORT} <--------`);
});