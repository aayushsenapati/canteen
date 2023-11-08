const express = require("express");
const app = express();
const cors = require("cors");

const pool = require("./pool");

const createStudentTable = require("./Creation/createStudentTable");
const createVendorTable = require("./Creation/createVendorTable");
const createShopTable = require("./Creation/createShopTable");
const createFoodItemTable = require("./Creation/createFoodItemTable");
const createOrderTable = require("./Creation/createOrderTable");
const createMenuTable = require("./Creation/createMenuTable");
const createContainsTable = require("./Creation/createContainsTable");

const checkVendorID = require("./Procedure/checkVendorID");
const checkShopName = require("./Procedure/checkShopName");

app.use(cors())
app.use(express.json())

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

async function createProcedures(){

    await checkVendorID();
    await checkShopName();
}

createProcedures();

app.listen(5000,() => {
    console.log("Server is running on port 5000")
})

app.post("/vendorRegister",async (req,res) =>{
    try{
        const { Vendor_ID,FirstName, LastName, EmailID, PhoneNumber} = req.body;

        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[Vendor_ID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){
            res.json({"Error":"Vendor already exists."});
            console.log("Vendor already exists.");
        }
        else{

            const newVendor = await pool.query(`
            INSERT INTO Vendor(Vendor_ID,FirstName,LastName,EmailID,PhoneNumber)  
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [Vendor_ID,FirstName,LastName,EmailID,PhoneNumber]
            );

            res.json(newVendor.rows[0]);
            console.log(newVendor.rows[0]);
        }
    }
    catch(err){
        console.error(err);
    }
});

app.post("/shopRegister", async (req,res) =>{
    try{
        const {Name, Location, Status, Vendor_ID} = req.body;

        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[Vendor_ID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){
            const result = await pool.query(`SELECT check_shop_exists($1) AS shop_exists;`,[Name]);
            const shopExists = result.rows[0].shop_exists;

            if(shopExists){

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

app.get("/shopRegister/:Vendor_ID",async (req,res) =>{
    try{
        const {Vendor_ID} = req.params;

        const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[Vendor_ID]);
        const vendorExists = result.rows[0].vendor_exists;

        if(vendorExists){

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

app.put("/shopRegister", async (req,res) =>{
    try{
        const {Shop_ID, Name, Location, Status, Vendor_ID} = req.body;

        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;

        if(rowCount == 1){

            const result = await pool.query(`SELECT check_vendor_exists($1) AS vendor_exists;`,[Vendor_ID]);
            const vendorExists = result.rows[0].vendor_exists;

            if(vendorExists){
                const result = await pool.query(`SELECT check_shop_exists($1) AS shop_exists;`,[Name]);
                const shopExists = result.rows[0].shop_exists;
    
                if(shopExists){
    
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


app.delete("/shopRegister/:Shop_ID", async (req,res) => {
    try{

        const {Shop_ID} = req.params;

        const result = await pool.query(`SELECT * FROM Shop WHERE Shop_ID = $1`,[Shop_ID]);
        const rowCount = result.rowCount;
        
        if(rowCount == 1){
            
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

