const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE ADMIN LOGIN PAGE

  bloggerLoggin :  function(req, res) {
    knex('buybookdata').then(results => {
      res.render("blogger_loggin")
    })
    },
    

  //this renders the adminstrator login page
  adminLoginPage: (req, res) => {
    res.render("admin-login");
  },
  //THIS LOGS THE ADMINISTRATOR IN THEN REDIRECTS THEM TO THEIR HOME PAGE IF CREDENTIALS ARE VALID
  adminLogin: (req, res) => {
    knex("bloggers")
      .andWhere("role", "admin")
      .where("email", req.body.admin_email)
      .then(results => {
        let admin = results[0];
        if (!admin) {
          req.flash("info", "Could not locate a user with that email");
          res.redirect("/admin/login");
        } else if (
          req.body.admin_password &&
          admin.password === req.body.admin_password
        ) {
          req.session.user = null;
          req.session.blogger = null;
          req.session.admin = admin;
          res.redirect("/admin/home");
        } else {
          req.flash("info", "Invalid password");
          res.redirect("/admin/login");
        }
      })
      .catch(err => console.log(err));
  }
  //THIS RENDERS THE ADMIN HOME PAGE
  adminHome: (req, res) => {
    console.log("yo")
  }
};
