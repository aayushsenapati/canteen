const pool = require("../pool");

async function updateTotalProfitTrigger(){
    try{

        const updateTotalProfitTrigger = await pool.query(`
        CREATE OR REPLACE FUNCTION update_shop_total_profit()
        RETURNS TRIGGER AS $$
        BEGIN
            
            SELECT f.Price * NEW.Quantity INTO NEW.total_cost
            FROM FoodItem f
            WHERE f.Food_ID = NEW.Food_ID;
            
            UPDATE Shop
            SET TotalProfit = TotalProfit + NEW.total_cost
            WHERE Shop_ID = (
                SELECT Shop_ID
                FROM Menu 
                WHERE Food_ID = NEW.Food_ID
            );
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER IF NOT EXISTS update_total_profit_trigger
        AFTER INSERT ON Contains
        FOR EACH ROW
        EXECUTE FUNCTION update_shop_total_profit();
        `);
        console.log("The update_shop_total_profit trigger created successfully.");
    }
    catch(err){
        console.error(err);
    }
}

module.exports = updateTotalProfitTrigger;