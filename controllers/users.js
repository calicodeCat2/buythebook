const knex = require("../db/knex.js");
const moment = require("moment");

const getUnreadMessages = (bloggerID) => new Promise((resolve, reject) => {
  return knex("admin_messages")
    .select("id")
    .where("admin_messages.blogger_id", bloggerID)
    .andWhere("unread", true)
    .then(results => {
      resolve(results)
    })
    .catch(err => {
      console.log(err)
      return false
    })
})



module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: (req, res) => {
    let blogsAndBloggers = knex("blogs")
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

      // if (req.session.blogger) {
      //   let unReadMessages = knex("admin_messages")
      //     .select("id")
      //     .where("admin_messages.blogger_id", req.session.blogger.id)
      //     .andWhere("unread", true)
      // } else {
      //   let unReadMessages = new Promise((resolve, reject) => {
      //     resolve(undefined)
      //   })
      // }

      // Promise.all(blogsAndBloggers, unReadMessages)
      .then(results => {


        res.render("splash", {
          blogs: results,
          bloggers: results,
          //NECESSARY VARS FOR NAVBAR OPTIONS
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin,
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
    let user = knex("users").where("users.id", "=", req.session.user.id);
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
    Promise.all([user, bloggers, blogs]).then(results => {
      console.log(results[0]);
      res.render("main_page", {
        user: results[0],
        bloggers: results[1],
        blogs: results[2],
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
        "blogs.blog_content",
        "blogs.upvote",
        "blogs.downvote"
      )
      .join("blogs", "blogger_id", "=", "bloggers.id")
      .where("bloggers.id", req.params.id)
      .where("blogs.approved", "true")
      .then(results => {
        let blogger = results[0];
        let blogs = results;
        res.render("blogger_profile", {
          bloggers: results[0],
          blogs: results,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
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
        "blogs.blog_content",
        "blogs.upvote",
        "blogs.downvote"
      )
      .join("bloggers", "blogger_id", "=", "bloggers.id");
    let comments = knex("comments")
      .where("comments.blog_id", "=", req.params.id)
      .select("comments.*", "users.id", "users.screen_name")
      .join("users", "users.id", "=", "comments.user_id");
    Promise.all([blog, comments]).then(results => {
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
    knex("users")
      .where("users.id", "=", req.session.user.id)
      .then(results => {
        let user = results[0];

        res.render("user_profile", {
          user: user,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      });
  },

  editProfile: (req, res) => {
    knex("users")
      .where('users.id', '=', req.session.user.id)
        .then(() => {
          if (user.user_password === req.body.user_password) {
            knex('users')
            .where('users.id', '=', req.session.user.id)
            .update({
              user_name: req.body.user_name,
              screen_name: req.body.screen_name,

            })
            res.redirect('/user/login')
          } else {
            res.redirect('/user/profile')
          }

        });
  },


  showUserComments: (req, res) => {
    let user = knex("users").where("users.id", req.session.user.id);
    let comments = knex("comments")
      .where("comments.user_id", req.session.user.id)
      .orderBy("comments.created_at")
      .select(
        "comments.*",
        "users.screen_name",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blogger_id",
        "bloggers.blogger_name"
      )
      .innerJoin("users", "comments.user_id", "users.id")
      .innerJoin("blogs", "comments.blog_id", "blogs.id")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");

    Promise.all([user, comments]).then(results => {
      let user = results[0][0];

      let commentHistory = results[1];
      let commentCreatedOn = commentHistory.map(comment =>
        moment(comment.created_at)
          .toString()
          .slice(0, 16)
      );
      res.render("user_comments", {
        user: user,
        commentHistory: commentHistory,
        commentCreatedOn: commentCreatedOn,
        //NECESSARY VARS FOR NAVBAR OPTIONS
        loggedInUser: req.session.user,
        loggedInBlogger: req.session.blogger,
        loggedInAdmin: req.session.admin
      });
    });
  },

  upPlus: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.id)
      .increment("upvote", 1)
      .then(() => {
        res.redirect(`/article/${req.params.id}`);
      });
  },

  downMinus: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.id)
      .increment("downvote", 1)
      .then(() => {
        res.redirect(`/article/${req.params.id}`);
      });
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
      .select(
        "comments.*",
        "users.screen_name",
        "blogs.id",
        "blogs.blog_title",
        "blogs.blogger_id",
        "bloggers.blogger_name"
      )
      .innerJoin("users", "comments.user_id", "users.id")
      .innerJoin("blogs", "comments.blog_id", "blogs.id")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");

    Promise.all([user, comments]).then(results => {
      let user = results[0][0];
      let comentHistory = results[1];
      console.log(comentHistory);
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
