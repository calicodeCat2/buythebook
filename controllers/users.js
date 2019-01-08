const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: (req, res) => {
    knex('blogs').join('bloggers', 'bloggers.id', '=', 'blogger_id')
      .then((results) => {

          res.render('splash', {blogs:results, bloggers:results})
  console.log(results);
      })
  }
};
