const ejecutarConsulta = require("./ejecutarCRUD");

const consultarPorId = async (tabla, id) => {
    try {
        const consulta = `SELECT * FROM public."${tabla}" WHERE "ID" = $1`;
        const result = await ejecutarConsulta(consulta, [id]);

        if (result.rows.length === 0) {
            console.log(`El registro con ID ${id} no se encuentra en la tabla ${tabla}.`);
            return null;
        }

        return result;
    } catch (error) {
        console.error(`Error al buscar ${tabla} por ID:`, error);
        throw error;
    }
};

module.exports = consultarPorId;