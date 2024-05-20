const express = require('express');
const rutaLogin = express.Router();
const validarEmpleado = require('../funciones/loginFunc');
const JsonWebToken = require('jsonwebtoken');

rutaLogin.post('/', async (req, res) => {
    try {
        const { id, pass } = req.body;
        const validacion = await validarEmpleado(id, pass);

        if (validacion.existeUsuario && validacion.passCorrecto) {

            console.log("Token:", validacion.token);
            
            // Configurar las opciones de la cookie
            const cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true,
                path: "/"
            };

            // Configurar la cookie en la respuesta
            res.cookie('jwt', validacion.token, cookieOptions);
            res.status(200).send({ status: "ok", message: "loggeado" });
        } else {
            res.status(401).send({ status: "error", message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});

module.exports = rutaLogin;
