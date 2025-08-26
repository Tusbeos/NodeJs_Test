import express from "express";
import homeController from "../controller/homeController.js";
import userController from "../controller/userController.js";

const router = express.Router();

const initWebRouter = (app) => {
  router.get("/get", homeController.getHomePage);
  router.get("/about", homeController.getAbout);
  router.get("/crud", homeController.getCURD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getDisplayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  app.use("/", router);
};

export default initWebRouter;
