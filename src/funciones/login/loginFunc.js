const pool = require('../../configs/db.config');
const consultarPorId = require('../crud/consultaIdFunc');
const ErrorStatus = require('../../utilidades/ErrorStatus');
const jwt = require('jsonwebtoken');

const validarLogin = async (id, pass) => {
    const resultado = await consultarPorId('EMPLEADO', id);
    let jsonReturn = {
        todoCorrecto: false,
        modoRecuperacion: false,
        modoAdmin: false,
        token: null
    };

    if (resultado != null) {
        if (resultado.rows[0].HABILITADO === false) {
            console.log('Usuario inhabilitado');
            throw new ErrorStatus('Usuario inhabilitado.', 401);
        }

        const resultadoNodemailer = await pool.query(
            `SELECT "CODIGO"
                FROM public."NODEMAILER"
                WHERE "USADO" = false AND "CODIGO" = '${pass}'`);

        if (resultado.rows[0].ADMIN === true) jsonReturn.modoAdmin = true;

        if (resultado.rows[0].CONTRASENIA === pass) {
            console.log('Contraseña correcta');
            deshabilitarCodsRecuperacion(id);
            const token = tokenDatos(resultado, false);
            return Object.assign(jsonReturn, { todoCorrecto: true, token: token });;
        } else if (resultadoNodemailer.rowCount > 0) {
            console.log('Contraseña temporal correcta');
            deshabilitarCodsRecuperacion(id);
            const token = tokenDatos(resultado, true);
            return Object.assign(jsonReturn, { todoCorrecto: true, modoRecuperacion: true, token: token });;
        } else {
            console.log('Contraseña incorrecta');
            throw new ErrorStatus('Contraseña incorrecta.', 401);
        }
    } else {
        console.log('Usuario no encontrado');
        throw new ErrorStatus('Usuario no encontrado.', 401);
    }
};

async function deshabilitarCodsRecuperacion(id) {
    try {
        await pool.query(`UPDATE public."NODEMAILER"
                SET "USADO" = true
                WHERE "ID" = $1`, [id]);
    } catch (error) {
        console.error('Error al deshabilitar códigos de recuperación.');
        throw new ErrorStatus('Error al deshabilitar códigos de recuperación.', 500);
    }
}

function tokenDatos(resultado, modoRecuperacion) {
    return jwt.sign(
        {
            id: resultado.rows[0].ID,
            nombre: resultado.rows[0].NOMBRE,
            admin: resultado.rows[0].ADMIN,
            recuperacion: modoRecuperacion
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = {
    validarLogin,
    deshabilitarCodsRecuperacion
};