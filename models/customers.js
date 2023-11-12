const oracledb = require('../db');

class Customer{
    constructor(customer_id,cust_first_name,cust_last_name,credit_limit,cust_email,income_level,region){
        this.customer_id = customer_id;
        this.cust_fisrt_name = cust_first_name;
        this.cust_last_name = cust_last_name;
        this.credit_limit = credit_limit;
        this.cust_email = cust_email;
        this.income_level = income_level;
        this.region = region;
    }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT * FROM customers');
            return result.rows;
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection(conn);
            }
        }
    }

    static async findById(customer_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(`SELECT * FROM customers WHERE customer_id = ${customer_id}`);
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

module.exports = Customer;