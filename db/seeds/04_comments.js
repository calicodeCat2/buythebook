exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(function() {
      return knex("comments").insert([
        {
          content: "Really, your going with that.",
          blog_id: 2,
          user_id: 1
        },
        {
          content: "I can just feel the raw emotion on my trembling feelings.",
          blog_id: 4,
          user_id: 3
        },
        {
          content: "This really talks to me. Really.",
          blog_id: 3,
          user_id: 4
        },
        {
          content:
            "A towering, tour-de-force manifesto that captures the fin-de-sicle ennui of technology and love.",
          blog_id: 2,
          user_id: 2
        },
        {
          content: "I've read better.",
          blog_id: 6,
          user_id: 4
        },
        {
          content: "I'm just here to troll.",
          blog_id: 7,
          user_id: 6
        },
        {
          content: "I want to like this, but I just don't get it.",
          blog_id: 5,
          user_id: 5
        }
      ]);
    });
};
