const pool = require("../pool");

async function createOrdersTable(){
    try{

        const createOrdersTableQuery = `
        CREATE TABLE IF NOT EXISTS  Orders(
            Orders_ID SERIAL PRIMARY KEY,
            Status VARCHAR(50) NOT NULL,
            OrdersTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            TotalCost DECIMAL(10,2) NOT NULL,
            srn VARCHAR(50),
            FOREIGN KEY (srn) REFERENCES Student(srn)
        );`;

        await pool.query(createOrdersTableQuery);
        console.log("Orders Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Orders table: ",error);
    }
}

module.exports = createOrdersTable;