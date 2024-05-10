const express = require('express');
const rutaCRUD = express.Router();
const actualizarEnTabla = require('../funciones/actualizarFunc');
const consultarPorId = require('../funciones/consultaIdFunc');
const insertarEnTabla = require('../funciones/insertarFunc');


rutaCRUD.post('/:tabla/insertar', async (req, res) => {
    const tabla = req.params.tabla.toUpperCase();
    const columnas = Object.keys(req.body).map(key => key.toUpperCase());
    const valores = Object.values(req.body);
    const result = await insertarEnTabla(tabla, columnas, valores);
    res.json(result);
});

rutaCRUD.post('/:tabla/consultar', async (req, res) => {
    const tabla = req.params.tabla.toUpperCase();
    const id = req.body.id;
    const result = await consultarPorId(tabla, id);
    res.json(result);
});

rutaCRUD.post('/:tabla/actualizar', async (req, res) => {
    const tabla = req.params.tabla.toUpperCase();
    const columnas = Object.keys(req.body).map(key => key.toUpperCase());
    const valores = Object.values(req.body);
    const result = await actualizarEnTabla(tabla, columnas, valores);
    res.json(result);
});

module.exports = rutaCRUD;