const pool = require("../pool");

async function createShopTable(){
    try{

        const createShopTableQuery = `
        CREATE TABLE IF NOT EXISTS  Shop(
            Shop_ID SERIAL PRIMARY KEY,
            Name VARCHAR(50) NOT NULL,
            Location VARCHAR(50) NOT NULL,
            Status VARCHAR(50) NOT NULL,
            Vendor_ID INT,
            TotalProfit DECIMAL(10,2) DEFAULT 0,
            FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) 
        );`;

        await pool.query(createShopTableQuery);
        console.log("Shop Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Shop table: ",error);
    }
}

module.exports = createShopTable;