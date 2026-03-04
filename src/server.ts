import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRouter from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Cấu hình CORS cho phép React frontend kết nối
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

// Cấu hình body-parser với giới hạn 50mb cho upload ảnh
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Khởi tạo view engine và routes
configViewEngine(app);
initWebRouter(app);

// Kết nối database
connectDB();

// Khởi động server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Backend is Running in port", port);
});
