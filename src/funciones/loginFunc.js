const pool = require('../configs/db.config');
const JsonWebToken = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const validarEmpleado = async (id, pass) => {
    try {
        const resultado = await pool.query('SELECT * FROM public."EMPLEADO" WHERE "ID" = $1', [id]);

        if (resultado.rowCount > 0) {
            const empleado = resultado.rows[0];

            if (empleado.CONTRASENIA === pass) {
                console.log('Contraseña correcta');

                // Generar el token JWT
                const token = JsonWebToken.sign({ id: resultado.id },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRATION });

                return { existeUsuario: true, passCorrecto: true, codigoEstado: 200, token };
            } else {
                console.log('Contraseña incorrecta');
                return { existeUsuario: true, passCorrecto: false, codigoEstado: 401 };
            }
        } else {
            console.log('Usuario no encontrado');
            return { existeUsuario: false, passCorrecto: false, codigoEstado: 401 };
        }
    } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
        throw error;
    }
};

module.exports = validarEmpleado;