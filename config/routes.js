const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");

module.exports = app => {

  app.get("/", users.index)





};













function userMiddleware(req, res, next) {
    if (!req.session.id) {
        res.redirect("/");
    } else {
        next();
    }
}
