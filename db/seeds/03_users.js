exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          user_name: "Marilyn",
          user_email: "email1@email.com",
          user_password: "1234",
          screen_name: "babydoll"
        },
        {
          user_name: "Juan",
          user_email: "email2@email.com",
          user_password: "1234",
          screen_name: "aficianado",
          "ban-requested": true
        },
        {
          user_name: "Tom",
          user_email: "email3@email.com",
          user_password: "1234",
          screen_name: "tomcat"
        },
        {
          user_name: "Ruth",
          user_email: "email4@email.com",
          user_password: "1234",
          screen_name: "ruthless"
        },
        {
          user_name: "Dom",
          user_email: "email5@email.com",
          user_password: "1234",
          screen_name: "the_dominator"
        },
        {
          user_name: "Sybil",
          user_email: "email6@email.com",
          user_password: "1234",
          screen_name: "allofus"
        },
        {
          user_name: "Jared",
          user_email: "email7email.com",
          user_password: "1234",
          screen_name: "personpants",
          "ban-requested": true
        },
        {
          user_name: "Stacy",
          user_email: "email8@email.com",
          user_password: "1234",
          screen_name: "stacymacy",
          "ban-requested": true
        },
        {
          user_name: "Felicia",
          user_email: "email9@email.com",
          user_password: "1234",
          screen_name: "tonya",
          "ban-requested": true
        },
        {
          user_name: "Erin",
          user_email: "email10@email.com",
          user_password: "1234",
          screen_name: "serra",
          "ban-requested": true
        },
      ]);
    });
};
