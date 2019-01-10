const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  adminCreateMessage: (req, res) => {
    knex("admin_messages")
      .insert({
        message_title: req.body.message_title,
        message_content: req.body.message_content,
        admin_id: req.session.admin.id,
        blogger_id: req.params.blogger_id
      })
      .then(() => {
        res.redirect(`/admin/view/blogger/${req.params.blogger_id}`);
      });
  }
};
