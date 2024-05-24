const express = require('express');
const rutaLogin = express.Router();
const { validarLogin } = require('../funciones/loginFunc');
const recuperarContrasenia = require('../funciones/recuperarContraFunc');
const actualizarEnTabla = require('../funciones/actualizarFunc');
const jwt = require('jsonwebtoken');


function verificarToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ mensaje: 'No se proporcionó ningún token' });
    }

    try {
        const datos = JsonWebToken.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
}

rutaLogin.post('/', async (req, res, next) => {
    const { id, pass } = req.body;
    try {
        const validacion = await validarLogin(id, pass);
        console.log("Token:", validacion.token);

        // Decodificar el token y imprimir los datos
        const decodedToken = jwt.decode(validacion.token);
        console.log("Datos del token:", decodedToken);

        // Configurar las opciones de la cookie
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            path: "/"
        };
        res.cookie('jwt', validacion.token, cookieOptions);
        res.status(validacion.codigoEstado)
            .json({
                existe: validacion.existeUsuario,
                correcto: validacion.passCorrecto,
                recuperacion: validacion.modoRecuperacion,
                admin: validacion.modoAdmin
            });
    } catch (error) {
        next(error);
    }
});

rutaLogin.use(verificarToken);

rutaLogin.post('/recuperarContra', async (req, res, next) => {
    try {
        const validacion = await recuperarContrasenia(req.body.id);
        res.status(validacion.codigoEstado)
            .json({ correo: validacion.correo });
    } catch (error) {
        next(error);
    }

});

rutaLogin.post('/cambiarContra', async (req, res, next) => {
    const { id, passNuevo } = req.body;
    try {
        await actualizarEnTabla('EMPLEADO', ['ID', 'CONTRASENIA'], [id, passNuevo]);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

//////////////////////////////////////////// 
/* 
rutaLogin.use(function (err, req, res, next) {
    if (err.statusCode) res.sendStatus(err.statusCode);
    next(err);
}); */

module.exports = rutaLogin;
