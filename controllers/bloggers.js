const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE ADMIN LOGIN PAGE
  adminLoginPage: (req, res) => {
    res.render("admin-login");
  },
  //THIS LOGS THE ADMINISTRATOR IN
  adminLogin: (req, res) => {
    knex("bloggers")
        .where("email", req.body.email)
        .then(results => {
            let patient = results[0];
            if (!patient) {
                req.flash('info', 'Could not locate a user with that email')
                res.redirect("patients/login");
            } else if (req.body.password && patient.password === req.body.password) {
                req.session.user = null;
                req.session.patient = patient;
                req.session.role = 'patient';
                res.redirect("/patients/appointment-page/confirmed");
            } else {
                req.flash('info', 'Invalid password')
                res.redirect("patients/login");
            }
        })
        .catch(err => console.log(err));
};
