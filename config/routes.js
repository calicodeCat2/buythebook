const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");

module.exports = app => {
  app.get("/", users.index);
  app.get("", blogs.index);

  app.get("/user/login", users.userLogin);
  //User Login Only
  app.post("/users/main", users.main);

  //Blogger Login Only
  app.get("/blogger/login", bloggers.bloggerLogin);

  //Mandy's routes
  //Admin routes
  app.get("/admin/login", bloggers.adminLoginPage);
  app.post("/admin/login", bloggers.adminLogin);

  //PAGES ONLY AVAILABLE TO LOGGED IN ADMINS
  app.get("/admin/home", adminAuthMiddleware, bloggers.adminHome);
  //ROUTE TO APPROVE BLOGGER
  app.get(
    "/admin/approve/blogger/:blogger_id",
    adminAuthMiddleware,
    bloggers.adminApprove
  );
  //ROUTE FOR VIEWING INDIVIDUAL BLOGGER FOR ADMIN
  app.get(
    "/admin/view/blogger/:blogger_id",
    adminAuthMiddleware,
    bloggers.adminBloggerView
  );
  app.get(
    "/admin/reject/blogger/:blogger_id",
    adminAuthMiddleware,
    bloggers.adminRejectBlogger
  );
  app.get(
    "/admin/pending-regs",
    adminAuthMiddleware,
    bloggers.adminPendingRegs
  );
  app.get(
    "/admin/view/blogger/:blogger_id",
    adminAuthMiddleware,
    bloggers.adminBloggerView
  );
  app.get(
    "/admin/approve/blog/:blog_id",
    adminAuthMiddleware,
    blogs.adminApprove
  );
  app.get("/admin/view/blog/:blog_id", adminAuthMiddleware, blogs.adminView);
  app.get(
    "/admin/reject/blog/:blog_id",
    adminAuthMiddleware,
    blogs.adminReject
  );
};
function adminAuthMiddleware(req, res, next) {
  if (!req.session.admin || req.session.admin.role !== "admin") {
    res.redirect("/admin/login");
  } else {
    next();
  }
}

function bloggerAuthMiddleware(req, res, next) {
  if (!req.session.blogger || req.session.blogger.role !== "blogger") {
    res.redirect("blogger/login");
  } else {
    next();
  }
}

function userMiddleware(req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
}
