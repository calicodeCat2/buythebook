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
    // Populate hidden form on submit
    var content = document.querySelector("input[name=blog_content]");
    content.value = JSON.stringify(quill.getContents());
    var blog_title = document.querySelector("input[name=blog_title]");
    let data = {};
    data.blog_title = blog_title;
    data.content = content;
    fetch("/blogger/new", {
      method: "post",
      body: JSON.stringify(data)
    }).then(function(response))
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

    console.log(content.value);

    // No back end to actually submit to!
    alert("Open the console to see the ssubmit data!");
    return false;
  };
});
