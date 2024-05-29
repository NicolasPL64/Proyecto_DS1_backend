const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).json({ mensaje: 'Inicia sesion' });
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
}

module.exports = verificarToken;