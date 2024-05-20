const pool = require('../configs/db.config');

const ejecutarConsulta = async (consulta, values) => {
    return await pool.query(consulta, values);
};

module.exports = ejecutarConsulta;