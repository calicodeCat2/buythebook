const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");
const comments = require("../controllers/comments");
const messages = require("../controllers/admin_messages");
module.exports = app => {
  app.get("/", users.index);
  //app.get("/blogs", blogs.index);

  app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  //User Login Only
  app.get("/user/login", users.userLogin);
  app.post("/users/main", users.main);
  app.post("/user/login", users.register);
  app.get("/user/profile", users.userEdit);
  app.post("/user/login", users.editProfile);
  app.post("/new/comment/:id", userMiddleware, users.addComment)
  app.get("/user/comments", userMiddleware, users.showUserComments);
  app.get("/users/main", userMiddleware, users.show);
  app.get("/profile/:id", userMiddleware, users.profile);
  app.get("/user/logout", userMiddleware, users.logout);
  app.get("/upvote/:id", userMiddleware, users.upPlus);
  app.get("/downvote/:id", userMiddleware, users.downMinus);
  app.get("/article/:id", userMiddleware, users.mainArticle);

  // Greg's Routes (mainly)
  //Blogger Login
  app.get("/blogger/login", bloggers.bloggerLoginPage);

  app.post("/blogger/login", bloggers.bloggerLogin);
  // app.post("/blogs/register", bloggers.register)

  //Redirect Blogger to home/main profile page
  app.get("/blogger/home", bloggerAuthMiddleware, bloggers.bloggerHome);
  app.get("/blogger/logout", bloggerAuthMiddleware, bloggers.logout);

  //ADD a new blog post 
  app.get("/blogger/new", bloggerAuthMiddleware, bloggers.newBlogPage);
  app.post("/blogger/new", bloggerAuthMiddleware, bloggers.newBlog);

  //mark message as read 
  app.get("/bloggers/messages/read/:message_id", bloggerAuthMiddleware, bloggers.markAsRead)


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

  app.post(
    "/admin/message/blogger/:blogger_id",
    adminAuthMiddleware,
    messages.adminCreateMessage
  );
  app.get(
    "/admin/manage-bloggers",
    adminAuthMiddleware,
    bloggers.adminViewApprovedBloggers
  );

  app.get(
    "/blogger/messages",
    bloggerAuthMiddleware,
    bloggers.viewAdminMessages
  );

  app.get("/admin/add-admin", adminAuthMiddleware, bloggers.addNewAdmin)
  app.get("/admin/promote/blogger/:blogger_id", adminAuthMiddleware, bloggers.promoteToAdmin)

  app.get("/admin/blog/new", adminAuthMiddleware, bloggers.adminNewBlogPage)
  app.post("/admin/blogger/new", adminAuthMiddleware, bloggers.adminNewBlog)
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
