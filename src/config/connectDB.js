import { Sequelize } from "sequelize";

// Set up connection to the local database. Using an ES module export
// keeps the codebase consistent and avoids issues when importing this
// module elsewhere.
const sequelize = new Sequelize("jsdb", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection Database successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB;
