const pool = require("../pool");

async function createContainsTable(){
    try{

        const createContainsTableQuery = `
        CREATE TABLE IF NOT EXISTS  Contains(
            Orders_ID INT,
            Food_ID INT,
            Quantity INT NOT NULL,
            PRIMARY KEY (Orders_ID,Food_ID),
            FOREIGN KEY (Orders_ID) REFERENCES Orders(Orders_ID),
            FOREIGN KEY (Food_ID) REFERENCES FoodItem(Food_ID)
        );`;

        await pool.query(createContainsTableQuery);
        console.log("Contains Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Contains table: ",error);
    }
}

module.exports = createContainsTable;