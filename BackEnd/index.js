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
            res.json({"Error":"Vendor already exists."})
        }
        else{

            const newVendor = await pool.query(`
            INSERT INTO Vendor(Vendor_ID,FirstName,LastName,EmailID,PhoneNumber)  
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
            [Vendor_ID,FirstName,LastName,EmailID,PhoneNumber]
            );

            res.json(newVendor.rows[0]);
        }
    }
    catch(err){
        console.error(err.message);
    }
});