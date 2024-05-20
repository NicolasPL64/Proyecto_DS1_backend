require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rutaLogin = require('./src/rutas/loginRutas');
const rutaCRUD = require('./src/rutas/crudRutas');
const app = express();
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, '../Proyecto_DS1/dist')));

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Habilitar el uso de JSON en las peticiones

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../Proyecto_DS1/dist', 'index.html'));
});
app.use('/api/login', rutaLogin);
app.use('/api', rutaCRUD);

app.listen(PORT, () => {
    console.log(`--------> Backend escuchando en http://localhost:${PORT} <--------`);
});