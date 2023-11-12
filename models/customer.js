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
            return result.rows.map(row =>{
                return{
                    customer_id:row[0],
                    cust_first_name:row[1],
                    cust_last_name:row[2],
                    credit_limit:row[3],
                    cust_email:row[4],
                    income_level:row[5],
                    region:row[6]
                };
            })
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
            if(result.rows.length>0){
                const row = result.rows[0];
                return{
                    customer_id:row[0],
                    cust_first_name:row[1],
                    cust_last_name:row[2],
                    credit_limit:row[3],
                    cust_email:row[4],
                    income_level:row[5],
                    region:row[6]
                };
            }else{
                return 'Customer no encontrado';
            }
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }

    async save(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute(
                'BEGIN create_customer(:customer_id,:cust_first_name,:cust_last_name,:credit_limit,:cust_email,:income_level,:region);END;',
                [this.customer_id,this.cust_first_name,this.cust_last_name,this.credit_limit,this.cust_email,this.income_level,this.region]
            );
            console.log('customer created');
            await conn.execute('COMMIT');
        }catch(err){
            throw err;
        }finally{
            if(conn){
                await oracledb.closeConnection();
            }
        }
    }

    //update

    //delete

}

module.exports = Customer;