const pool = require("../pool");

async function checkShopName(){

    try{

        const createStoredProcedureQuery=`
        CREATE OR REPLACE FUNCTION check_shop_exists(p_shop_Name VARCHAR(50))
        RETURNS BOOLEAN AS $$
        DECLARE
            shop_exists BOOLEAN;
        BEGIN 
            SELECT EXISTS (SELECT 1 FROM Shop WHERE Shop.Name = p_shop_name) INTO shop_exists;
            RETURN shop_exists;
        END;
        $$ LANGUAGE plpgsql;
        `;

        await pool.query(createStoredProcedureQuery);
        console.log("The check_shop_exists stored procedure created successfully.")
    }
    catch(error){
        console.error("Error creating stored procedure for checkShopName: ",error);
    }
}

module.exports = checkShopName;
