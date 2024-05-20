const express = require('express');
const rutaLogin = express.Router();
const { validarLogin } = require('../funciones/loginFunc');
const recuperarContrasenia = require('../funciones/recuperarContraFunc');
const actualizarEnTabla = require('../funciones/actualizarFunc');

rutaLogin.post('/', async (req, res) => {
    const { id, pass } = req.body;
    try {
        const validacion = await validarLogin(id, pass);
        res.status(validacion.codigoEstado)
            .json({
                existe: validacion.existeUsuario,
                correcto: validacion.passCorrecto,
                recuperacion: validacion.modoRecuperacion,
                admin: validacion.modoAdmin
            });
    } catch (error) {
        res.sendStatus(500);
    }
});

rutaLogin.post('/recuperarContra', async (req, res, next) => {
    try {
        const validacion = await recuperarContrasenia(req.body.id);
        res.status(validacion.codigoEstado)
            .json({ correo: validacion.correo });
    } catch (error) {
        next(error);
    }

});

rutaLogin.post('/cambiarContra', async (req, res) => {
    const { id, passNuevo } = req.body;
    await actualizarEnTabla('EMPLEADO', ['ID', 'CONTRASENIA'], [id, passNuevo]);
    res.sendStatus(200);
});

//////////////////////////////////////////// 

rutaLogin.use(function (err, req, res, next) {
    res.sendStatus(err.statusCode);
    next(err);
});

module.exports = rutaLogin;