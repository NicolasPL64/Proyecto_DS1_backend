// Este script por lo pronto no hace nada, pero no lo voy a borrar aún.

const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000; // En caso de que no se haya definido el puerto (por si hosteamos en Vercel o algo), se usa el 3000


const { Client } = require('pg');

let client;

const conectar = async () => {
    if (!client) {
        client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'HOTEL',
            password: '1234',
            port: 5432,
        });
        await client.connect(); //genera la conexion
    }
};

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const desconectar = async () => {
    if (client) {
        await client.end(); //finaliza la conexion
        client = undefined; //se hace para poder luego generar un nuevo client 
    }
};


// Configurar el middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json());

// Rutas y lógica de la aplicación
app.post('/api/crearReserva', async (req, res) => {
    try {
        const { id, estado, f_entrada, f_salida, idCliente, idEmpleado, idHabitacion } = req.body;
        // Aquí va tu lógica para insertar la reserva
        await insertarReserva(id, estado, f_entrada, f_salida, idCliente, idEmpleado, idHabitacion)
        res.status(200).json({ hola: "Reserva Creada Correctamente" });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


///////////////////////////////////////////////////////////////
const ejecutarConsulta = async (consulta, values) => {
    try {
        await conectar(); // Llamado para CONECTAR
        let res;
        if (values) {
            res = await client.query(consulta, values); // Hace la consulta con los valores proporcionados
        } else {
            res = await client.query(consulta); // Hace la consulta sin valores
        }
        return res.rows; // Retorna el resultado 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


// Función para formatear las fechas en los datos obtenidos
const arreglarFechas = (data) => {
    data.forEach(item => {
        // Formatear fechas de nacimiento e inicio en objetos de empleados
        if (item['FECHA_NACIMIENTO']) {
            const fechaNacimiento = new Date(item['FECHA_NACIMIENTO']);
            item['FECHA_NACIMIENTO'] = `${fechaNacimiento.getDate().toString().padStart(2, '0')}-${(fechaNacimiento.getMonth() + 1).toString().padStart(2, '0')}-${fechaNacimiento.getFullYear()}`;
        }
        if (item['FECHA_INICIO']) {
            const fechaInicio = new Date(item['FECHA_INICIO']);
            item['FECHA_INICIO'] = `${fechaInicio.getDate().toString().padStart(2, '0')}-${(fechaInicio.getMonth() + 1).toString().padStart(2, '0')}-${fechaInicio.getFullYear()}`;
        }

        // Formatear fechas de entrada y salida en objetos de reservas
        if (item['F_ENTRADA']) {
            const fechaEntrada = new Date(item['F_ENTRADA']);
            item['F_ENTRADA'] = `${fechaEntrada.getDate().toString().padStart(2, '0')}-${(fechaEntrada.getMonth() + 1).toString().padStart(2, '0')}-${fechaEntrada.getFullYear()}`;
        }
        if (item['F_SALIDA']) {
            const fechaSalida = new Date(item['F_SALIDA']);
            item['F_SALIDA'] = `${fechaSalida.getDate().toString().padStart(2, '0')}-${(fechaSalida.getMonth() + 1).toString().padStart(2, '0')}-${fechaSalida.getFullYear()}`;
        }
    });

    return data;
};


/*CONSULTAR*/

const todosEmpleados = async () => {
    const consulta = 'SELECT * FROM public."EMPLEADO"';
    const result = await ejecutarConsulta(consulta);
    // Formatear las fechas en cada objeto de resultado
    const empleadosFormateados = arreglarFechas(result);

    console.log(empleadosFormateados);
    return empleadosFormateados;
};

const todosClientes = async () => {
    const consulta = 'SELECT * FROM public."CLIENTE"';
    const result = await ejecutarConsulta(consulta);
    console.log(result);
    return result;
};

const todasHabitaciones = async () => {
    const consulta = 'SELECT * FROM public."HABITACION"';
    const result = await ejecutarConsulta(consulta);
    console.log(result);
    return result;
};

const todasReservas = async () => {
    const consulta = 'SELECT * FROM public."RESERVA"';
    const result = await ejecutarConsulta(consulta);
    // Formatear las fechas en cada objeto de resultado
    const reservasFormateadas = arreglarFechas(result);

    console.log(reservasFormateadas);
    return reservasFormateadas;
}


/*INSETAR*/

// Función para insertar un nuevo cliente
const insertarCliente = async (id, nombre, correo, telefono) => {
    try {
        // Verificar si el cliente ya existe
        const consultaExistencia = `
            SELECT COUNT(*) AS count
            FROM public."CLIENTE"
            WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count > 0) {
            console.log("El cliente ya está registrado en la base de datos.");
            return; // No se hace la inserción si el cliente ya existe
        }

        // Insertar el cliente si no existe
        const consultaInsercion = `
            INSERT INTO public."CLIENTE" ("ID", "Nombre", "Correo", "Telefono")
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;
        const values = [id, nombre, correo, telefono];
        const result = await ejecutarConsulta(consultaInsercion, values);
        console.log("Cliente insertado:", result);
        return result;
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        throw error;
    }
};

const insertarEmpleado = async (id, contraseña, correo, nombre, fecha_nac, direccion, salario, telefono, fecha_inicio) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."EMPLEADO"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count > 0) {
            console.log("El empleado ya se encuentra registrado en la base de datos.");
            return;
        }

        const consultaInsercion = `
        INSERT INTO public."EMPLEADO"(
            "ID", "CONTRASENIA", "CORREO", "NOMBRE", "FECHA_NACIMIENTO", "DIRECCION", "SALARIO", "TELEFONO", "FECHA_INICIO")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;`;
        const values = [id, contraseña, correo, nombre, fecha_nac, direccion, salario, telefono, fecha_inicio];
        const result = await ejecutarConsulta(consultaInsercion, values);

        const empleadosFormateados = arreglarFechas(result);
        console.log("Empleado insertado: ", result);
        return empleadosFormateados;
    } catch (error) {
        console.log('Error al insertar empleado: ', error);
        throw error;
    }
};

const insertarHabitacion = async (id, tipo, precio, estado, capacidad) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."HABITACION"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count > 0) {
            console.log("La habitacion ya se encuentra registrada en la base de datos");
            return;
        }

        const consultaInsercion = `
        INSERT INTO public."HABITACION"(
            "ID", "TIPO", "PRECIO", "ESTADO", "CAPACIDAD")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`;
        const values = [id, tipo, precio, estado, capacidad];
        const result = await ejecutarConsulta(consultaInsercion, values);
        console.log("Habitacion insertada: ", result);
        return result;
    } catch (error) {
        console.log('Error al insertar habitacion: ', error);
        throw error;
    }
}

