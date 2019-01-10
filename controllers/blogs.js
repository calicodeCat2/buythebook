const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  adminApprove: (req, res) => {
    knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .update({
        approved: true,
        rejected: false
      })
      .then(result => {
        res.redirect("/admin/home");
      })
      .catch(err => console.log(err));
  },
  adminView: (req, res) => {
    let blog = knex("blogs")
      .where("blogs.id", "=", req.params.blog_id)
      .select("blogs.*", "bloggers.blogger_name")
      .innerJoin("bloggers", "bloggers.id", "blogs.blogger_id")

      .then(result => {
        let writtenOn = moment(result[0].created_on)
          .toString()
          .slice(0, 16);
        res.render("admin-blog-view", {
          blog: result[0],
          writtenOn: writtenOn,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
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
      })
      .catch(err => console.log(err));
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
        console.log("this is the pending blog knex query result: ", results);
        res.render("admin-pending-blogs", {
          pendingBlogPosts: results,
          requestedOn: requestedOn,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
  },
  adminApprovedBlogs: (req, res) => {
    let approvedBlogs = knex("blogs")
      .select("blogs.*", "bloggers.blogger_name")
      .where("blogs.approved", "=", "true")
      .orderBy("blogs.created_at")
      .innerJoin("bloggers", "blogs.blogger_id", "bloggers.id")

      .then(results => {
        let requestedOn = results.map(reg =>
          moment(reg.created_at)
            .toString()
            .slice(0, 16)
        );
        res.render("admin-approved-blogs", {
          approvedBlogs: results,
          requestedOn: requestedOn,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
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
          commentMadeOn: commentMadeOn,
          loggedInUser: req.session.user,
          loggedInBlogger: req.session.blogger,
          loggedInAdmin: req.session.admin
        });
      })
      .catch(err => console.log(err));
  }
};
