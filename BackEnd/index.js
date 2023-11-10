const express = require("express");
const app = express();
const cors = require("cors");

const pool = require("./pool");

//Get all the create table functions.
const createStudentTable = require("./Creation/createStudentTable");
const createVendorTable = require("./Creation/createVendorTable");
const createShopTable = require("./Creation/createShopTable");
const createFoodItemTable = require("./Creation/createFoodItemTable");
const createOrderTable = require("./Creation/createOrderTable");
const createMenuTable = require("./Creation/createMenuTable");
const createContainsTable = require("./Creation/createContainsTable");

//Get the stored procedures.
const checkVendorID = require("./Procedure/checkVendorID");
const checkShopName = require("./Procedure/checkShopName");
const updateTotalProfitTrigger = require("./Procedure/updateTotalProfitTrigger");

app.use(cors())
app.use(express.json())

//Create all the tables.
async function createTables(){

    await createStudentTable();
    await createVendorTable();
    await createShopTable();
    await createFoodItemTable();
    await createOrderTable();
    await createMenuTable();
    await createContainsTable();

}

createTables();

//Create all the stored procedures and triggers.
async function createProceduresAndTriggers(){

    await checkVendorID();
    await checkShopName();
    //await updateTotalProfitTrigger();
}

createProceduresAndTriggers();


//Set the port of the server.
app.listen(5000,() => {
    console.log("Server is running on port 5000")
})


