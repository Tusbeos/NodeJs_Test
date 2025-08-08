const e = require("express");
const db = require("../models/index");
const CRUDService = require("../service/CRUDService");

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log(data);

    return res.render("homepage", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

let getAbout = async (req, res) => {
  return res.render("test/about");
};

let getCURD = async (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  console.log(req.body);
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD successfully!");
};

let getDisplayCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  console.log("Check data: ", data);
  return res.render("displayCRUD.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
  let UserId = req.query.id;
  console.log(UserId);
  if (UserId) {
    let userData = await CRUDService.getUserInfoById(UserId);
    return res.render("edit-crud.ejs", { user: userData });
  } else {
    return res.send("User not found!");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDService.updateUserData(data);
  return res.render("displayCRUD.ejs", { dataTable: allUser });
};

let deleteCRUD = async (req, res) => {
  let Id = req.query.id;
  if (!Id) {
    return res.send("User not found!");
  }
  await CRUDService.deleteUserById(Id);
  return res.send("Delete user successfully!");
};
module.exports = {
  getHomePage: getHomePage,
  getAbout: getAbout,
  getCURD: getCURD,
  postCRUD: postCRUD,
  getDisplayCRUD: getDisplayCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
