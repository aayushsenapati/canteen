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


app.listen(5000,() => {
    console.log("Server is running on port 5000")
})