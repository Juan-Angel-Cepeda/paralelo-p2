const express = require('express');
const Product = require('../models/product');
const Redis = require('../redisclient');


async function list(req,res,next){ 
    let redis;
    try{
        redis = await Redis.create_connection();
        const cachedProducts = await redis.get('products');
        if(cachedProducts){
            console.log('Datos obtendios de redis');
            res.status(200).json(JSON.parse(cachedProducts));
        }
        else{
            const products = await Product.findAll();
            await redis.set('products',JSON.stringify(products));
            res.status(200).json(products);
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Error al obtener los productos');
    }finally{
        if(redis){
            await Redis.close_conection(redis);
        }
    }
};

async function get(req,res,next){
    let redis;
    let product_id = req.params.id;
    try{
        redis = await Redis.create_connection();
        const cachedProductId = await redis.get(`product/${product_id}`);
        if(cachedProductId){
            res.status(200).json(JSON.parse(cachedProductId));    
        }else{
            const product = await Product.findById(product_id);
            await redis.set(`products/${product_id}`,JSON.stringify(product));
            res.status(200).json(product);
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