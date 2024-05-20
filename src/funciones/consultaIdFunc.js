const ejecutarConsulta = require("./ejecutarCRUD");

const consultarPorId = async (tabla, id) => {
    const consulta = `SELECT * FROM public."${tabla}" WHERE "ID" = $1`;
    const result = await ejecutarConsulta(consulta, [id]);

    if (result.rows.length === 0) {
        console.log(`El registro con ID ${id} no se encuentra en la tabla ${tabla}.`);
        return null;
    }
    return result;
};

module.exports = consultarPorId;