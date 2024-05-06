const ejecutarConsulta = require("./ejecutarCRUD");

const insertarEnTabla = async (tabla, columnas, valores) => {
    try {
        if (tabla !== "HABITACION" && tabla !== "RESERVA") {
            // Verificar si el registro ya existe
            const consultaExistencia = `
            SELECT COUNT(*) AS count
            FROM public."${tabla}"
            WHERE "ID" = $1`;
            const existencia = await ejecutarConsulta(consultaExistencia, [valores[0]]);

            if (existencia[0].count > 0) {
                console.log(`El registro ya está en la tabla ${tabla}.`);
                return;
            }
        }
        const consultaInsercion = `
            INSERT INTO public."${tabla}" ("${columnas.join('", "')}")
            VALUES (${columnas.map((_, i) => `$${i + 1}`).join(", ")})
            RETURNING *;`;
        const result = await ejecutarConsulta(consultaInsercion, valores);
        console.log(`Registro insertado en ${tabla}:`, result);
        return result;
    } catch (error) {
        console.error(`Error al insertar en ${tabla}:`, error);
        throw error;
    }
};

module.exports = insertarEnTabla;