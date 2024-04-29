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

const desconectar = async () => {
    if (client) {
        await client.end(); //finaliza la conexion
        client = undefined; //se hace para poder luego generar un nuevo client 
    }
};

const ejecutarConsulta = async (consulta) => {
    try {
        await conectar(); //llamado para CONECTAR
        const res = await client.query(consulta); //Hace la consulta
        return res.rows; // retorna el resultado 
    } catch (error) {
        console.error('Error :', error);
        throw error; 
    }
};

const todosEmpleados = async () => {
    const consulta = 'SELECT * FROM public."EMPLEADO"';
    const result = await ejecutarConsulta(consulta);
    console.log(result);
    return result;
};

const todosClientes = async () => {
    const consulta = 'SELECT * FROM public."CLIENTE"';
    const result = await ejecutarConsulta(consulta);
    console.log(result);
    return result;
};

(async () => {
    try {
        await todosEmpleados();
        await todosClientes();
    } finally {
        await desconectar();
    }
})();