let getHomePage = (req, res) => {
  return res.render("homepage");
};

let getAbout = (req, res) => {
  return res.render("test/about");
};

module.exports = {
  getHomePage: getHomePage,
  getAbout: getAbout,
};
