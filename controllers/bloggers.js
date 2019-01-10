const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE BLOGGER LOGIN PAGE
  bloggerLoginPage: function(req, res) {
    res.render("blogger_login", {
      //NECESSARY VARS FOR NAVBAR OPTIONS
      loggedInUser: req.session.user,
      loggedInBlogger: req.session.blogger,
      loggedInAdmin: req.session.admin
    });
  },
  // This logs in the bloggers then redirects them to their home page

  bloggerLogin: (req, res) => {
    knex("bloggers")
      .andWhere("role", "blogger")
      .where("blogger_email", req.body.blogger_email)
      .then(results => {
        let blogger = results[0];
        if (!blogger) {
          req.flash("Info", "Not a valid Blogger email.");
          res.redirect("/blogger/login");
        } else if (
          req.body.blogger_password &&
          blogger.blogger_password === req.body.blogger_password
        ) {
          req.session.user = null;
          req.session.admin = null;
          req.session.blogger = blogger;
          
          res.redirect("/blogger/home");
        } else {
          console.log("Wrong Pass");
          req.flash("Info", "Invalid Password");
          res.redirect("/blogger/login");
        }
      });
  },

  bloggerHome: function(req, res) {
    let accessBlogs = knex("blogs")
      .where("blogs.blogger_id", req.session.blogger.id)
      .then(results => {
        let blogs = results
        res.render("blogger_home", {blogs : results, loggedInUser : req.session.user, loggedInAdmin : req.session.admin, loggedInBlogger : req.session.blogger})
      })
    },
  create: function(req, res) {
    
    },
  logout: (req, res) => {
    req.session.user = null;
    req.session.blogger = null;
    req.session.admin = null;
    res.redirect("/");
  },
  //this renders the adminstrator login page
  adminLoginPage: (req, res) => {
    res.render("admin-login", {
      message: req.flash("info")[0],
      //NECESSARY VARS FOR NAVBAR OPTIONS
      loggedInUser: req.session.user,
      loggedInBlogger: req.session.blogger,
      loggedInAdmin: req.session.admin
    });
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
          console.log(req.session);
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
  },
  adminLogout: (req, res) => {
    req.session.user = null;
    req.session.blogger = null;
    req.session.admin = null;
    res.redirect("/admin/home");
  },
  //THIS RENDERS THE ADMIN HOME PAGE
  adminHome: (req, res) => {
    let pendingBloggerRegistrations = knex("bloggers")
      .where("bloggers.approved", "=", "false")
      .orderBy("created_at")
      .whereNot("role", "=", "admin")
      .andWhereNot("rejected", "=", "true");
    let pendingBlogPosts = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "false")
      .andWhereNot("blogs.rejected", "=", "true")
      .orderBy("blogs.created_at")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");

    let pendingBanRequests = knex("users")
      .where("users.ban-requested", "=", "true")
      .andWhereNot("users.banned", "true")
      .orderBy("users.created_at");

    let approvedBlogs = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "true")
      .orderBy("blogs.created_at")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");

    Promise.all([
      pendingBloggerRegistrations,
      pendingBlogPosts,
      pendingBanRequests,
      approvedBlogs
    ])
      .then(results => {
        let firstThreeRegs = results[0].slice(0, 3);
        let requestedOn = firstThreeRegs.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        let firstThreeBlogs = results[1].slice(0, 3);
        let blogCreatedOn = firstThreeBlogs.map(blog =>
          moment(blog.created_at)
            .toString()
            .slice(0, 16)
        );

        let firstThreeBanReqs = results[2].slice(0, 3);
        let banRequestedOn = firstThreeBanReqs.map(blog =>
          moment(req.created_at)
            .toString()
            .slice(0, 16)
        );

        let firstThreeApprovedBlogs = results[3].slice(0, 3);
        let approvedBlogCreatedOn = firstThreeApprovedBlogs.map(blog =>
          moment(req.created_at)
            .toString()
            .slice(0, 16)
        );

        res.render("admin-home", {
          admin: req.session.admin,
          firstThreeRegs: firstThreeRegs,
          requestedOn: requestedOn,
          firstThreeBlogs: firstThreeBlogs,
          blogCreatedOn: blogCreatedOn,
          firstThreeBanReqs: firstThreeBanReqs,
          banRequestedOn: banRequestedOn,
          firstThreeApprovedBlogs: firstThreeApprovedBlogs,
          approvedBlogCreatedOn: approvedBlogCreatedOn,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
  },
  adminApprove: (req, res) => {
    knex("bloggers")
      .where("bloggers.id", "=", req.params.blogger_id)
      .update({
        approved: true
      })
      .then(() => {
        res.redirect("/admin/home");
      });
  },
  adminBloggerView: (req, res) => {
    knex("bloggers")
      .where("bloggers.id", "=", req.params.blogger_id)
      .then(result => {
        let appSubmittedOn = moment(result[0].created_at)
          .toString()
          .slice(0, 16);
        res.render("admin-blogger-view", {
          blogger: result[0],
          appSubmittedOn: appSubmittedOn,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      });
  },
  adminRejectBlogger: (req, res) => {
    knex("bloggers")
      .where("bloggers.id", "=", req.params.blogger_id)
      .update({
        rejected: true
      })
      .then(() => {
        res.redirect("/admin/home");
      });
  },
  adminPendingRegs: (req, res) => {
    knex("bloggers")
      .where("bloggers.approved", "=", "false")
      .orderBy("created_at")
      .whereNot("role", "=", "admin")
      .andWhereNot("rejected", "=", "true")
      .then(results => {
        let requestedOn = results.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        res.render("admin-pending-regs", {
          pendingBloggerRegistrations: results,
          requestedOn: requestedOn,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      });
  }
};
