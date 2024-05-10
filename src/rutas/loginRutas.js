const express = require('express');
const rutaLogin = express.Router();
const { validarLogin } = require('../funciones/loginFunc');

rutaLogin.post('/', async (req, res) => {
    try {
        const { id, pass } = req.body;
        const validacion = await validarLogin(id, pass);

        res.status(validacion.codigoEstado)
            .json({
                existe: validacion.existeUsuario,
                correcto: validacion.passCorrecto,
                recuperacion: validacion.modoRecuperacion
            });
    } catch (error) {
        console.error('Error al validar el login: ', error);
        throw error;
    }
});

module.exports = rutaLogin;