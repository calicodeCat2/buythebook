document.addEventListener("DOMContentLoaded", function() {
  if (document.querySelector("#editor-container")) {
    var quill = new Quill("#editor-container", {
      modules: {
        toolbar: [
          [{ header: "2" }],
          [{ align: [] }],
          [{ font: [] }],
          ["bold", "italic", "strike"],
          ["link", "blockquote", "code-block", "image"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }]
        ]
      },
      placeholder: "Compose an epic blog post...",
      theme: "snow"
    });

    // var options =
    var form = document.querySelector("#blogForm");
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        let content = quill.root.innerHTML;
        var blog_title = document.querySelector("input[name=blog_title]").value;
        let data = {};
        data.blog_title = blog_title;
        data.content = content;

        var headers = new Headers();
        headers.append("Content-Type", "application/json"); // This one sends body
        fetch("/blogger/new", {
          method: "POST",
          body: JSON.stringify(data),
          headers: headers,
          redirect: "follow"
        })
          .then(function(response) {
            return response;
          })
          .then(data => {
            window.location.pathname = "/blogger/home";
          });
      };
    }
  }
});
