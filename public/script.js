document.addEventListener("DOMContentLoaded", function() {
  var quill = new Quill("#editor-container", {
    modules: {
      toolbar: [
        [{ header: "1" }],
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
  form.onsubmit = function(e) {
    e.preventDefault();
    console.log();
    // Populate hidden form on submit
    // var content = document.querySelector("input[name=blog_content]");
    let content = quill.root.innerHTML;
    var blog_title = document.querySelector("input[name=blog_title]").value;

    let data = {};
    data.blog_title = blog_title;
    data.content = content;

    console.log(data);
    var headers = new Headers();
    headers.append("Content-Type", "application/json"); // This one sends body
    fetch("/blogger/new", {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
      });
    // $.ajax({
    //   url: "/blogger/new",
    //   method: "post",
    //   data: {
    //     content: content,
    //     blog_title: blog_title
    //   },
    //   sucess: data => {
    //     console.log(method);
    //     alert("Form Submitted, Server Responded: " + data); //the server response
    //   },
    //   error: data => {
    //     alert("Error contacting server: " + data); //Error handler
    //   }
    // });

    // console.log(csontent.value);

    // No back end to actually submit to!
  };
});
