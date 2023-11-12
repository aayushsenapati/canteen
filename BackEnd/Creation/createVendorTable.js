const pool = require("../pool");

async function createVendorTable(){
    try{

        const createVendorTableQuery = `
        CREATE TABLE IF NOT EXISTS  Vendor(
            Vendor_ID SERIAL PRIMARY KEY,
            FirstName VARCHAR(500) NOT NULL,
            LastName VARCHAR(500) NOT NULL,
            EmailID VARCHAR(500) NOT NULL,
            PhoneNumber VARCHAR(500) NOT NULL,
            Password VARCHAR(500) NOT NULL,
            UNIQUE (EmailID)
        );`;

        await pool.query(createVendorTableQuery);
        console.log("Vendor Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Vendor table: ",error);
    }
}

module.exports = createVendorTable;