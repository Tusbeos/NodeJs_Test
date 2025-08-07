const db = require("../models/index");
const CRUDScrvice = require("../service/CRUDService");

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
  let message = await CRUDScrvice.createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD successfully!");
};
let getDisplayCRUD = async (req, res) => {
  let data = await CRUDScrvice.getAllUser();
  console.log("Check data: ", data);
  return res.render("displayCRUD.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
  console.log(req.query.id);
  return res.send("Edit CRUD page for id: " + req.query.id);
};
module.exports = {
  getHomePage: getHomePage,
  getAbout: getAbout,
  getCURD: getCURD,
  postCRUD: postCRUD,
  getDisplayCRUD: getDisplayCRUD,
  getEditCRUD: getEditCRUD,
};
