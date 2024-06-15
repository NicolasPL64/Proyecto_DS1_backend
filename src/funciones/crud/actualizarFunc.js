const ejecutarConsulta = require("./ejecutarCRUD");
const ErrorStatus = require("../../utilidades/ErrorStatus");

const actualizarEnTabla = async (tabla, columnas, valores) => {
    const consultaActualizacion = `
            UPDATE public."${tabla}"
            SET ${columnas.slice(1).map((col, i) => `"${col}" = $${i + 2}`).join(", ")}
            WHERE "ID" = $1
            RETURNING *;`;
    try {
        const result = await ejecutarConsulta(consultaActualizacion, valores);
        console.log(`${tabla} actualizado:`, result.rows);
        return result;
    } catch (error) {
        if (error.code = 23503)
            throw new ErrorStatus(`No existe el ${error.constraint} especificado.`, 404);
    }
};

module.exports = actualizarEnTabla;