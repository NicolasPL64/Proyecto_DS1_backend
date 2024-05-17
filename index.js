require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rutaLogin = require('./src/rutas/loginRutas');
const rutaCRUD = require('./src/rutas/crudRutas');
const app = express();
const PORT = process.env.PORT;

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones

app.use('/api/login', rutaLogin)
app.use('/api', rutaCRUD)

app.use(function (err, req, res, next) {
    console.error(err.stack); // Imprime el error en la consola
    console.log("Error capturado por Express, probablemente fue culpa de Petro.")
    res.sendStatus(500);
});

app.listen(PORT, () => {
    console.log(`--------> Backend escuchando en http://localhost:${PORT} <--------`);
});