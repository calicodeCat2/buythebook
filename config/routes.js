const bloggers = require("../controllers/bloggers");
const users = require("../controllers/users");
const blogs = require("../controllers/blogs");

module.exports = app => {
  app.get("", blogs.index);
};
