const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");
const comments = require("../controllers/comments");
module.exports = app => {
  app.get("/", users.index);
  //app.get("/blogs", blogs.index);

  //User Login Only
  app.get("/user/login", users.userLogin);
  app.post("/users/main", users.main);
  app.post("/user/login", users.register);
  app.get("/user/profile/:id", users.userEdit);
  app.get("/users/main", userMiddleware, users.show);
  app.get("/profile/:id", userMiddleware, users.profile);
  app.get("/user/logout", userMiddleware, users.logout);
  // app.get("/article/:id", userMiddleware, users.profileArticle);
  app.get("/article/:id", userMiddleware, users.mainArticle);

  // Greg's Routes (mainly)
  //Blogger Login
  app.get("/blogger/login", bloggers.bloggerLoginPage);

  app.post("/blogger/login", bloggers.bloggerLogin);

  //Redirect Blogger to home/main profile page
  app.get("/blogger/home", bloggerAuthMiddleware, bloggers.bloggerHome);

  //Mandy's routes
  //Admin routes
  app.get("/admin/login", bloggers.adminLoginPage);
  app.post("/admin/login", bloggers.adminLogin);

  //PAGES ONLY AVAILABLE TO LOGGED IN ADMINS
  app.get("/admin/logout", adminAuthMiddleware, bloggers.adminLogout);
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
  app.get("/admin/pending-blogs", adminAuthMiddleware, blogs.adminPendingBlogs);
  app.get(
    "/admin/view/approved-blog/:blog_id",
    adminAuthMiddleware,
    blogs.adminApprovedView
  );
  app.get(
    "/admin/approved-blogs",
    adminAuthMiddleware,
    blogs.adminApprovedBlogs
  );
  app.get(
    "/admin/comments/delete/:comment_id/:blog_id",
    adminAuthMiddleware,
    comments.adminDelete
  );
  app.get(
    "/admin/userban/comments/delete/:comment_id/:blog_id",
    adminAuthMiddleware,
    comments.adminDeletetoUserBan
  );
  app.get("/admin/users/ban/:user_id", adminAuthMiddleware, users.adminBan);
  app.get(
    "/admin/users/unban/:user_id",
    adminAuthMiddleware,
    users.adminRejectBan
  );
  app.get("/admin/user-bans", adminAuthMiddleware, users.adminBanReqViewAll);
  app.get(
    "/admin/users/view/:user_id",
    adminAuthMiddleware,
    users.adminViewOne
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
    res.redirect("/blogger/login");
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
