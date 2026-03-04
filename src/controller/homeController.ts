import { Request, Response } from "express";
import db from "../models/index";
import CRUDService from "../services/CRUDService";

// Controller cho các trang CRUD (legacy - render EJS)
const getHomePage = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await db.User.findAll();
    return res.render("homepage", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

const getAbout = async (req: Request, res: Response): Promise<any> => {
  return res.render("test/about");
};

const getCURD = async (req: Request, res: Response): Promise<any> => {
  return res.render("crud.ejs");
};

const postCRUD = async (req: Request, res: Response): Promise<any> => {
  console.log(req.body);
  const message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD successfully!");
};

const getDisplayCRUD = async (req: Request, res: Response): Promise<any> => {
  const data = await CRUDService.getAllUser();
  console.log("Check data: ", data);
  return res.render("displayCRUD.ejs", { dataTable: data });
};

const getEditCRUD = async (req: Request, res: Response): Promise<any> => {
  const UserId = req.query.id;
  console.log(UserId);
  if (UserId) {
    const userData = await CRUDService.getUserInfoById(UserId as string);
    return res.render("edit-crud.ejs", { user: userData });
  } else {
    return res.send("User not found!");
  }
};

const putCRUD = async (req: Request, res: Response): Promise<any> => {
  const data = req.body;
  const allUser = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", { dataTable: allUser });
};

const deleteCRUD = async (req: Request, res: Response): Promise<any> => {
  const Id = req.query.id;
  if (!Id) {
    return res.send("User not found!");
  }
  await CRUDService.deleteUserById(Id as string);
  return res.send("Delete user successfully!");
};

export default {
  getHomePage,
  getAbout,
  getCURD,
  postCRUD,
  getDisplayCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
