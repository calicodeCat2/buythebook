const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  index: function(req, res) {
    res.send("Hello");
  },
  adminApprove: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .update({
        approved: true
      })
      .then(result => {
        res.redirect("/admin/home");
      });
  },
  adminView: (req, res) => {
    let blog = knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .select("blogs.*", "bloggers.blogger_name")
      .innerJoin("bloggers", "bloggers.id", "blogs.blogger_id")

      .then(result => {
        console.log(result[0]);
        let writtenOn = moment(result[0].created_on)
          .toString()
          .slice(0, 16);
        res.render("admin-blog-view", {
          blog: result[0],
          writtenOn: writtenOn
        });
      });
  },
  adminReject: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .update({
        rejected: true
      })
      .then(() => {
        res.redirect("/admin/home");
      });
  }
};
