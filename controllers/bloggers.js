const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function (req, res) {
    res.send("Hello");
  },
  //THIS RENDERS THE BLOGGER LOGIN PAGE
  bloggerLoginPage: function (req, res) {
    knex("genre")
      .then(results => {
        res.render("blogger_login", {
          genres: results,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin,
        });
      })

  },
  register: (req, res) => {
    knex("bloggers")
      .insert({
        blogger_name: req.body.name,
        blogger_email: req.body.email.toLowerCase(),
        blogger_password: req.body.blogger_password,

      })
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
          req.flash("Info", "Invalid Password");
          res.redirect("/blogger/login");
        }
      });
  },

  bloggerHome: function (req, res) {
    let adminMessages = knex("admin_messages")
      .select("id")
      .where("admin_messages.blogger_id", req.session.blogger.id)
      .andWhere("unread", true)
    let accessBlogs = knex("blogs")
      .where("blogs.blogger_id", req.session.blogger.id)
    Promise.all([adminMessages, accessBlogs])
      .then(results => {
        let unReadMessages = results[0]
        let blogs = results[1]
        res.render("blogger_home", { blogs: blogs, unReadMessages: unReadMessages, loggedInUser: req.session.user, loggedInAdmin: req.session.admin, loggedInBlogger: req.session.blogger })
      })
  },

  logout: (req, res) => {
    req.session.user = null;
    req.session.blogger = null;
    req.session.admin = null;
    res.redirect("/");
  },

  newBlogPage: (req, res) => {
    let adminMessages = knex("admin_messages")
      .select("id")
      .where("admin_messages.blogger_id", req.session.blogger.id)
      .andWhere("unread", true)
      .then(results => {
        res.render("blogger-new-blog", {
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin,
          unReadMessages: results
        });
      })

  },

  newBlog: (req, res) => {
    knex("blogs")
      .insert({
        blog_title: req.body.blog_title,
        blog_content: req.body.content,
        blogger_id: req.session.blogger.id
      })
      .then(() => {
        res.redirect("/blogger/home");
      });
  },

  editBlog: (req, res) => {
    knex("blogs").then(results => {
      let blogs = results
      res.render("blogs")
    })
  },
  markAsRead: (req, res) => {
    knex("admin_messages")
      .where('admin_messages.id', req.params.message_id)
      .update({
        unread: false
      }).then(() => {
        res.redirect("/blogger/messages")
      })

  },

  viewAdminMessages: (req, res) => {
    let messages = knex("bloggers")
      .where("bloggers.id", req.session.blogger.id)
      .select(
        "bloggers.id",
        "bloggers.blogger_name",
        "admin_messages.message_title",
        "admin_messages.message_content",
        "admin_messages.unread",
        "admin_messages.blogger_id",
        knex.ref('admin_messages.id').as('message_id')
      )
      .innerJoin(
        "admin_messages",
        "admin_messages.blogger_id",
        req.session.blogger.id
      )
      .orderBy("unread", "desc")

    let unReadMessages = knex("admin_messages")
      .select("id")
      .where("admin_messages.blogger_id", req.session.blogger.id)
      .andWhere("unread", true)

    Promise.all([messages, unReadMessages])
      .then(results => {
        console.log(results[0])
        res.render("blogger-messages", {
          messages: results[0],
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin,
          unReadMessages: results[1]
        });
      });
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
      .where("blogger_email", req.body.admin_email.toLowerCase())
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
      .andWhereNot("users.banned", "true")
      .orderBy("users.created_at");

    let approvedBlogs = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "true")
      .orderBy("blogs.created_at")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");

    let approvedBloggers = knex("bloggers")
      .select(
        "id",
        "blogger_name",
        "years_blogging",
        "genre",
        "link",
        "sample",
        "created_at",
        "image_url"
      )
      .where("bloggers.approved", "=", "true")
      .andWhere("bloggers.rejected", "=", "false")
      .andWhere("bloggers.role", "blogger")
      .orderBy("created_at");

    Promise.all([
      pendingBloggerRegistrations,
      pendingBlogPosts,
      pendingBanRequests,
      approvedBlogs,
      approvedBloggers
    ])
      .then(results => {
        let pendingRegs = results[0].length
        let firstThreeRegs = results[0].slice(0, 3);
        let requestedOn = firstThreeRegs.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        let firstThreeBlogs = results[1].slice(0, 3);
        let pendingBlogPosts = results[1].length
        let blogCreatedOn = firstThreeBlogs.map(blog =>
          moment(blog.created_at)
            .toString()
            .slice(0, 16)
        );

        let firstThreeBanReqs = results[2].slice(0, 3);
        let userBanRequests = results[2].length
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

        let firstThreeBloggers = results[4].slice(0, 3);
        let approvedBloggers = results[4].length
        let requestedOnbloggerStarted = firstThreeRegs.map(blogger =>
          moment(blogger.created_at)
            .toString()
            .slice(0, 16)
        );

        res.render("admin-home", {
          userBanRequests: userBanRequests,
          approvedBloggers: approvedBloggers,
          admin: req.session.admin,
          pendingRegs: pendingRegs,
          pendingBlogPosts: pendingBlogPosts,
          firstThreeRegs: firstThreeRegs,
          requestedOn: requestedOn,
          firstThreeBlogs: firstThreeBlogs,
          blogCreatedOn: blogCreatedOn,
          firstThreeBanReqs: firstThreeBanReqs,
          banRequestedOn: banRequestedOn,
          firstThreeApprovedBlogs: firstThreeApprovedBlogs,
          approvedBlogCreatedOn: approvedBlogCreatedOn,
          firstThreeBloggers: firstThreeBloggers,
          requestedOnbloggerStarted: requestedOnbloggerStarted,
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
      })
      .catch(err => console.log(err));
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
      })
      .catch(err => console.log(err));
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
      })
      .catch(err => console.log(err));
  },
  adminViewApprovedBloggers: (req, res) => {
    knex("bloggers")
      .where("bloggers.approved", "=", "true")
      .orderBy("created_at")
      .whereNot("role", "=", "admin")
      .andWhereNot("rejected", "=", "true")
      .then(results => {
        let requestedOn = results.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        res.render("admin-manage-bloggers", {
          approvedBloggers: results,
          requestedOn: requestedOn,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
  },
  addNewAdmin: (req, res) => {
    knex("bloggers")
      .where("bloggers.approved", "=", "true")
      .orderBy("created_at")
      .whereNot("role", "=", "admin")
      .andWhereNot("rejected", "=", "true")
      .then(results => {
        res.render("promote-to-admin", {
          potentialAdmins: results,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        })
      }).catch(err => console.log(err));

  },
  promoteToAdmin: (req, res) => {
    knex("bloggers")
      .where("bloggers.approved", "=", "true")
      .whereNot("role", "=", "admin")
      .andWhereNot("rejected", "=", "true")
      .andWhere('bloggers.id', req.params.blogger_id)
      .update({
        role: "admin"
      })
      .then(() => {
        res.redirect("/admin/add-admin")
      })
      .catch(err => console.log(err));
  },
  adminNewBlogPage: (req, res) => {
    res.render("blogger-new-blog", {
      //NECESSARY VARS FOR NAVBAR OPTIONS
      loggedInUser: req.session.user,
      loggedInBlogger: req.session.blogger,
      loggedInAdmin: req.session.admin,
    });
  },
  adminNewBlog: (req, res) => {
    knex("blogs")
      .insert({
        blog_title: req.body.blog_title,
        blog_content: req.body.content,
        blogger_id: req.session.blogger.id
      })
      .then(() => {
        res.redirect("/admin/home");
      });
  }
};
