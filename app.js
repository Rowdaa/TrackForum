const express = require("express");
const app = express();
const port = 3000;

const userRoute = require("./routes/userRoute");

// dbConnection
const dbConnection = require("./db/dbconfig");

// json middleware
app.use(express.json());

// set user middleware
app.use("/api/users", userRoute);

async function start() {
  try {
    const [result] = await dbConnection.execute("SELECT 'test'");
    app.listen(port);
    console.log("Database connected successfully");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
