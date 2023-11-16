const pool = require('../pool');

async function createAndGrantRoles(){
    try{

        await pool.query(`CREATE ROLE Vendor;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Vendor TO Vendor;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Shop TO Vendor;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE FoodItem TO Vendor;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Menu TO Vendor;`);

        await pool.query(`CREATE ROLE Student;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Student TO Student;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Orders TO Student;`);
        await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE Contains TO Student;`);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = createAndGrantRoles;   