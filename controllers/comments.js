const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  adminDelete: (req, res) => {
    knex("comments")
      .where("comments.id", req.params.comment_id)
      .del()
      .then(results => {
        res.redirect(`/admin/view/approved-blog/${req.params.blog_id}`);
      })
      .catch(err => console.log(err));
  }
};
