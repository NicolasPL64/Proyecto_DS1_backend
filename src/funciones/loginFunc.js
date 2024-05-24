const pool = require('../configs/db.config');
const consultarPorId = require('./consultaIdFunc');
const jwt = require('jsonwebtoken');

const validarLogin = async (id, pass) => {
    try {
        const resultado = await consultarPorId('EMPLEADO', id);
        let jsonReturn = {
            existeUsuario: false,
            passCorrecto: false,
            codigoEstado: 200,
            modoRecuperacion: false,
            modoAdmin: false,
            token: null
        };

        if (resultado != null) {
            const resultadoNodemailer = await pool.query(
                `SELECT "CODIGO"
                FROM public."NODEMAILER"
                WHERE "USADO" = false AND "CODIGO" = '${pass}'`);

            if (resultado.rows[0].ADMIN === true) jsonReturn.modoAdmin = true;

            if (resultado.rows[0].CONTRASENIA === pass) {
                console.log('Contraseña correcta');

                // Generar el token JWT
                const token = jwt.sign(
                    {
                        id: resultado.rows[0].ID, 
                        nombre: resultado.rows[0].NOMBRE, 
                        admin: resultado.rows[0].ADMIN,
                        habilitado: resultado.rows[0].HABILITADO 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRATION });

                deshabilitarCodsRecuperacion(id);
                return Object.assign(jsonReturn, { existeUsuario: true, passCorrecto: true, token: token });;
            } else if (resultadoNodemailer.rowCount > 0) {
                console.log('Contraseña temporal correcta');
                deshabilitarCodsRecuperacion(id);
                return Object.assign(jsonReturn, { existeUsuario: true, passCorrecto: true, modoRecuperacion: true });;
            } else {
                console.log('Contraseña incorrecta');
                return Object.assign(jsonReturn, { existeUsuario: true, codigoEstado: 401 });
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