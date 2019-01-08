const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE ADMIN LOGIN PAGE

  bloggerLogin: function(req, res) {
    knex("buybookdata").then(results => {
      res.render("blogger_loggin");
    });
  },

  //this renders the adminstrator login page
  adminLoginPage: (req, res) => {
    res.render("admin-login", { message: req.flash("info") });
  },
  //THIS LOGS THE ADMINISTRATOR IN THEN REDIRECTS THEM TO THEIR HOME PAGE IF CREDENTIALS ARE VALID
  adminLogin: (req, res) => {
    knex("bloggers")
      .andWhere("role", "admin")
      .where("blogger_email", req.body.admin_email)
      .then(results => {
        let admin = results[0];
        if (!admin) {
          req.flash("info", "Could not locate a user with that email");
          res.redirect("/admin/login");
        } else if (
          req.body.admin_password &&
          admin.blogger_password === req.body.admin_password
        ) {
          req.session.user = null;
          req.session.blogger = null;
          req.session.admin = admin;
          res.redirect("/admin/home");
        } else {
          console.log(req.body);
          req.flash("info", "Invalid password");
          res.redirect("/admin/login");
        }
      })
      .catch(err => console.log(err));
  },
  //THIS RENDERS THE ADMIN HOME PAGE
  adminHome: (req, res) => {
    let pendingBloggerRegistrations = knex("bloggers")
      .where("bloggers.approved", "=", "false")
      .orderBy("created_at")
      .whereNot("role", "=", "admin");
    Promise.all([pendingBloggerRegistrations]).then(results => {
      console.log();
      let firstThreeRegs = results[0].slice(0, 3);
      let requestedOn = firstThreeRegs.map(reg =>
        moment(reg.created_at)
          .toString()
          .slice(0, 16)
      );
      res.render("admin-home", {
        admin: req.session.admin,
        firstThreeRegs: firstThreeRegs,
        requestedOn: requestedOn
      });
    });
  }
};