//Register the vendor.
app.post("/Vendor",async (req,res) =>{
    try{
        const { FirstName, LastName, EmailID, PhoneNumber,Password} = req.body;

        //Check whether the vendor exists.
        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[EmailID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){
            res.json({"Error":"Email ID already exists."});
            console.log("Email ID already exists.");
        }
        else{

            //Insert data.
            const newVendor = await pool.query(`
            INSERT INTO Vendor(FirstName,LastName,EmailID,PhoneNumber,Password)  
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [FirstName,LastName,EmailID,PhoneNumber,Password]
            );

            res.json(newVendor.rows[0]);
            console.log(newVendor.rows[0]);
        }
    }
    catch(err){
        console.error(err);
    }
});


//Verify if the vendor has correct email id and password.
app.post("/Vendor/Verify",async (req,res) =>{
    try{
        const {EmailID, Password} = req.body;

            //Check whether the vendor exists.
            const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[EmailID]);
            const vendorExists = result.rows[0].vendor_exists;

            if(vendorExists){
                const result = await pool.query(`SELECT Password FROM Vendor WHERE EmailID = $1;`,[EmailID]);
                console.log(result);
                const expectedPassword = result.rows[0].password;
                
                //Verify password.
                if(Password == expectedPassword){
                    console.log("Successfully logged in.");
                    res.json({"Success":"Successfully logged in."});
                }
                else{
                    console.log("Incorrect Password. Try again.");
                    res.json({"Error":"Incorrect Password. Try again."});                    
                }
            }
            else{
                console.log("Username or password incorrect.");
                res.json({"Error":"Username or password incorrect."});
            }
    }
    catch(error){
        console.log(error);
    }
});


//Register Shop.
app.post("/Shop", async (req,res) =>{
    try{
        const {Name, Location, Status, EmailID} = req.body;

        //Check if vendor exists.
        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[EmailID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){

            const vendorResult = await pool.query(`SELECT Vendor_ID FROM Vendor WHERE EmailID = $1`,[EmailID]);
            const Vendor_ID = vendorResult.rows[0].vendor_id;

            //Check if shop exists.
            const result = await pool.query(`SELECT check_shop_exists($1) AS shop_exists;`,[Name]);
            const shopExists = result.rows[0].shop_exists;

            if(shopExists){

                //Shops with same vendor and at same location cannot have same name. Check if such shops already exist.
                const present = await pool.query(`SELECT * from Shop WHERE Name = $1 AND Vendor_ID = $2;`,[Name,Vendor_ID]);
                const rowCount = present.rowCount;

                if(rowCount != 0){
                    for (const i of present.rows){
                        if(i['name'] == Name && i['location'] == Location){
                            console.log("The shop with same name and location already exists.");
                            return res.json({"Error":"The shop with same name and location already exists."});
                        }
                    }
                }
            }

            //Insert data.
            const newShop = await pool.query(`
            INSERT INTO Shop(Name,Location,Status,Vendor_ID)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            ;`,[Name,Location,Status,Vendor_ID]);

            res.json(newShop.rows[0]);
            console.log(newShop.rows[0]);
        }
        else{
            res.json({"Error":"The vendor ID is not valid. Please register vendor."});
            console.log("The vendor ID is not valid. Please register vendor.");
        }        
    }
    catch(err){
        console.log(err);
    }
});


//Get all shops with given vendor email id
app.get("/Shop/:EmailID",async (req,res) =>{
    try{
        const {EmailID} = req.params;

        //Check if vendor exists.
        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[EmailID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){

            const vendorResult = await pool.query(`SELECT Vendor_ID FROM Vendor WHERE EmailID = $1;`,[EmailID]);
            const Vendor_ID = vendorResult.rows[0].vendor_id;

            //Fetch all shops.
            const listShops = await pool.query(`
            SELECT *
            FROM Shop
            WHERE Vendor_ID = $1`,[Vendor_ID]);

            console.log(listShops.rows);
            res.json(listShops.rows);
        }
        else{
            res.json({"Error":"The vendor ID is not valid. Please register vendor."});
            console.log("The vendor ID is not valid. Please register vendor.");
        }
    }
    catch(err){
        console.log(err);
    }
})


//Update shop details.
app.put("/Shop", async (req,res) =>{
    try{
        const {Shop_ID, Name, Location, Status, EmailID} = req.body;

        //Check whether the shop exists.
        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;

        if(rowCount == 1){

            //Check whether the vendor exists.
            const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[EmailID]);
            const vendorExists = result.rows[0].vendor_exists;

            if(vendorExists){
                const vendorResult = await pool.query(`SELECT Vendor_ID FROM Vendor WHERE EmailID = $1;`,[EmailID]);
                const Vendor_ID = vendorResult.rows[0].vendor_id;

                //Check if new updated details will cause any issues with existing data.
                const result = await pool.query(`SELECT check_shop_exists($1) AS shop_exists;`,[Name]);
                const shopExists = result.rows[0].shop_exists;
    
                if(shopExists){
                    
                    //Shops with same vendor and same location cannot have same name. Check whether such conflicts will occur on update.
                    const present = await pool.query(`SELECT * from Shop WHERE Name = $1 AND Vendor_ID = $2;`,[Name,Vendor_ID]);
                    const rowCount = present.rowCount;
    
                    if(rowCount != 0){
                        for (const i of present.rows){
                            if(i['name'] == Name && i['location'] == Location && i["shop_id"] != Shop_ID){
                                console.log("The shop with same name and location already exists.");
                                return res.json({"Error":"The shop with same name and location already exists."});
                            }
                        }
                    }
                }
                
                //Update shop details.
                const updateShop = await pool.query(`
                UPDATE Shop
                SET Name = ($1),
                Location = ($2),
                Status = ($3),
                Vendor_ID = ($4)
                WHERE Shop_ID = ($5)
                RETURNING *
                ;`,[Name,Location,Status,Vendor_ID,Shop_ID]);
                
                res.json(updateShop.rows[0]);
                console.log(updateShop.rows[0])

            }
            else{
                res.json({"Error":"The vendor ID is not valid. Please register vendor."});
                console.log("The vendor ID is not valid. Please register vendor.");
            }
        }
        else if(rowCount == 0){
            res.json({"Error":"The given shop does not exist to update it."});
            console.log("The given shop does not exist to update it.");
        }
    }
    catch(err){
        console.log(err);
    }
})


//Delete shop.
app.delete("/Shop/:Shop_ID", async (req,res) => {
    try{

        const {Shop_ID} = req.params;

        //Check whether shop exists.
        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;
        
        if(rowCount == 1){
            
            //Delete shop.
            const deleteShop = await pool.query(`DELETE FROM Shop
            WHERE Shop_ID = $1
            RETURNING *
            ;`,[Shop_ID]);

            console.log("Successfully deleted: ",deleteShop.rows);
            res.json(deleteShop.rows)
        }
        else{
            res.json({"Error":"The required shop does not exist."})
            console.log("The required shop does not exist.")
        }
    }
    catch(err){
        console.log(err);
    }
})


//Add menu to the shop.
app.post("/Menu", async (req,res) => {
    try{

        const {Shop_ID, Name, Description, Price} = req.body;

        //Check whether shop exists.
        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;

        if(rowCount == 1){

            //Check if food with same name, description, price and shop already exists.
            const result = await pool.query(`
            SELECT * FROM FoodItem 
            JOIN Menu ON FoodItem.Food_ID = Menu.Food_ID
            WHERE Name = $1 AND Description = $2 AND Price = $3 AND Shop_ID = $4;`,[Name,Description,Price,Shop_ID]);

            if(result.rowCount == 1){

                console.log("The given food item already exists.");
                return res.json({"Error":"The given food item already exists."});
            }

            //Insert food item details.
            const newFood = await pool.query(`
            INSERT INTO FoodItem(Name,Description,Price)
            VALUES ($1,$2,$3)
            RETURNING *
            ;`,[Name,Description,Price]);

            res.json(newFood.rows[0]);
            console.log(newFood.rows[0]);

            const Food_ID = newFood.rows[0].food_id;

            //Insert into Menu relation.
            const newMenu = await pool.query(`
            INSERT INTO Menu(Shop_ID,Food_ID)
            VALUES ($1,$2)
            RETURNING *
            ;`,[Shop_ID, Food_ID]);
        }
        else{
            console.log("The required shop does not exist. Please register shop first.");
            res.json({"Error":"The required shop does not exist. Please register shop first."});
        }
    }
    catch(err){
        console.log(err);
    }
});


//See all the food items for a given shop.
app.get("/Menu/:Shop_ID",async (req,res) =>{
    try{

        const {Shop_ID} = req.params;

        //Check whether shop exists.
        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;

        if(rowCount == 1){

            //Get all the food items for the given shop.
            const getMenu = await pool.query(`
            SELECT *
            FROM FoodItem AS f
            JOIN Menu AS m ON f.Food_ID = m.Food_ID
            WHERE m.Shop_ID = $1
            ;`,[Shop_ID]);

            res.json(getMenu.rows);
            console.log(getMenu.rows);
        }
        else{
            res.json({"Error":"The shop does not exist. Please register shop first."});
            console.log("The shop does not exist. Please register shop first.");
        }
    }
    catch(error){
        console.log(error);
    }
});


//Delete Food item from Shop.
app.delete("/Menu/:Food_ID", async (req,res) =>{
    try{

        const {Food_ID} = req.params;

        //Check if food item exists.
        const result = await pool.query(`SELECT * FROM FoodItem WHERE Food_ID = $1;`,[Food_ID]);
        const rowCount = result.rowCount;

        if(rowCount == 1){

            //Delete item from Menu.
            const deleteMenu = await pool.query(`
            DELETE FROM Menu
            WHERE Food_ID = $1
            RETURNING *
            ;`,[Food_ID]);
            
            //Delete item from FoodItem.
            const deleteFood = await pool.query(`
            DELETE FROM FoodItem
            WHERE Food_ID = $1
            RETURNING *
            ;`,[Food_ID]);

            res.json({"Success":"Successfully deleted food item."});
            console.log("Successfully deleted food item.");
        }
        else{
            res.json({"Error":"The given food item does not exist."});
            console.log("The given food item does not exist.");
        }
    }
    catch(error){
        console.log(error);
    }
});