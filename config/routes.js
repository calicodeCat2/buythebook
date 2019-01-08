const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");

module.exports = app => {
  app.get("", blogs.index);

  //Mandy's routes
  //Admin routes
  app.get("/admin/login", bloggers.adminLoginPage);
  app.post("/admin/login", bloggers.adminLogin);

  //PAGES ONLY AVAILABLE TO LOGGED IN ADMINS
  app.get("/admin/home", adminAuthMiddleware, bloggers.adminHome);
};

function adminAuthMiddleware(req, res, next) {
  if (!req.session.admin || req.session.admin.role !== "admin") {
    res.redirect("admin/login");
  } else {
    next();
  }
}