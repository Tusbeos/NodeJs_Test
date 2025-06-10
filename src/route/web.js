import express from "express";
import homeController from "../controller/homeController.js";

const router = express.Router();

const initWebRouter = (app) => {
  router.get("/get", homeController.getHomePage);
  router.get("/about", homeController.getAbout);

  app.use("/", router);
};

export default initWebRouter;
