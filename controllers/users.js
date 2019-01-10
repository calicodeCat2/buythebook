const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: (req, res) => {
    knex("blogs")
      .where("blogs.approved", "true")
      .select(
        "bloggers.id",
        "bloggers.blogger_name",
        "bloggers.image_url",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blog_content"
      )
      .select(
        "bloggers.id",
        "bloggers.blogger_name",
        "bloggers.image_url",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blog_content"
      )
      .join("bloggers", "bloggers.id", "=", "blogger_id")
      .then(results => {
        res.render("splash", {
          blogs: results,
          bloggers: results,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      });
  },

  userLogin: (req, res) => {
    res.render("user-login", {
      //NECESSARY VARS FOR NAVBAR OPTIONS
      loggedInUser: req.session.user,
      loggedInBlogger: req.session.blogger,
      loggedInAdmin: req.session.admin
    });
  },

  main: (req, res) => {
    knex("users")
      .where("user_email", req.body.user_email)
      .andWhere("banned", "=", "false")
      .then(results => {
        let user = results[0];
        if (!user) {
          res.redirect("/user/login");
        } else if (user.user_password === req.body.user_password) {
          req.session.user = user;
          req.session.blogger = null;
          req.session.admin = null;
          res.redirect("/users/main");
        } else {
          res.redirect("/user/login");
        }
      });
  },

  show: (req, res) => {
    let bloggers = knex("bloggers").select(
      "bloggers.id",
      "bloggers.image_url",
      "bloggers.blogger_name",
      "bloggers.genre"
    );
    let blogs = knex("blogs")
      .where("blogs.approved", "true")
      .select("blogs.*", "bloggers.blogger_name")
      .join("bloggers", "bloggers.id", "blogs.blogger_id");
    Promise.all([bloggers, blogs]).then(results => {
      console.log("bloggers", results[0]);
      console.log("blogs", results[1]);
      res.render("main_page", {
        bloggers: results[0],
        blogs: results[1],
        //NECESSARY VARS FOR NAVBAR OPTIONS
        loggedInUser: req.session.user,
        loggedInBlogger: req.session.blogger,
        loggedInAdmin: req.session.admin
      });
    });
  },

  profile: (req, res) => {
    knex("bloggers")
      .select(
        "bloggers.id",
        "bloggers.image_url",
        "bloggers.blogger_name",
        "bloggers.genre",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blog_content"
      )
      .join("blogs", "blogger_id", "=", "bloggers.id")
      .where("bloggers.id", req.params.id)
      .then(results => {
        let blogger = results[0];
        let blogs = results;
        res.render("blogger_profile", { bloggers: results[0], blogs: results });
      });
  },
  logout: (req, res) => {
    req.session.user = null;
    req.session.blogger = null;
    req.session.admin = null;
    res.redirect("/");
  },

  mainArticle: (req, res) => {
    let blog = knex("blogs")
      .where("blogs.id", req.params.id)
      .andWhere("blogs.approved", "true")
      .select(
        "bloggers.id",
        "bloggers.blogger_name",
        "bloggers.image_url",
        "bloggers.genre",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blog_content"
      )
      .join("bloggers", "blogger_id", "=", "bloggers.id");
    let comments = knex("comments")
      .where("comments.blog_id", "=", req.params.id)
      .select("comments.*", "users.id", "users.screen_name")
      .join("users", "users.id", "=", "comments.user_id");
    Promise.all([blog, comments]).then(results => {
      console.log("what's up?", results);
      res.render("blogger_article", {
        blog: results[0][0],
        comments: results[1],
        //NECESSARY VARS FOR NAVBAR OPTIONS
        loggedInUser: req.session.user,
        loggedInBlogger: req.session.blogger,
        loggedInAdmin: req.session.admin
      });
    });
  },

  register: (req, res) => {
    knex("users")
      .insert({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        screen_name: req.body.screen_name
      })
      .then(() => {
        res.redirect("/user/login");
      });
  },

  userEdit: (req, res) => {
    // Work in Progress
  },

  // Admin below this line, Users above

  adminBan: (req, res) => {
    knex("users")
      .where("users.id", req.params.user_id)
      .update({
        banned: true,
        "ban-requested": false
      })
      .then(() => {
        res.redirect("/admin/home");
      })
      .catch(err => console.log(err));
  },
  adminRejectBan: (req, res) => {
    knex("users")
      .where("users.id", req.params.user_id)
      .update({
        banned: false,
        "ban-requested": false
      })
      .then(() => {
        res.redirect("/admin/home");
      })
      .catch(err => console.log(err));
  },
  adminBanReqViewAll: (req, res) => {
    let users = knex("users")
      .where("users.ban-requested", "=", "true")
      .andWhereNot("users.banned", "true")
      .orderBy("users.created_at")

      .then(results => {
        res.render("admin-userbans-view", {
          users: results, //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      });
  },
  adminViewOne: (req, res) => {
    let user = knex("users").where("users.id", req.params.user_id);
    let comments = knex("comments")
      .where("comments.user_id", req.params.user_id)
      .orderBy("comments.created_at")
      .select("comments.*", "users.screen_name")
      .innerJoin("users", "comments.user_id", "users.id");

    Promise.all([user, comments]).then(results => {
      let user = results[0][0];
      let comentHistory = results[1];
      let commentCreatedOn = comentHistory.map(comment =>
        moment(comment.created_at)
          .toString()
          .slice(0, 16)
      );
      res.render("admin-userban-singleView", {
        user: user,
        comentHistory: comentHistory,
        commentCreatedOn: commentCreatedOn,
        //NECESSARY VARS FOR NAVBAR OPTIONS
        loggedInUser: req.session.user,
        loggedInBlogger: req.session.blogger,
        loggedInAdmin: req.session.admin
      });
    });
  }
};
