const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: (req, res) => {
    knex('blogs').join('bloggers', 'bloggers.id', '=', 'blogger_id')
      .then((results) => {

        res.render('splash', {
          blogs: results,
          bloggers: results
        })

      })
  },

  userLogin: (req, res) => {
    res.render('user-login')
  },

  main: (req, res) => {
    knex("users")
      .where('user_email', req.body.user_email)
      .then((results) => {
        let user = results[0]
        if (!user) {
          res.redirect('user/login')
        } else if (user.user_password === req.body.user_password) {
          req.session.user = user;
          req.session.blogger = null;
          req.session.admin = null;
          res.redirect('/users/main')
        } else {
          res.redirect('user/login')
        }

      })
  },

  show: (req, res) => {
    knex('bloggers')
      .select('bloggers.id', 'bloggers.image_url',
        'bloggers.blogger_name', 'bloggers.genre',
        'blogs.id', 'blogs.blog_title', 'blogs.blog_content')
      .join('blogs', 'blogger_id', '=', 'bloggers.id')
      .orderBy('blogs.blog_title', 'asc')
      .then((results) => {
        res.render('main_page', {
          bloggers: results,
          blogs: results
        })
      })
  },

  profile: (req, res) => {
    knex('bloggers')
      .select('bloggers.id', 'bloggers.image_url',
        'bloggers.blogger_name', 'bloggers.genre',
        'blogs.id', 'blogs.blog_title', 'blogs.blog_content')
      .join('blogs', 'blogger_id', '=', 'bloggers.id')
      .then((results) => {
          let blogger = results[0]

          res.render('blogger_profile', {bloggers:results[0], blogs:results})
      })
  }
};
