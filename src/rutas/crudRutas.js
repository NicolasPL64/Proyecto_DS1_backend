const express = require('express');
const rutaCRUD = express.Router();
const actualizarEnTabla = require('../funciones/actualizarFunc');
const consultarPorId = require('../funciones/consultaIdFunc');
const insertarEnTabla = require('../funciones/insertarFunc');
const insertarReservaConCliente = require('../funciones/insertarReservaConCliente');

rutaCRUD.post('/:tabla/insertar', async (req, res, next) => {
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

rutaCRUD.post('/:tabla/consultar', async (req, res, next) => {
    const tabla = req.params.tabla.toUpperCase();
    const id = req.body.id;
    try {
        const result = await consultarPorId(tabla, id);
        if (result === null) res.sendStatus(404);
        else res.json(result);
    } catch (error) {
        next(error);
    }
});

rutaCRUD.post('/:tabla/actualizar', async (req, res) => {
    const tabla = req.params.tabla.toUpperCase();
    const columnas = Object.keys(req.body).map(key => key.toUpperCase());
    const valores = Object.values(req.body);
    try {
        const result = await actualizarEnTabla(tabla, columnas, valores);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = rutaCRUD;