exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("bloggers")
    .del()
    .then(function () {
      return knex("bloggers").insert([
        {
          blogger_name: "Bob Blogger",
          blogger_email: "bob@gmail.com",
          blogger_password: "writer",
          years_blogging: 3,
          genre: "Mystery",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/images/150/Victor_Hugo.jpg",
          role: "admin",
          approved: true
        },
        {
          blogger_name: "Marcus",
          blogger_email: "twain@gmail.com",
          blogger_password: "writer",
          years_blogging: 10,
          genre: "SciFi",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/MarkTwain.jpg",
          approved: true
        },

        {
          blogger_name: "Billy",
          blogger_email: "billy@gmail.com",
          blogger_password: "writer",
          years_blogging: 4,
          genre: "Fantasy",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/william-Shakespeare2.jpg"
        },
        {
          blogger_name: "Jane",
          blogger_email: "pride@gmail.com",
          blogger_password: "writer",
          years_blogging: 8,
          genre: "Romance",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/Jane_Austen_18703.jpg",
          approved: true
        },
        {
          blogger_name: "Mia",
          blogger_email: "mia@gmail.com",
          blogger_password: "writer",
          years_blogging: 3,
          genre: "Mystery",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/images/150/Victor_Hugo.jpg",
        },
        {
          blogger_name: "Eva",
          blogger_email: "eva@gmail.com",
          blogger_password: "writer",
          years_blogging: 10,
          genre: "SciFi",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/MarkTwain.jpg",
        },

        {
          blogger_name: "Jack",
          blogger_email: "jack@gmail.com",
          blogger_password: "writer",
          years_blogging: 4,
          genre: "Fantasy",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/william-Shakespeare2.jpg"
        },
        {
          blogger_name: "Maria",
          blogger_email: "maria@gmail.com",
          blogger_password: "writer",
          years_blogging: 8,
          genre: "Romance",
          link: "http://www.google.com",
          sample:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image_url:
            "https://www.biographyonline.net/wp-content/uploads/2014/05/Jane_Austen_18703.jpg",
        }
      ]);
    });
};
