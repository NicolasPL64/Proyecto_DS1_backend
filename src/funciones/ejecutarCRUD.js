const pool = require('../configs/db.config');

const ejecutarConsulta = async (consulta, values) => {
    try {
        return await pool.query(consulta, values);
    } catch (error) {
        console.error('Error CRUD:', error);
        throw error;
    }
};

module.exports = ejecutarConsulta;