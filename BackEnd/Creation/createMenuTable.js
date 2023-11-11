const pool = require("../pool");

async function createMenuTable(){
    try{

        const createMenuTableQuery = `
        CREATE TABLE IF NOT EXISTS  Menu(
            Shop_ID INT,
            Food_ID INT,
            PRIMARY KEY (Shop_ID,Food_ID),
            FOREIGN KEY (Shop_ID) REFERENCES Shop(Shop_ID),
            FOREIGN KEY (Food_ID) REFERENCES FoodItem(Food_ID)
        );`;

        await pool.query(createMenuTableQuery);
        console.log("Menu Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error in creating the Menu table: ",error);
    }
}

module.exports = createMenuTable;