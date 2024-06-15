const express = require('express');
const rutaCRUD = express.Router();
const actualizarEnTabla = require('../funciones/crud/actualizarFunc');
const consultarPorId = require('../funciones/crud/consultaIdFunc');
const insertarEnTabla = require('../funciones/crud/insertarFunc');
const insertarReservaConCliente = require('../funciones/crud/insertarReservaConCliente');
const verificarToken = require('../middleware/verificarToken');
const verificarAdmin = require('../middleware/verificarAdmin');
const comprobarCruces = require('../funciones/crud/comprobarCrucesFunc');
const ErrorStatus = require('../utilidades/ErrorStatus');

rutaCRUD.use(verificarToken);

rutaCRUD.post('/:tabla/insertar', verificarAdmin, async (req, res, next) => {
    let result
    try {
        if (req.params.tabla != 'reserva') {
            const tabla = req.params.tabla.toUpperCase();
            const columnas = Object.keys(req.body).map(key => key.toUpperCase());
            const valores = Object.values(req.body);
            result = await insertarEnTabla(tabla, columnas, valores);
        } else result = await insertarReservaConCliente(req);
        res.status(200).json({ id: result[0].ID });
    } catch (error) {
        next(error);
    }
});

rutaCRUD.get('/:tabla/consultar/:id', verificarAdmin, async (req, res, next) => {
    const tabla = req.params.tabla.toUpperCase();
    const id = req.params.id;
    try {
        const result = await consultarPorId(tabla, id);
        if (result === null) throw new ErrorStatus(`No se encontró el registro con ID ${id}.`, 404);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

rutaCRUD.put('/:tabla/actualizar', verificarAdmin, async (req, res, next) => {
    try {
        const tabla = req.params.tabla.toUpperCase();
        if (tabla == 'RESERVA' && await comprobarCruces(req.body.f_entrada, req.body.f_salida,
            req.body.id_Habitacion, req.body.id))
            throw new ErrorStatus('Ya existe una reserva en esas fechas.', 409);

        const columnas = Object.keys(req.body).map(key => key.toUpperCase());
        const valores = Object.values(req.body);

        const result = await actualizarEnTabla(tabla, columnas, valores);
        if (result.rowCount > 0) res.sendStatus(200);
        else throw new ErrorStatus("No se encontró el registro a actualizar.", 404);
    } catch (error) {
        next(error);
    }
});

module.exports = rutaCRUD;