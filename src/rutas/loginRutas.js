const express = require('express');
const rutaLogin = express.Router();
const { validarLogin } = require('../funciones/loginFunc');
const recuperarContraseni = require('../funciones/recuperarContraFunc');
const actualizarEnTabla = require('../funciones/actualizarFunc');

rutaLogin.post('/', async (req, res) => {
    const { id, pass } = req.body;
    const validacion = await validarLogin(id, pass);

    res.status(validacion.codigoEstado)
        .json({
            existe: validacion.existeUsuario,
            correcto: validacion.passCorrecto,
            recuperacion: validacion.modoRecuperacion
        });
});

rutaLogin.post('/recuperarContra', async (req, res) => {
    const validacion = await recuperarContraseni(req.body.id);
    res.status(validacion.codigoEstado)
        .json({ correo: validacion.correo });
});

rutaLogin.post('/cambiarContra', async (req, res) => {
    const { id, passNuevo } = req.body;
    await actualizarEnTabla('EMPLEADO', ['ID', 'CONTRASENIA'], [id, passNuevo]);
    res.status(200).end();
});

module.exports = rutaLogin;