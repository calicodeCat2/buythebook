exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("admin_messages")
    .del()
    .then(function() {
      return knex("admin_messages").insert([
        {
          admin_id: 1,
          blogger_id: 2,
          message_title: "Important Please Read",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        },
        {
          admin_id: 1,
          blogger_id: 2,
          message_title: "Message Title",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        },
        {
          admin_id: 1,
          blogger_id: 2,
          message_title: "Read Message",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        },
        {
          unread: false,
          admin_id: 1,
          blogger_id: 2,
          message_title: "Here We Go",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        },
        {
          unread: false,
          admin_id: 1,
          blogger_id: 2,
          message_title: "Important Please Read",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        },
        {
          unread: false,
          admin_id: 1,
          blogger_id: 2,
          message_title: "Important Please Read",
          message_content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown"
        }
      ]);
    });
};
