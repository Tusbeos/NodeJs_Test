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
  // return res.send("Hello from CURD page! This is a test response.");
};
let postCRUD = async (req, res) => {
  let message = await CRUDScrvice.createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD successfully!");
};
module.exports = {
  getHomePage: getHomePage,
  getAbout: getAbout,
  getCURD: getCURD,
  postCRUD: postCRUD,
};
