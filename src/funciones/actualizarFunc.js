const ejecutarConsulta = require("./ejecutarCRUD");

const actualizarEnTabla = async (tabla, columnas, valores) => {
    const consultaActualizacion = `
            UPDATE public."${tabla}"
            SET ${columnas.slice(1).map((col, i) => `"${col}" = $${i + 2}`).join(", ")}
            WHERE "ID" = $1
            RETURNING *;`;

    const result = await ejecutarConsulta(consultaActualizacion, valores);
    console.log(`${tabla} actualizado:`, result.rows);
    return result.rows;
};

module.exports = actualizarEnTabla;