const consultarPorId = require('./consultaIdFunc');
const insertarEnTabla = require('./insertarFunc');
const ErrorStatus = require('../../utilidades/ErrorStatus');
const pool = require('../../configs/db.config');

async function insertarReservaConCliente(req) {
    const habitacion = await consultarPorId('HABITACION', req.body.reserva.id_Habitacion);
    if (habitacion.rows[0].HABILITADO == false)
        throw new ErrorStatus('La habitación está deshabilitada.', 409);

    if (await comprobarCruces(req.body.reserva.f_entrada, req.body.reserva.f_salida, req.body.reserva.id_Habitacion))
        throw new ErrorStatus('Ya existe una reserva en esas fechas.', 409);

    const columnasCliente = Object.keys(req.body.cliente).map(key => key.toUpperCase());
    const valoresCliente = Object.values(req.body.cliente);
    await insertarEnTabla('CLIENTE', columnasCliente, valoresCliente);

    try {
        const columnasReserva = Object.keys(req.body.reserva).map(key => key.toUpperCase());
        const valoresReserva = Object.values(req.body.reserva);
        await insertarEnTabla('RESERVA', columnasReserva, valoresReserva);
    } catch (error) {
        if (error.code == 23503)
            throw new ErrorStatus('No existe la habitación.', 404);
        next(error);
    }
}

async function comprobarCruces(fechaEntrada, fechaSalida, idHabitacion) {
    const result = await pool.query(`SELECT * 
                                    FROM public."RESERVA" 
                                    WHERE (("F_ENTRADA" BETWEEN $1 AND $2) OR ("F_SALIDA" BETWEEN $3 AND $4))
                                        AND "ID_HABITACION" = $5 AND "HABILITADO" = true`,
        [fechaEntrada, fechaSalida, fechaEntrada, fechaSalida, idHabitacion]);
    return result.rowCount > 0;
}

module.exports = insertarReservaConCliente;