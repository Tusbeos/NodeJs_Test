import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import inniWebRouter from "./route/web";
import connectDB from "./config/connectDB";
require("dotenv").config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
inniWebRouter(app);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend is Running in port", port);
});
