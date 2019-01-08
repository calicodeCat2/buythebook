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
        approved: true,
        rejected: false
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
        rejected: true,
        approved: false
      })
      .then(() => {
        res.redirect("/admin/home");
      });
  },
  adminPendingBlogs: (req, res) => {
    knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "false")
      .orderBy("created_at")
      .whereNot("role", "=", "admin")
      .andWhereNot("blogs.rejected", "=", "true")
      .innerJoin("bloggers", "blogs.blogger_id", "=", "bloggers.id")

      .then(results => {
        let requestedOn = results.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        res.render("admin-pending-blogs", {
          pendingBlogPosts: results,
          requestedOn: requestedOn
        });
      });
  },
  adminApprovedBlogs: (req, res) => {
    let approvedBlogs = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "true")
      .orderBy("blogs.created_at")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id")

      .then(results => {
        console.log(results);
        let requestedOn = results.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        res.render("admin-approved-blogs", {
          approvedBlogs: results,
          requestedOn: requestedOn
        });
      });
  },
  adminApprovedView: (req, res) => {
    let blog = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.id", "=", req.params.blog_id)
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id");
    let comments = knex("comments")
      .where("comments.blog_id", "=", req.params.blog_id)
      .select("comments.*", "users.screen_name")
      .innerJoin("users", "comments.user_id", "users.id");
    Promise.all([blog, comments])
      .then(results => {
        let blog = results[0][0];
        let comments = results[1];
        console.log(comments);
        let commentMadeOn = comments.map(comment =>
          moment(comment.created_at)
            .toString()
            .slice(0, 16)
        );
        let writtenOn = moment(blog.created_on)
          .toString()
          .slice(0, 16);
        res.render("admin-approved-blog-view", {
          blog: blog,
          comments: comments,
          writtenOn: writtenOn,
          commentMadeOn: commentMadeOn
        });
      })
      .catch(err => console.log(err));
  }
};
