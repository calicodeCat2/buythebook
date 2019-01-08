const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: (req, res) => {
    knex("blogs")
      .join("bloggers", "bloggers.id", "=", "blogger_id")
      .then(results => {
        res.render("splash", {
          blogs: results,
          bloggers: results
        });
      });
  },

  userLogin: (req, res) => {
    res.render("user-login");
  },

  main: (req, res) => {
    knex("users")
      .where("user_email", req.body.user_email)
      .then(results => {
        let user = results[0];
        if (!user) {
          res.redirect("user/login");
        } else if (user.user_password === req.body.user_password) {
          req.session.user = user;
          req.session.blogger = null;
          req.session.admin = null;
          res.redirect("/users/main");
        } else {
          res.redirect("user/login");
        }
      });
  },

  show: (req, res) => {

    let bloggers =
    knex('bloggers')
      .select('bloggers.id', 'bloggers.image_url',
        'bloggers.blogger_name', 'bloggers.genre',)
    let blogs =
      knex('blogs')
      .select('blogs.*', 'bloggers.blogger_name')
      .join('bloggers', 'bloggers.id', 'blogs.blogger_id')
      Promise.all([bloggers, blogs])
      .then((results) => {
        console.log('bloggers', results[0])
      console.log('blogs', results[1])
        res.render('main_page', {
          bloggers: results[0],
          blogs: results[1]
        })
      })
  },

  profile: (req, res) => {
    console.log("Napoleon, I am here");
    knex('bloggers').where('bloggers.id', req.params.id)
      .select('bloggers.id', 'bloggers.image_url',
        'bloggers.blogger_name', 'bloggers.genre',
        'blogs.id', 'blogs.blog_title', 'blogs.blog_content')
      .join('blogs', 'blogger_id', '=', 'bloggers.id')
      .then((results) => {
          let blogger = results[0]
          res.render('blogger_profile', {blogger:results[0], blogs:results})

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
      .orderBy("blogs.blog_title", "asc")
      .then(results => {
        res.render("main_page", {
          bloggers: results,
          blogs: results
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
      .then(results => {
        let blogger = results[0];

        res.render("blogger_profile", { bloggers: results[0], blogs: results });
      });
  },
  adminBan: (req, res) => {
    knex("users")
      .where("users.id", req.params.user_id)
      .update({
        banned: true,
        "ban-requested": false
>>>>>>> 4b6a22b24cc785f2eca2919b13459136b56d5d83
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
  banReqViewAll: (req, res) => {
    knex("users")
      .where("users.ban-requested", "=", "true")
      .andWhereNot("users.banned", "true")
      .orderBy("users.created_at")
      .then(results => {
        console.log(results);
        res.render("admin-userbans-view", { users: results });
      });
  }
};
