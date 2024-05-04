const express = require('express');
const rutaLogin = express.Router();
const validarEmpleado = require('../funciones/loginFunc');

rutaLogin.post('/', async (req, res) => {
    try {
        const { id, pass } = req.body;
        const validacion = await validarEmpleado(id, pass);

        res.status(validacion.codigoEstado)
            .json({ existe: validacion.existeUsuario, correcto: validacion.passCorrecto });
    } catch (error) {
        throw error;
    }
});

module.exports = rutaLogin;