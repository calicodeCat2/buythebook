const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },

  bloggerLoggin :  function(req, res) {
    knex('buybookdata').then(results => {
      res.redner("blogger_loggin")
    })
  }
};
