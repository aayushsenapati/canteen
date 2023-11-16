import pool from "../pool";

async function createRoles(){
    try{

        await pool.query(`CREATE ROLE IF NOT EXISTS Vendor_Management WITH CREATE, READ, UPDATE, DELETE ON Vendor;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Shop_Management WITH CREATE, READ, UPDATE, DELETE ON Shop;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Food_Item_Management WITH CREATE, READ, UPDATE, DELETE ON FoodItem;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Menu_Management WITH CREATE, READ,UPDATE, DELETE ON Menu;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Student_Management WITH CREATE, READ, UPDATE, DELETE ON Student;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Orders_Management WITH CREATE, READ, UPDATE, DELETE ON Orders;`);
        await pool.query(`CREATE ROLE IF NOT EXISTS Contain_Managment WITH CREATE, READ, UPDATE, DELETE ON Contains;`);
    }
    catch(error){
        console.log(error);
    }
}


async function grantRoles(){
    try{

        await pool.query(`CREATE USER IF NOT EXISTS Vendor WITH PASSWORD = 'pass1';`);
        await pool.query(`CREATE USER IF NOT EXISTS Student WITH PASSWORD = 'pass2;`);

        await pool.query(`
        GRANT Vendor_Management,Shop_Management,Food_Item_Management,Menu_Management
        TO Vendor;`);

        await pool.query(`
        GRANT Student_Management, Orders_Management, Contains_Management
        TO Student;`);
    }
    catch(error){
        console.log(error);
    }
}

async function createAndGrantRoles(){

    await createRoles();
    await grantRoles();
}

module.exports = createAndGrantRoles;   