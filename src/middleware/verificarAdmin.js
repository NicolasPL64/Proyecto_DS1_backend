const ErrorStatus = require('../utilidades/ErrorStatus');

function verificarAdmin(req, res, next) {
    if (req.params.tabla != "reserva" && req.params.tabla != "cliente") {
        if (req.usuario.modoAdmin) next();
        else throw new ErrorStatus('Sólo los administradores pueden realizar esta acción.', 401);
    }
    next();
}

module.exports = verificarAdmin;