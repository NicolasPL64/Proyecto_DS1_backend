const ErrorStatus = require('../../utilidades/errorStatus');

function verificarToken(req, res, next) {
    if (!req.cookies.jwt) throw new ErrorStatus('No se proporcionó ningún token.', 401);

    try {
        const datos = JsonWebToken.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        throw new ErrorStatus('Token inválido.', 401);
    }
}

module.exports = verificarToken;