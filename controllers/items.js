const express = require('express');
const oracle = require('../db');
const redis = require('redis');

async function list(req,res,next){
    let redis_con;
    let conexion;
    try{
        const redis_con = redis.createClient({
            socket:{
                host:process.env.REDIS_HOST,
                port:process.env.REDIS_PORT
            }
        });
        redis_con.on('error',(err=>{
            console.log('Error en redis',err);
        }))

        try{
            await redis_con.connect();
            const cachedItems = await redis_con.get('items');
            if(cachedItems){
                console.log('Datos de redis');
                return res.json(JSON.parse(cachedItems));
            }else{
                conexion = await oracle.connectToDatabase();
                const result = await conexion.execute('select * from order_items');
                await redis_con.set('items',JSON.stringify(result.rows));
                res.json(result.rows);
            }
        }catch(err){
            console.log(err)
            res.status(500).send('Error con redis');
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }finally{
        if(conexion){
            try{
                await oracle.closeConnection(conexion);
                await redis_con.quit();
            }catch(err){
                console.error(err);
            }
        }
    }
};

module.exports = {list};