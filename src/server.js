import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRouter from "./route/web.js";
import connectDB from "./config/connectDB.js";
import cors from "cors";
require("dotenv").config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

viewEngine(app);
initWebRouter(app);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend is Running in port", port);
});
