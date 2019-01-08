const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE BLOGGER LOGIN PAGE

  bloggerLoginPage: function(req, res) {
    res.render('blogger_login')
  },

  bloggerLogin: function(req, res) {
    knex('bloggers')
      .where('blogger_email', req.body.blogger_email)
      .then((results) => {
        let blogger = results[0]
        console.log(results[0])
        if(!blogger){
          res.redirect('blogger_login')
        } else if(bloggers.blogger_password === req.body.password){
          res.session.blogger = blogger

          req.session.user = null
          req.session.admin = null
          res.render("blogger_home", {blogger:results[0]})
        } else{
          res.redirect("blogger_login")
        }
      })
  },

  bloggerHome: function(req, res){
    if(bloggerLogin === true){
      res.render("blogger_home")
    }
    res.render("blogger_login");
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
          approvedBlogCreatedOn: approvedBlogCreatedOn
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
          appSubmittedOn: appSubmittedOn
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
          requestedOn: requestedOn
        });
      });
  }
};
