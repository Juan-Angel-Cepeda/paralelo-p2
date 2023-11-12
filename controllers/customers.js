const express = require('express');
const Customer = require('../models/customers');
const Redis = require('../redisclient')


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedCustomers = await redis.get('customers');
        if(cachedCustomers){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedCustomers));
        }
        else{
            const customers = await Customer.findAll();
            await redis.set('customers',JSON.stringify(customers));
            res.status(200).json(customers);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los clientes');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let customer_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedCustomerId = await redis.get(`customers/${customer_id}`);
        if(cachedCustomerId){
            res.status(200).json(JSON.parse(cachedCustomerId));    
        }else{
            const customer = await Customer.findById(customer_id);
            await redis.set(`customers/${customer_id}`,JSON.stringify(customer));
            res.status(200).json(customer)
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener el cliente');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}


module.exports = {list,get};