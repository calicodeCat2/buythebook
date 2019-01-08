const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  adminApprove: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .update({
        approved: false
      })
      .then(result => {
        res.redirect("/admin/home");
      });
  }
};
