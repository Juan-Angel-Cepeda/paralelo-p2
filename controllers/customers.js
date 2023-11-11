const express = require('express');
const oracle = require('../db');

async function list(req,res,next){
    try{
        conexion = await oracle.connectToDatabase();
        const result = await conexion.execute('select * from customers@region_a')
        res.json(result.rows);
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    } finally {
        if (conexion) {
            try {
                await oracle.closeConnection(conexion);
            } catch (err) {
                console.error(err);
            }
        }
    }
};

module.exports = {list};