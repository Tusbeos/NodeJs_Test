import path from "path";
import express, { Application } from "express";

// Cấu hình view engine EJS và thư mục static
const configViewEngine = (app: Application): void => {
  app.use(express.static(path.join(__dirname, "../public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
};

export default configViewEngine;
