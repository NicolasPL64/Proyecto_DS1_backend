const express = require('express');
const rutaLogin = express.Router();
const { validarLogin } = require('../funciones/login/loginFunc');
const recuperarContrasenia = require('../funciones/login/recuperarContraFunc');
const actualizarEnTabla = require('../funciones/crud/actualizarFunc');
const verificarToken = require('../middleware/verificarToken');
const ErrorStatus = require('../utilidades/ErrorStatus');
const jwt = require('jsonwebtoken');


rutaLogin.post('/', async (req, res, next) => {
    const { id, pass } = req.body;

    try {
        const validacion = await validarLogin(id, pass);
        console.log("Token:", validacion.token);

        const decodedToken = jwt.decode(validacion.token);
        console.log("Datos del token: ", decodedToken);

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        };
        res.cookie('token', validacion.token, cookieOptions);
        res.status(200)
            .json({
                correcto: validacion.todoCorrecto,
                modo_Recuperacion: validacion.modoRecuperacion,
                modo_Admin: validacion.modoAdmin,
                token: validacion.token
            });
    } catch (error) {
        next(error);
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

rutaLogin.put('/cambiarContra', verificarToken, async (req, res, next) => {
    const { id, recuperacion } = req.usuario;
    const { passNuevo } = req.body;
    try {
        if (!recuperacion) throw new ErrorStatus('No tienes permiso para cambiar la contraseña.', 401)

        await actualizarEnTabla('EMPLEADO', ['ID', 'CONTRASENIA'], [id, passNuevo]);
        res.clearCookie('token').sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = rutaLogin;