const insertarReserva = async (id, estado, f_entrada, f_salida, idCliente, idEmpleado, idHabitacion) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."RESERVA"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count > 0) {
            console.log("La reserva ya se encuentra en la base de datos");
            return;
        }

        const consultaInsercion = `
        INSERT INTO public."RESERVA"(
            "ID", "ESTADO", "F_ENTRADA", "F_SALIDA", "ID_CLIENTE", "ID_EMPLEADO", "ID_HABITACION")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`;
        const values = [id, estado, f_entrada, f_salida, idCliente, idEmpleado, idHabitacion];
        const result = await ejecutarConsulta(consultaInsercion, values);

        const reservasFormateadas = arreglarFechas(result);
        console.log("Reserva Creada: ", result);
        return reservasFormateadas;
    } catch (error) {
        console.log('Error al crear la reserva: ', error);
        throw error;
    }
}




/*ELIMINAR*/
// Función para eliminar una habitación por su ID
const eliminarHabitacion = async (id) => {
    try {
        const consultaExistencia = `
            SELECT COUNT(*) AS count
            FROM public."HABITACION"
            WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count === 0) {
            console.log("La habitación con ID", id, "no se encuentra en la base de datos.");
            return;
        }

        const consultaEliminacion = `
            DELETE FROM public."HABITACION"
            WHERE "ID" = $1
            RETURNING *;`;
        const result = await ejecutarConsulta(consultaEliminacion, [id]);
        console.log("Habitación eliminada:", result);
        return result;
    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        throw error;
    }
};

const eliminarCliente = async (id) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."CLIENTE"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count === 0) {
            console.log("El cliente con ID", id, "no se encuentra en la base de datos.");
            return;
        }

        const consultaEliminacion = `
        DELETE FROM public."CLIENTE"
        WHERE "ID" = $1
        RETURNING *;`;
        const result = await ejecutarConsulta(consultaEliminacion, [id]);
        console.log("Cliente eliminado:", result);
        return result;
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        throw error;
    }
};

const eliminarEmpleado = async (id) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."EMPLEADO"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count === 0) {
            console.log("El empleado con ID", id, "no se encuentra en la base de datos.");
            return;
        }

        const consultaEliminacion = `
        DELETE FROM public."EMPLEADO"
        WHERE "ID" = $1
        RETURNING *;`;
        const result = await ejecutarConsulta(consultaEliminacion, [id]);

        const empleadosFormateados = arreglarFechas(result);
        console.log("Empleado eliminado:", result);
        return empleadosFormateados;
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        throw error;
    }
};


const eliminarReserva = async (id) => {
    try {
        const consultaExistencia = `
        SELECT COUNT(*) AS count
        FROM public."RESERVA"
        WHERE "ID" = $1`;
        const existencia = await ejecutarConsulta(consultaExistencia, [id]);

        if (existencia[0].count === 0) {
            console.log("La reserva con ID", id, "no se encuentra en la base de daros");
            return;
        }

        const consultaEliminacion = `
        DELETE FROM public."RESERVA"
        WHERE "ID" = $1
        RETURNING *;`;
        const result = await ejecutarConsulta(consultaEliminacion, [id]);

        const reservasFormateadas = arreglarFechas(result);
        console.log("Reserva eliminada:", result);
        return reservasFormateadas;
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        throw error;
    }
};

/*ACTUALIZAR*/

const actualizarCliente = async (id, nuevoNombre, nuevoCorreo, nuevoTelefono) => {
    try {
        const consultaActualizacion = `
            UPDATE public."CLIENTE"
            SET "Nombre" = $2, "Correo" = $3, "Telefono" = $4
            WHERE "ID" = $1
            RETURNING *;`;
        const values = [id, nuevoNombre, nuevoCorreo, nuevoTelefono];
        const result = await ejecutarConsulta(consultaActualizacion, values);
        console.log("Cliente actualizado:", result);
        return result;
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw error;
    }
};


const actualizarEmpleado = async (id, nuevaContraseña, nuevoCorreo, nuevoNombre, nuevaFechaNacimiento, nuevaDireccion, nuevoSalario, nuevoTelefono, nuevaFechaInicio) => {
    try {
        const consultaActualizacion = `
            UPDATE public."EMPLEADO"
            SET "CONTRASENIA" = $2, "CORREO" = $3, "NOMBRE" = $4, "FECHA_NACIMIENTO" = $5, "DIRECCION" = $6, "SALARIO" = $7, "TELEFONO" = $8, "FECHA_INICIO" = $9
            WHERE "ID" = $1
            RETURNING *;`;
        const values = [id, nuevaContraseña, nuevoCorreo, nuevoNombre, nuevaFechaNacimiento, nuevaDireccion, nuevoSalario, nuevoTelefono, nuevaFechaInicio];
        const result = await ejecutarConsulta(consultaActualizacion, values);

        const empleadosFormateados = arreglarFechas(result);
        console.log("Empleado actualizado:", result);
        return empleadosFormateados;
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        throw error;
    }
};


const actualizarHabitacion = async (id, nuevoTipo, nuevoPrecio, nuevoEstado, nuevaCapacidad) => {
    try {
        const consultaActualizacion = `
            UPDATE public."HABITACION"
            SET "TIPO" = $2, "PRECIO" = $3, "ESTADO" = $4, "CAPACIDAD" = $5
            WHERE "ID" = $1
            RETURNING *;`;
        const values = [id, nuevoTipo, nuevoPrecio, nuevoEstado, nuevaCapacidad];
        const result = await ejecutarConsulta(consultaActualizacion, values);
        console.log("Habitación actualizada:", result);
        return result;
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        throw error;
    }
};


const actualizarReserva = async (id, nuevoEstado, nuevaFechaEntrada, nuevaFechaSalida, nuevoIdCliente, nuevoIdEmpleado, nuevoIdHabitacion) => {
    try {
        const consultaActualizacion = `
            UPDATE public."RESERVA"
            SET "ESTADO" = $2, "F_ENTRADA" = $3, "F_SALIDA" = $4, "ID_CLIENTE" = $5, "ID_EMPLEADO" = $6, "ID_HABITACION" = $7
            WHERE "ID" = $1
            RETURNING *;`;
        const values = [id, nuevoEstado, nuevaFechaEntrada, nuevaFechaSalida, nuevoIdCliente, nuevoIdEmpleado, nuevoIdHabitacion];
        const result = await ejecutarConsulta(consultaActualizacion, values);

        const reservasFormateadas = arreglarFechas(result);
        console.log("Reserva actualizada:", result);
        return reservasFormateadas;
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        throw error;
    }
};


/*Consulta por primary-key*/
const verClientePorId = async (id) => {
    try {
        const consulta = 'SELECT * FROM public."CLIENTE" WHERE "ID" = $1';
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.length === 0) {
            console.log(`El cliente con ID ${id} no se encuentra registrado en la base de datos.`);
            return null;
        }

        console.log("Cliente encontrado:", result);
        return result;
    } catch (error) {
        console.error('Error al buscar cliente por ID:', error);
        throw error;
    }
};

const verEmpleadoPorId = async (id) => {
    try {
        const consulta = 'SELECT * FROM public."EMPLEADO" WHERE "ID" = $1';
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.length === 0) {
            console.log(`El empleado con ID ${id} no se encuentra registrado en la base de datos.`);
            return null;
        }

        const empleadosFormateados = arreglarFechas(result);
        console.log("Empleado encontrado:", empleadosFormateados);
        return empleadosFormateados;
    } catch (error) {
        console.error('Error al buscar empleado por ID:', error);
        throw error;
    }
};

const verHabitacionPorId = async (id) => {
    try {
        const consulta = 'SELECT * FROM public."HABITACION" WHERE "ID" = $1';
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.length === 0) {
            console.log(`La habitación con ID ${id} no se encuentra registrada en la base de datos.`);
            return null;
        }

        console.log("Habitación encontrada:", result);
        return result;
    } catch (error) {
        console.error('Error al buscar habitación por ID:', error);
        throw error;
    }
};

const verReservaPorId = async (id) => {
    try {
        const consulta = 'SELECT * FROM public."RESERVA" WHERE "ID" = $1';
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.length === 0) {
            console.log(`La reserva con ID ${id} no se encuentra registrada en la base de datos.`);
            return null;
        }

        const reservasFormateadas = arreglarFechas(result);
        console.log("Reserva encontrada:", reservasFormateadas);
        return reservasFormateadas;
    } catch (error) {
        console.error('Error al buscar reserva por ID:', error);
        throw error;
    }
};


(async () => {
    try {
        /*Consulta Todos*/
        //await todosEmpleados();
        //await todosClientes();
        //await todasHabitaciones();
        //await todasReservas();
        /*Insertar*/
        //await insertarCliente('1001', 'Maria Vasquez', 'Maria@gmail.com', '315234');
        //await insertarEmpleado('31794', 'cocacola', 'carolina@gmail.com', 'Carolina Puentes', '11/06/1981', 'Tulua', '1200000', '51656', '12/01/2021');
        //await insertarHabitacion('020', 'SENCILLA', '150000', 'DISPONIBLE', '3');
        //await insertarReserva('0012', 'EXITOSA', '2024-08-30', '2024-10-27', '1001', '100634', '020');
        /*Eliminar por primary-key*/
        //await eliminarHabitacion();
        //await eliminarHabitacion();
        //await eliminarEmpleado();
        //await eliminarReserva();
        //await eliminarCliente();
        /*Consulta por primary-key*/
        //await verClientePorId('10091');
        //await verEmpleadoPorId('123');
        //await verHabitacionPorId('020');
        //await verReservaPorId('0011');
        /*Actualizar por primary-key*/
        //await actualizarCliente();
        //await actualizarEmpleado();
        //await actualizarHabitacion();
        //await actualizarReserva('0012', 'CANCELADA', '2024-08-30', '2024-10-27', '1001', '100634', '020');
    } finally {
        await desconectar();
    }
});