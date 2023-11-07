const pool = require("../pool");

async function createStudentTable(){

    try{

        const createStudentTableQuery = `
        CREATE TABLE IF NOT EXISTS Student(
            srn VARCHAR(50) PRIMARY KEY,
            FirstName VARCHAR(50) NOT NULL,
            LastName VARCHAR(50) NOT NULL,
            EmailID VARCHAR(50) NOT NULL,
            DateOfBirth DATE NOT NULL,
            PhoneNumber VARCHAR(20) NOT NULL
        );
        `;
        await pool.query(createStudentTableQuery);
        console.log("Student Table created successfully (if it did not exist)");
    }
    catch(error){
        console.error("Error creating the Student table: ",error);
    }
}

module.exports = createStudentTable;