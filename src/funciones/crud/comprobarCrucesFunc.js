const pool = require('../../configs/db.config');

async function comprobarCruces(fechaEntrada, fechaSalida, idHabitacion, idReserva = null) {
    const result = await pool.query(`SELECT * 
                                    FROM public."RESERVA" 
                                    WHERE (("F_ENTRADA" BETWEEN $1 AND $2) OR ("F_SALIDA" BETWEEN $3 AND $4))
                                        AND "ID_HABITACION" = $5 AND "HABILITADO" = true
                                        AND "ID" <> $6;`,
        [fechaEntrada, fechaSalida, fechaEntrada, fechaSalida, idHabitacion, idReserva]);
    return result.rowCount > 0;
}

module.exports = comprobarCruces;