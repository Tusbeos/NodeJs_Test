import db from "../models/index";
import CURDScrvice from "../service/CURDScrvice";

const getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();
    console.log(data);

    return res.render("homepage", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

const getAbout = async (req, res) => {
  return res.render("test/about");
};

const getCURD = async (req, res) => {
  return res.render("crud");
  // return res.send("Hello from CURD page! This is a test response.");
};

const postCRUD = async (req, res) => {
  const message = await CURDScrvice.createNewUser(req.body);
  console.log(message);
  return res.send("Post CRUD successfully!");
};

export default {
  getHomePage,
  getAbout,
  getCURD,
  postCRUD,
};
