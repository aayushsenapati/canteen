const pool = require("../pool");

async function checkVendorID(){

    try{

        const createStoredProcedureQuery=`
        CREATE OR REPLACE FUNCTION check_vendor_exists(p_Email_ID VARCHAR(50))
        RETURNS BOOLEAN AS $$
        DECLARE
            vendor_exists BOOLEAN;
        BEGIN 
            SELECT EXISTS (SELECT 1 FROM Vendor WHERE Vendor.EmailID = p_Email_ID) INTO vendor_exists;
            RETURN vendor_exists;
        END;
        $$ LANGUAGE plpgsql;
        `;

        await pool.query(createStoredProcedureQuery);
        console.log("The check_vendor_id stored procedure created successfully.")
    }
    catch(error){
        console.error("Error creating stored procedure for checkVendorID: ",error);
    }
}

module.exports = checkVendorID;