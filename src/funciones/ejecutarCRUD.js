const pool = require('../configs/db.config');

const ejecutarConsulta = async (consulta, values) => {
    try {
        let res;
        if (values) {
            res = await pool.query(consulta, values); // Hace la consulta con los valores proporcionados
        } else {
            res = await pool.query(consulta); // Hace la consulta sin valores
        }
        return res.rows; // Retorna el resultado 
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports = ejecutarConsulta;