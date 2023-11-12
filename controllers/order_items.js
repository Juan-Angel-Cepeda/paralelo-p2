const express = require('express');
const Order_items = require('../models/order_item');
const Redis = require('../redisclient');


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedOrder_items = await redis.get('order_items');
        if(cachedOrder_items){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedOrder_items));
        }
        else{
            const order_items = await Order_items.findAll();
            await redis.set('order_items',JSON.stringify(order_items));
            res.status(200).json(order_items);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los order items');
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
        const cachedOrderId = await redis.get(`order_items/${order_id}`);
        if(cachedOrderId){
            res.status(200).json(JSON.parse(cachedOrderId));    
        }else{
            const order = await Order_items.findById(order_id);
            await redis.set(`order_items/${order_id}`,JSON.stringify(order));
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