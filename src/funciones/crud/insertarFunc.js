const ejecutarConsulta = require("./ejecutarCRUD");
const consultarPorId = require("./consultaIdFunc");

const TABLAS_SIN_VERIFICACION = ["HABITACION", "RESERVA", "NODEMAILER"];

const insertarEnTabla = async (tabla, columnas, valores) => {
    if (!TABLAS_SIN_VERIFICACION.includes(tabla)) {
        // Verificar si el registro ya existe
        if (await consultarPorId(tabla, valores[0]) != null) {
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
};

module.exports = insertarEnTabla;