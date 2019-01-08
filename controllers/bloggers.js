const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },

  bloggerLoggin :  function(req, res) {
    knex('buybookdata').then(results => {
      res.render("blogger_loggin")
    })
    },
    

  //this renders the adminstrator login page
  adminLoginPage: (req, res) => {
    res.render("admin-login");
  }
};
