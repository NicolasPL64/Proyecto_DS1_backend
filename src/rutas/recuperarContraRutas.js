const express = require('express');
const rutaRecuperarContra = express.Router();
const recuperarContrasenia = require('../funciones/recuperarContraFunc');

rutaRecuperarContra.post('/', async (req, res) => {
    recuperarContrasenia(req.body.id);
    // TODO: redireccionamiento a la página de cambio de contraseña
});

module.exports = rutaRecuperarContra;