const pool = require('../configs/db.config');
const consultarPorId = require('./consultaIdFunc');

const validarLogin = async (id, pass) => {
    try {
        const resultado = await consultarPorId('EMPLEADO', id);

        if (resultado.rowCount > 0) {
            const resultadoNodemailer = await pool.query(
                `SELECT "CODIGO"
                FROM public."NODEMAILER"
                WHERE "USADO" = false AND "CODIGO" = '${pass}'`);

            if (resultado.rows[0].CONTRASENIA === pass) {
                console.log('Contraseña correcta');
                deshabilitarCodsRecuperacion(id);
                return { existeUsuario: true, passCorrecto: true, codigoEstado: 200, modoRecuperacion: false };
            } else if (resultadoNodemailer.rowCount > 0) {
                console.log('Contraseña temporal correcta');
                deshabilitarCodsRecuperacion(id);
                return { existeUsuario: true, passCorrecto: true, codigoEstado: 200, modoRecuperacion: true };
            } else {
                console.log('Contraseña incorrecta');
                return { existeUsuario: true, passCorrecto: false, codigoEstado: 401, modoRecuperacion: false };
            }
        } else {
            console.log('Usuario no encontrado');
            return { existeUsuario: false, passCorrecto: false, codigoEstado: 401, modoRecuperacion: false };
        }
    } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
        throw error;
    }
};

async function deshabilitarCodsRecuperacion(id) {
    await pool.query(`UPDATE public."NODEMAILER"
                SET "USADO" = true
                WHERE "ID" = $1`, [id]);
}

module.exports = {
    validarLogin,
    deshabilitarCodsRecuperacion
};