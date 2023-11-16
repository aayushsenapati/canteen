const express = require("express");
const app = express();
const cors = require("cors");

const pool = require("./pool");
const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");
const client = new Client();


client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});


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

const createAndGrantRoles = require("./Roles/roles")

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
//createAndGrantRoles()

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
app.post("/Vendor/Verify", async (req, res) => {
    try {
        const { EmailID } = req.body;

        // Check whether the vendor exists.
        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`, [EmailID]);
        const vendorExists = result.rows[0].vendor_exists;

        if (vendorExists) {
            const result = await pool.query(`SELECT Password FROM Vendor WHERE EmailID = $1;`, [EmailID]);
            const hashedPassword = result.rows[0].password;

            // Return hashed password.
            res.json({ "HashedPassword": hashedPassword });
        } else {
            console.log("Username incorrect.");
            res.json({ "Error": "Username incorrect." });
        }
    } catch (error) {
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


//Create a WhatsApp Bot to take in orders and register/login students.
async function startBot(){

    //Welcoming message allowing users to login or register.
    client.on("message", async (message) =>{

        if(message.body == "hi" || message.body == "Hi"){
            message.reply(`Hello from canteen management system.\nPlease login or register with your SRN.\n`);
            message.reply(`If you have not registered, please type /register and please enter the following details seperated by comma.\nExample:\n\n/register,SRN,First Name, Last name,EmailID,PhoneNumber,Date of birth(yyyy-mm-dd).\n`);
            message.reply(`If you have already registered, login by typing /login and enter your SRN seperated by commas.\nExample:\n\n/login , SRN.`);
        }

        //Register the details into Student Table
        else if(message.body.startsWith('/register')){
            const messageBody = message.body.split(",");
            const SRN = messageBody[1];
            const FirstName = messageBody[2];
            const LastName = messageBody[3];
            const EmailID = messageBody[4];
            const PhoneNumber = messageBody[5];
            const DateOfBirth = messageBody[6];

            const result = await pool.query(`SELECT * FROM Student WHERE SRN = $1`,[SRN]);
            const rowCount = result.rowCount;

            if(rowCount == 1){
                message.reply("SRN already exists. Please login or enter correct details.");
            }
            else{

                const addStudent = await pool.query(`
                INSERT INTO Student(SRN,FirstName,LastName,EmailID,DateOfBirth,PhoneNumber)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING *
                ;`,[SRN,FirstName,LastName,EmailID,DateOfBirth,PhoneNumber]);
                console.log(addStudent.rows);

                message.reply("Successfully registered. Please log in now.");
            }
        }

        //Login facility for the students SRN. This also displays all the shops present in the canteen on successful login.
        else if(message.body.startsWith("/login")){

            const messageBody = message.body.split(",");
            const SRN = messageBody[1]

            const result = await pool.query(`SELECT * FROM Student WHERE SRN = $1;`,[SRN]);
            const rowCount = result.rowCount;

            if(rowCount == 1){
                
                const listShops = await pool.query(`SELECT Shop_ID,Name FROM Shop;`);

                message.reply(`Pick a shop by typing /shop and the given shop_id seperated by comma.\nExample:\n\n/shop, shop_id`);
                message.reply(`${listShops.rows.map((item) => `ID: ${item.shop_id}, Name: ${item.name}`).join("\n")}`);
            }
            else{
                message.reply("Incorrect details. Please register your SRN or try again.");
            }
        }
        
        //Given a shopID, display the menu of the shop.
        else if(message.body.startsWith('/shop')){

            const Shop_ID = message.body.split(',')[1];

            const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1;`,[Shop_ID]);
            const rowCount = result.rowCount;

            if(rowCount == 1){

                const foodItems = await pool.query(`
                SELECT f.Food_ID,Name,Description,Price
                FROM FoodItem f
                JOIN Menu m
                ON Shop_ID = $1
                ;`,[Shop_ID]);

                message.reply(`Pick the food item you want by typing /order and enter food_id and quantity seperated by comma, and end it with /end.\nExample:\n\n/order, SRN \n Food_ID, Quantity \n Food_ID,Quantity \n /end`);
                message.reply(`${foodItems.rows.map((item) => `Food_ID: ${item.food_id}, Name: ${item.name}, Description: ${item.description}, Price: ${item.price}`).join("\n\n")}`);
            }
            else{
                message.reply("Incorrect shop_ID. Please choose valid shop_ID and try again.");
            }
        }


        //Given a list of food_items and quantity, add to the Orders and Contains Table.
        else if(message.body.startsWith("/order")){

            const messageBody = message.body.split("\n");
            let SRN = null;
            let TotalCost = 0;
            let foodItems = [];

            for( const line of messageBody){
                const lineSplit = line.split(",");
                
                if(lineSplit[0] == "/order"){
                    SRN = lineSplit[1];
                }
                else if(lineSplit[0] == '/end'){

                    const result = await pool.query(`SELECT * FROM Student WHERE SRN = $1;`,[SRN]);
                    const rowCount = result.rowCount;

                    if(rowCount == 1){

                        const addOrder = await pool.query(`
                        INSERT INTO Orders(Status,TotalCost,SRN)
                        VALUES($1,$2,$3)
                        RETURNING *
                        ;`,["Open",TotalCost,SRN]);

                        const Orders_ID = addOrder.rows[0].orders_id;

                        for( const food_item of foodItems){
                            const addContains = await pool.query(`
                            INSERT INTO Contains(Food_ID,Orders_ID,Quantity)
                            VALUES($1,$2,$3)
                            RETURNING *
                            ;`,[food_item.food_id,Orders_ID,food_item.quantity]);
                        }

                        message.reply(`Complete order details are: \n\n Order_ID: ${Orders_ID}, Student SRN: ${SRN}, Total Amount: ${TotalCost}, Order Status: ${addOrder.rows[0].status}`);
                    }
                    else{
                        message.reply("Please register your SRN or give correct details.");
                    }
                }
                else{

                    const Food_ID = lineSplit[0]
                    const quantity = lineSplit[1]

                    const food_item = {food_id:Food_ID,quantity:quantity};
                    foodItems.push(food_item)

                    const result = await pool.query(`
                    SELECT Price
                    FROM FoodItem
                    WHERE Food_ID = $1
                    ;`,[Food_ID]);
                    const price = result.rows[0].price;

                    TotalCost = TotalCost + (price * quantity);
                }
            }
        }
    });
};

client.on("ready", () =>{
    console.log("Client is ready.");
    startBot();
});

client.initialize();