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
            const cachedCustomers = await redis_con.get('customers');

            if(cachedCustomers){
                console.log('Datos de redis');
                return res.json(JSON.parse(cachedCustomers));
            }else{
                conexion = await oracle.connectToDatabase();
                const result = await conexion.execute('select * from customers')
                await redis_con.set('customers',JSON.stringify(result.rows))
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

async function create(req, res, next) {
    let redis_con;
    let conexion;
    try {

        redis_con = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        });

        redis_con.on('error', (err) => {
            console.log('Error en Redis', err);
        });

        await redis_con.connect();
        conexion = await oracle.connectToDatabase();

        const customer_id = req.params.id;
        const { first_name, last_name, credit_limit, email, income_level, region } = req.body;
        const sql = `BEGIN 
                        insert_customer(:customer_id, :first_name, :last_name, :credit_limit, :email, :income_level, :region); 
                     END;`;

        await conexion.execute(sql, [customer_id, first_name, last_name, credit_limit, email, income_level, region]);
        let customerData = {customer_id,customer_id, first_name, last_name, credit_limit, email, income_level, region}
        await redis_con.set(`customers/${customer_id}`,JSON.stringify(customerData));
        res.status(201).send('Cliente creado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el cliente' });
    } finally {
        if (conexion) {
            try {
                await oracle.closeConnection(conexion);
            } catch (err) {
                console.error(err);
            }
        }
        if (redis_con) {
            try {
                await redis_con.quit();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = {list, create};