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
        console.log('user', results[0]);
        if (!user) {
          res.redirect('user/login')
        } else if (user.user_password === req.body.user_password) {
          req.session.user = user;
          console.log('session',req.session.user);
          req.session.blogger = null;
          req.session.admin = null;
          res.render('main_page', {user:results[0]})
        } else {
          res.redirect('user/login')
        }

      })
  }
};
