const express = require('express');
const Order = require('../models/order');
const Redis = require('../redisclient');


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedOrders = await redis.get('orders');
        if(cachedOrders){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedOrders));
        }
        else{
            const orders = await Order.findAll();
            await redis.set('orders',JSON.stringify(orders));
            res.status(200).json(orders);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los orders');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let order_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedOrderId = await redis.get(`orders/${order_id}`);
        if(cachedOrderId){
            res.status(200).json(JSON.parse(cachedOrderId));    
        }else{
            const order = await Order.findById(order_id);
            await redis.set(`orders/${order_id}`,JSON.stringify(order));
            res.status(200).json(order);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener datos de la orden');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
}


module.exports = {list,get};