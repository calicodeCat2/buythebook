exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("genre")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("genre").insert([
        { genre_name: "Mystery" },
        { genre_name: "Romance" },
        { genre_name: "Horror" },
        { genre_name: "SciFi" },
        { genre_name: "Fantasy" },
        { genre_name: "Drama" }
      ]);
    });
};
