const ejecutarConsulta = require("./ejecutarCRUD");

const consultarPorId = async (tabla, id) => {
    try {
        const consulta = `SELECT * FROM public."${tabla}" WHERE "ID" = $1`;
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.length === 0) {
            console.log(`El registro con ID ${id} no se encuentra en la tabla ${tabla}.`);
            return null;
        }

        const resultFormateado = tabla === "EMPLEADO" || tabla === "RESERVA" ? arreglarFechas(result) : result;
        console.log(`${tabla} encontrado:`, resultFormateado);
        return resultFormateado;
    } catch (error) {
        console.error(`Error al buscar ${tabla} por ID:`, error);
        throw error;
    }
};

const consultarClientePorId = async (id) => {
    return await consultarPorId("CLIENTE", id);
};

const consultarEmpleadoPorId = async (id) => {
    return await consultarPorId("EMPLEADO", id);
};

const consultarHabitacionPorId = async (id) => {
    return await consultarPorId("HABITACION", id);
};

const consultarReservaPorId = async (id) => {
    return await consultarPorId("RESERVA", id);
};

module.exports = consultarPorId;