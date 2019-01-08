const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");

module.exports = app => {
<<<<<<< HEAD

  app.get("/", users.index)





};













function userMiddleware(req, res, next) {
    if (!req.session.id) {
        res.redirect("/");
    } else {
        next();
    }
=======
  app.get("", blogs.index);

  //Blogger Login Only
  app.get("/blogger/login", bloggers.bloggerLogin)

  //Mandy's routes
  //Admin routes
  app.get("/admin/login", bloggers.adminLoginPage);
  app.post("/admin/login", bloggers.adminLogin);
};
function adminAuthMiddleware(req, res, next) {
  if (!req.session.admin || req.session.admin.role !== "admin") {
    res.redirect("admin/login");
  } else {
    next();
  }

  function bloggerAuthMiddleware(req, res, next) {
    if(!req.session.blogger || req.session.blogger.role !== "blogger") {
      res.redirect("blogger/login");
    } else {
      next()
    }
   }

>>>>>>> e03c3c749d854d594100796315803c2e4b38a4ab
}
