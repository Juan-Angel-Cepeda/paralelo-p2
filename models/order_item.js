const oracledb = require('../db');

class Order_Items{
    constructor(order_id,line_item_id,product_id,unit_price,quantity){
        this.order_id = order_id,
        this.line_item_id = line_item_id,
        this.product_id = product_id;
        this.unit_price = unit_price;
        this.quantity = quantity;
    }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT * FROM order_items');
            return result.rows;
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection(conn);
            }
        }
    }

    static async findById(order_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(`SELECT * FROM order_items WHERE order_id = ${order_id}`);
            return result.rows;
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }


    //crete

    //update

    //delete

}

module.exports = Order_Items;