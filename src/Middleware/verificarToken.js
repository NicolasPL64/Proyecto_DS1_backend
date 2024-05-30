const jwt = require('jsonwebtoken');
const ErrorStatus = require('../utilidades/ErrorStatus');

function verificarToken(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        throw new ErrorStatus('Inicia sesión.', 401);
    }
    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        throw new ErrorStatus('Token inválido.', 401);
    }
}

module.exports = verificarToken;