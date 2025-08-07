import express from "express";
import homeController from "../controller/homeController.js";

const router = express.Router();

const initWebRouter = (app) => {
  router.get("/get", homeController.getHomePage);
  router.get("/about", homeController.getAbout);
  router.get("/crud", homeController.getCURD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getDisplayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  app.use("/", router);
};

export default initWebRouter;
