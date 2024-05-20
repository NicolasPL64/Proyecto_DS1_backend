const pool = require('../configs/db.config');
<<<<<<< HEAD
const JsonWebToken = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
=======
const consultarPorId = require('./consultaIdFunc');
>>>>>>> 31ec54a9e928a6940c61212e0537d2a511b0cf87

const validarLogin = async (id, pass) => {
    try {
        const resultado = await consultarPorId('EMPLEADO', id);
        let jsonReturn = {
            existeUsuario: false,
            passCorrecto: false,
            codigoEstado: 200,
            modoRecuperacion: false,
            modoAdmin: false
        };

        if (resultado != null) {
            const resultadoNodemailer = await pool.query(
                `SELECT "CODIGO"
                FROM public."NODEMAILER"
                WHERE "USADO" = false AND "CODIGO" = '${pass}'`);

            if (resultado.rows[0].ADMIN === true) jsonReturn.modoAdmin = true;

            if (resultado.rows[0].CONTRASENIA === pass) {
                console.log('Contraseña correcta');
<<<<<<< HEAD

                // Generar el token JWT
                const token = JsonWebToken.sign({ id: resultado.id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRATION });

                return { existeUsuario: true, passCorrecto: true, codigoEstado: 200, token };
=======
                deshabilitarCodsRecuperacion(id);
                return Object.assign(jsonReturn, { existeUsuario: true, passCorrecto: true });;
            } else if (resultadoNodemailer.rowCount > 0) {
                console.log('Contraseña temporal correcta');
                deshabilitarCodsRecuperacion(id);
                return Object.assign(jsonReturn, { existeUsuario: true, passCorrecto: true, modoRecuperacion: true });;
>>>>>>> 31ec54a9e928a6940c61212e0537d2a511b0cf87
            } else {
                console.log('Contraseña incorrecta');
                return Object.assign(jsonReturn, { existeUsuario: true, codigoEstado: 401 });;
            }
        } else {
            console.log('Usuario no encontrado');
            return Object.assign(jsonReturn, { codigoEstado: 401 });;
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión: ', error);
        throw error;
    }
};

async function deshabilitarCodsRecuperacion(id) {
    try {
        await pool.query(`UPDATE public."NODEMAILER"
                SET "USADO" = true
                WHERE "ID" = $1`, [id]);
    } catch (error) {
        console.error('Error al deshabilitar códigos de recuperación.');
        throw error;
    }
}

module.exports = {
    validarLogin,
    deshabilitarCodsRecuperacion
};