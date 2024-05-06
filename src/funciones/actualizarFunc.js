const ejecutarConsulta = require("./ejecutarCRUD");

const actualizarEnTabla = async (tabla, columnas, valores) => {
    try {
        const consultaActualizacion = `
            UPDATE public."${tabla}"
            SET ${columnas.map((col, i) => `"${col}" = $${i + 2}`).join(", ")}
            WHERE "ID" = $1
            RETURNING *;`;
        const result = await ejecutarConsulta(consultaActualizacion, valores);
        console.log(`${tabla} actualizado:`, result);
        return result;
    } catch (error) {
        console.error(`Error al actualizar ${tabla}:`, error);
        throw error;
    }
};

const actualizarCliente = async (id, nuevoNombre, nuevoCorreo, nuevoTelefono) => {
    return await actualizarEnTabla("CLIENTE", ["Nombre", "Correo", "Telefono"], [id, nuevoNombre, nuevoCorreo, nuevoTelefono]);
};

const actualizarEmpleado = async (id, nuevaContraseña, nuevoCorreo, nuevoNombre, nuevaFechaNacimiento, nuevaDireccion, nuevoSalario, nuevoTelefono, nuevaFechaInicio) => {
    return await actualizarEnTabla("EMPLEADO", ["CONTRASENIA", "CORREO", "NOMBRE", "FECHA_NACIMIENTO", "DIRECCION", "SALARIO", "TELEFONO", "FECHA_INICIO"], [id, nuevaContraseña, nuevoCorreo, nuevoNombre, nuevaFechaNacimiento, nuevaDireccion, nuevoSalario, nuevoTelefono, nuevaFechaInicio]);
};

const actualizarHabitacion = async (id, nuevoTipo, nuevoPrecio, nuevoEstado, nuevaCapacidad) => {
    return await actualizarEnTabla("HABITACION", ["TIPO", "PRECIO", "ESTADO", "CAPACIDAD"], [id, nuevoTipo, nuevoPrecio, nuevoEstado, nuevaCapacidad]);
};

const actualizarReserva = async (id, nuevoEstado, nuevaFechaEntrada, nuevaFechaSalida, nuevoIdCliente, nuevoIdEmpleado, nuevoIdHabitacion) => {
    return await actualizarEnTabla("RESERVA", ["ESTADO", "F_ENTRADA", "F_SALIDA", "ID_CLIENTE", "ID_EMPLEADO", "ID_HABITACION"], [id, nuevoEstado, nuevaFechaEntrada, nuevaFechaSalida, nuevoIdCliente, nuevoIdEmpleado, nuevoIdHabitacion]);
};

module.exports = actualizarEnTabla;