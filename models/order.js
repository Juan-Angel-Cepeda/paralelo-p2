const oracledb = require('../db');

class Order{
    constructor(order_id,order_date,order_mode,customer_id,order_status,order_total,sales_rep_id,promotion_id){
        this.order_id = order_id;
        this.order_date = order_date;
        this.order_mode = order_mode;
        this.customer_id = customer_id;
        this.order_status = order_status;
        this.order_total = order_total;
        this.sales_rep_id = sales_rep_id;
        this.promotion_id = promotion_id;
    }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT * FROM orders');
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
            const result = await conn.execute(`SELECT * FROM orders WHERE order_id = ${order_id}`);
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

module.exports = Order;