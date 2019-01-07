const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //this renders the adminstrator login page
  adminLoginPage: (req, res) => {
    res.render("admin-login");
  }
};
