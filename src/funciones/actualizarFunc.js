const ejecutarConsulta = require("./ejecutarCRUD");

const actualizarEnTabla = async (tabla, columnas, valores) => {
    try {
        const consultaActualizacion = `
            UPDATE public."${tabla}"
            SET ${columnas.slice(1).map((col, i) => `"${col}" = $${i + 2}`).join(", ")}
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

module.exports = actualizarEnTabla;