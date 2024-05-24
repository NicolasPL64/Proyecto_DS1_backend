const consultarPorId = require('./consultaIdFunc');
const insertarEnTabla = require('./insertarFunc');
const ErrorStatus = require('../utilidades/errorStatus');
const pool = require('../configs/db.config');

async function insertarReservaConCliente(req) {
    if (await comprobarCruceFechas(req.body.reserva.f_entrada, req.body.reserva.f_salida))
        throw new ErrorStatus('Ya existe una reserva en esas fechas.', 409);

    // Comprueba si el cliente ya existe en la base de datos
    if (await consultarPorId('CLIENTE', req.body.cliente.id) == null) {
        const columnasCliente = Object.keys(req.body.cliente).map(key => key.toUpperCase());
        const valoresCliente = Object.values(req.body.cliente);
        await insertarEnTabla('CLIENTE', columnasCliente, valoresCliente);
    }
    const columnasReserva = Object.keys(req.body.reserva).map(key => key.toUpperCase());
    const valoresReserva = Object.values(req.body.reserva);
    await insertarEnTabla('RESERVA', columnasReserva, valoresReserva);
}

async function comprobarCruceFechas(fechaEntrada, fechaSalida) {
    const result = await pool.query(`SELECT * 
                                    FROM public."RESERVA" 
                                    WHERE ("F_ENTRADA" BETWEEN $1 AND $2) OR ("F_SALIDA" BETWEEN $3 AND $4)`,
        [fechaEntrada, fechaSalida, fechaEntrada, fechaSalida]);
    return result.rowCount > 0;
}

module.exports = insertarReservaConCliente;