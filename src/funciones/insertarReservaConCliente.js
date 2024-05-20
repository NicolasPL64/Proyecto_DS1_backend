const consultarPorId = require('./consultaIdFunc');
const insertarEnTabla = require('./insertarFunc');

async function insertarReservaConCliente(req) {
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

module.exports = insertarReservaConCliente;