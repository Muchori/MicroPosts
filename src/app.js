import { http } from "./http";
import { ui } from "./ui";

/**
 * Get post on DOM load
 */
document.addEventListener("DOMContentLoaded", getPosts);

/**
 * Listen for Add Post
 */
document.querySelector(".post-submit").addEventListener("click", submitPost);
/**
 * Listen for Delete Post
 */
document.querySelector("#posts").addEventListener("click", deletePost);
/**
 * Listen for Edit state
 */
document.querySelector("#posts").addEventListener("click", enableEdit);
/**
 * Listen for cancel state
 */
document.querySelector(".card-form").addEventListener("click", cancelEdit);

/**
 * Get Posts
 */
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then((data) => ui.showPosts(data))
    .catch((err) => console.log(err));
}

/**
 * Submit Post
 */
function submitPost() {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const id = document.querySelector("#id").value;

  const data = {
    title,
    body,
  };

  if (title === "" || body === "") {
    ui.showAlert("Please fill all fields", "alert alert-danger");
  } else {
    /**
     * validate input
     */
    if (id === "") {
      /**
       * create post
       */
      http
        .post("http://localhost:3000/posts", data)
        .then((data) => {
          ui.showAlert("Post Added", "alert alert-success");
          ui.clearInputs();
          getPosts();
        })
        .catch((err) => console.log(err));
    } else {
      /**
       * Update Post
       */
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then((data) => {
          ui.showAlert("Post Updated", "alert alert-success");
          ui.changeFormState("add");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

/**
 * Delete Post
 */
function deletePost(e) {
  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.dataset.id;
    if (confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then((data) => {
          ui.showAlert("Post Removed", "alert alert-success");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
  e.preventDefault();
}
/**
 * Enable edit state
 */

function enableEdit(e) {
  if (e.target.parentElement.classList.contains("edit")) {
    const id = e.target.parentElement.dataset.id;
    const title = e.target.parentElement.previousElementSibling.textContent;
    const body =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;

    const data = {
      id,
      title,
      body,
    };

    /**
     * Fill form with current post
     */
    ui.fillForm(data);
  }
  e.preventDefault();
}

/**
 * Cancel Edit state
 */
function cancelEdit(e) {
  if (e.target.classList.contains("post-cancel")) {
    ui.changeFormState("add");
  }
  e.preventDefault();
}
