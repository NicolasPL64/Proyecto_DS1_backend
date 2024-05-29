const express = require('express');
const rutaCRUD = express.Router();
const actualizarEnTabla = require('../funciones/crud/actualizarFunc');
const consultarPorId = require('../funciones/crud/consultaIdFunc');
const insertarEnTabla = require('../funciones/crud/insertarFunc');
const insertarReservaConCliente = require('../funciones/crud/insertarReservaConCliente');
const verificarToken = require('../Middleware/verificarToken');
const ErrorStatus = require('../utilidades/ErrorStatus');

rutaCRUD.post('/:tabla/insertar', verificarToken, async (req, res, next) => {
    let result
    try {
        if (req.params.tabla != 'reserva') {
            const tabla = req.params.tabla.toUpperCase();
            const columnas = Object.keys(req.body).map(key => key.toUpperCase());
            const valores = Object.values(req.body);
            result = await insertarEnTabla(tabla, columnas, valores);
        } else result = await insertarReservaConCliente(req);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

rutaCRUD.get('/:tabla/consultar/:id', verificarToken, async (req, res, next) => {
    const tabla = req.params.tabla.toUpperCase();
    const id = req.params.id;
    try {
        const result = await consultarPorId(tabla, id);
        if (result === null) res.sendStatus(404);
        else res.json(result);
    } catch (error) {
        next(error);
    }
});

rutaCRUD.put('/:tabla/actualizar', verificarToken, async (req, res) => {
    const tabla = req.params.tabla.toUpperCase();
    const columnas = Object.keys(req.body).map(key => key.toUpperCase());
    const valores = Object.values(req.body);
    try {
        const result = await actualizarEnTabla(tabla, columnas, valores);
        if (result.rowCount > 0) res.sendStatus(200);
        else throw new ErrorStatus("No se encontró el registro a actualizar.", 404);
    } catch (error) {
        next(error);
    }
});

module.exports = rutaCRUD;