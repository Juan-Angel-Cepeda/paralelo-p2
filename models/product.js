const oracledb = require('../db');

class Product{
    constructor(product_id,product_name,product_description,category_id,weight_class,
        warranty_period,supplier_id,product_status,list_price,min_price,catalog_url){
            this.product_id = product_id;
            this.product_name  = product_name;
            this.product_description = product_description;
            this.category_id = category_id;
            this.weight_class = weight_class;
            this.warranty_period = warranty_period;
            this.supplier_id = supplier_id;
            this.product_status = product_status;
            this.list_price = list_price;
            this.min_price = min_price;
            this.catalog_url = catalog_url;
        }

    static async findAll(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT product_id, product_name, product_description, category_id, weight_class, TO_CHAR(warranty_period), supplier_id, product_status, list_price, min_price, catalog_url FROM products');
            return result.rows;
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection(conn);
            }
        }
    }

    static async findById(product_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            const result = await conn.execute('SELECT product_id, product_name, product_description, category_id, weight_class, TO_CHAR(warranty_period), supplier_id, product_status, list_price, min_price, catalog_url FROM products WHERE product_id = :id', [product_id]);
            return result.rows;
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }

    static async destroy(product_id){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            await conn.execute('DELETE from products WHERE product_id = :product_id',[product_id]);
            await conn.execute('COMMIT');
            return 'Deleted';
        }catch(err){
            throw err;
        }finally{
            if (conn){
                await oracledb.closeConnection();
            }
        }
    }
    
    static async create(){
        let conn;
        try{
            conn = await oracledb.connectToDatabase();
            await conn.execute('INSERT INTO PRODUCTS (PRODUCT_ID,PRODUCT_NAME,PRODUCT_DESCRIPTION,CATEGORY_ID,WEIGHT_CLASS,WARRANTY_PERIOD,SUPPLIER_ID,PRODUCT_STATUS,LIST_PRICE,MIN_PRICE,CATALOG_URL) values (:product_id,:product_name,:product_description,:category_id,:weight_class,:warranty_period,:supplier_id,:product_status,:list_price,:min_price,:catalog_url);',
            [this.product_id,this.product_name,this.product_description,this.category_id,this.weight_class,
                this.warranty_period,this.supplier_id,this.product_status,this.list_price,this.min_price,this.catalog_url]);
                console.log('product created');
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
}

module.exports = Product;