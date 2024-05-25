const consultarPorId = require('../crud/consultaIdFunc');
const insertarEnTabla = require('../crud/insertarFunc');
const { deshabilitarCodsRecuperacion } = require('./loginFunc');
const ErrorStatus = require('../../utilidades/errorStatus');
const pool = require('../../configs/db.config');
const transporter = require('../../configs/nmail.config');

async function recuperarContrasenia(id) {
    const infoEmpleado = await consultarPorId('EMPLEADO', id)
    if (infoEmpleado === null)
        throw new ErrorStatus(`El empleado con ID ${id} no se encuentra en la base de datos.`, 404);

    const infoNodemailer = await pool.query(
        `SELECT *
        FROM public."NODEMAILER"
        WHERE "USADO" = false AND "ID" = $1`, [id]);
    if (infoNodemailer.rowCount > 0) deshabilitarCodsRecuperacion(id);

    const passTemporal = Math.random().toString(36).slice(-9);

    var mensaje = {
        from: "Hotel Caribbean Paradise <" + process.env.NODEMAILER_EMAIL + ">",
        to: infoEmpleado.rows[0].CORREO,
        subject: "Recuperar contraseña",
        html: "Hola, " + infoEmpleado.rows[0].NOMBRE +
            ".<br><br> Tu nueva contraseña temporal es: <b>" + passTemporal +
            "</b><br>La contraseña temporal se deshabilitará una vez que inicies sesión." +
            "<br><br> Saludos, <br> Hotel Caribbean Paradise."
    };

    console.log('Credentials obtained, sending message to ' + mensaje.to);
    transporter.sendMail(mensaje, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return { codigoEstado: 500, correo: infoEmpleado.rows[0].CORREO };
        }
        insertarEnTabla('NODEMAILER', ['CODIGO', 'ID'], [passTemporal, id]);
        console.log('Message sent: %s', info.messageId);
        return { codigoEstado: 200, correo: infoEmpleado.rows[0].CORREO };
    });
}

module.exports = recuperarContrasenia;