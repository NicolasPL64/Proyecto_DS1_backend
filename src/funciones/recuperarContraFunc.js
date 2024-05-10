const consultarPorId = require('./consultaIdFunc');
const insertarEnTabla = require('./insertarFunc');
const { deshabilitarCodsRecuperacion } = require('./loginFunc');
const pool = require('../configs/db.config');
const transporter = require('../configs/nmail.config');

async function recuperarContrasenia(id) {
    const infoEmpleado = await consultarPorId('EMPLEADO', id)
    if (infoEmpleado === null) {
        console.log(`El empleado con ID ${id} no se encuentra en la base de datos.`);
        return null;
    }

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
            return process.exit(1);
        }
        insertarEnTabla('NODEMAILER', ['CODIGO', 'ID'], [passTemporal, id]);
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = recuperarContrasenia;