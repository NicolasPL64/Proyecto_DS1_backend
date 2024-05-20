const express = require('express');
const rutaLogin = express.Router();
<<<<<<< HEAD
const validarEmpleado = require('../funciones/loginFunc');
const JsonWebToken = require('jsonwebtoken');
=======
const { validarLogin } = require('../funciones/loginFunc');
const recuperarContrasenia = require('../funciones/recuperarContraFunc');
const actualizarEnTabla = require('../funciones/actualizarFunc');
>>>>>>> 31ec54a9e928a6940c61212e0537d2a511b0cf87

rutaLogin.post('/', async (req, res) => {
    const { id, pass } = req.body;
    try {
<<<<<<< HEAD
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
=======
        const validacion = await validarLogin(id, pass);
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

rutaLogin.use(function (err, req, res, next) {
    if (err.statusCode) res.sendStatus(err.statusCode);
    next(err);
});

module.exports = rutaLogin;
>>>>>>> 31ec54a9e928a6940c61212e0537d2a511b0cf87
