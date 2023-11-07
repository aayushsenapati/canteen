const pool = require("../pool");

async function createFoodItemTable(){
    try{

        const createFoodItemTableQuery = `
        CREATE TABLE IF NOT EXISTS  FoodItem(
            Food_ID VARCHAR(50) PRIMARY KEY,
            Name VARCHAR(50) NOT NULL,
            Description TEXT NOT NULL,
            Price DECIMAL(10,2) NOT NULL
        );`;

        await pool.query(createFoodItemTableQuery);
        console.log("Food Item Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Food Item table: ",error);
    }
}

module.exports = createFoodItemTable;