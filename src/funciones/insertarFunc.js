const ejecutarConsulta = require("./ejecutarCRUD");

const TABLAS_SIN_VERIFICACION = ["HABITACION", "RESERVA", "NODEMAILER"];

const insertarEnTabla = async (tabla, columnas, valores) => {
    try {
        if (!TABLAS_SIN_VERIFICACION.includes(tabla)) {
            // Verificar si el registro ya existe
            const consultaExistencia = `
            SELECT COUNT(*) AS count
            FROM public."${tabla}"
            WHERE "ID" = $1`;
            const existencia = await ejecutarConsulta(consultaExistencia, [valores[0]]);

            if (existencia[0].count > 0) {
                console.log(`El registro ya está en la tabla ${tabla}.`);
                return null;
            }
        }
        const consultaInsercion = `
            INSERT INTO public."${tabla}" ("${columnas.join('", "')}")
            VALUES (${columnas.map((_, i) => `$${i + 1}`).join(", ")})
            RETURNING *;`;
        const result = await ejecutarConsulta(consultaInsercion, valores);
        console.log(`Registro insertado en ${tabla}:`, result.rows);
        return result.rows;
    } catch (error) {
        console.error(`Error al insertar en ${tabla}:`, error);
        throw error;
    }
};

module.exports = insertarEnTabla;