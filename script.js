const form = document.querySelector(".form");
let author = document.querySelector(".author");
let product = document.querySelector(".product");
const confirmBtn = document.querySelector(".button");
let fileInput = document.querySelector(".files");
let wrapperDiv = document.querySelector(".wrapper");

let popupBg = document.querySelector(".popup__bg");
let popup = document.querySelector(".popup");
let openPopupButtons = document.querySelectorAll(".open-popup");
let closePopupButton = document.querySelector(".close-popup");

let popUpAuthor = document.querySelector(".pop-up-author");
let popUpProduct = document.querySelector(".pop-up-product");
let popUpFileInput = document.querySelector(".pop-up-file");

let currentBookID;
let bookWrapper = document.createElement("div");

async function loadBook(a = 0) {
  let response = await fetch(
    `https://nordic-books-api.herokuapp.com/books?page=${a}`
  );
  let books = await response.json();
  console.log(books);

  if (!document.querySelector(".pageNav")) {
    let pageBlock = document.createElement("nav");
    pageBlock.classList.add("pageNav");
    let pageList = document.createElement("ul");
    pageList.classList.add("pagination");

    pageBlock.append(pageList);

    for (let i = 0; i < books.totalPages; i++) {
      let pageItem = document.createElement("li");
      pageItem.classList.add("page-item");

      let pageLink = document.createElement("a");
      pageLink.classList.add("page-link");
      pageLink.textContent = i + 1;

      pageItem.append(pageLink);
      pageList.append(pageItem);
    }

    wrapperDiv.append(pageBlock);
  }

  for (let i = 0; i < books.data.length; i++) {
    let wrapper = document.createElement("div");
    let lastName = document.createElement("div");
    let title = document.createElement("div");
    let deleteButton = document.createElement("button");
    let editButton = document.createElement("button");
    let img = document.createElement("img");
    let commentBtn = document.createElement("button");

    wrapper.style.marginTop = "35px";
    img.style.width = "100px";

    commentBtn.textContent = "Комментарии";
    deleteButton.textContent = "Удалить";
    editButton.textContent = "Редактировать";

    deleteButton.classList.add("delete", "btn", "btn-danger", "mb-2");
    editButton.classList.add("edit", "btn", "btn-primary", "mb-2", "mt-2");
    editButton.dataset.bsToggle = "modal";
    editButton.dataset.bsTarget = "#exampleModal";
    commentBtn.classList.add("comment", "btn", "btn-secondary");
    wrapper.classList.add("card", "mb-2");
    lastName.textContent = books.data[i].author + " ";
    title.textContent = books.data[i].title;
    img.src = books.data[i].imageUrl;

    wrapper.append(lastName);
    wrapper.append(title);
    if (books.data[i].imageUrl) {
      wrapper.append(img);
    }
    wrapper.dataset.id = books.data[i]._id;
    wrapper.append(editButton);
    wrapper.append(deleteButton);
    wrapper.append(commentBtn);
    bookWrapper.append(wrapper);
    wrapperDiv.append(bookWrapper);
  }
}

loadBook();

const addBook = () => {
  let formData = new FormData();
  formData.append("author", author.value);
  formData.append("title", product.value);
  formData.append("cover", fileInput.files[0]);
  fetch("https://nordic-books-api.herokuapp.com/books", {
    method: "POST",
    headers: { "user-id": "Plushka" },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
};

document.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("delete")) {
    console.log(e.target);
    let wrap = e.target.closest("div");
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addBook();
});

document.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn-submit")) {
    console.log(e);
    let formData = new FormData();
    let wrap = e.target.closest("div");
    formData.append("author", popUpAuthor.value);
    formData.append("title", popUpProduct.value);
    formData.append("cover", popUpFileInput.files[0]);
    if (popUpAuthor.value || popUpProduct.value === "") {
      alert("Заполните поля");
      return;
    }
    fetch(`https://nordic-books-api.herokuapp.com/books/${currentBookID}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        location.reload();
      });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("comment")) {
    let formComment = document.createElement("form");
    let nickNameInput = document.createElement("input");
    let commentInput = document.createElement("input");
    let formCommentBtn = document.createElement("button");

    let wrap = e.target.closest("div");

    formCommentBtn.textContent = "Добавить комментарий";

    formComment.classList.add("form-comment");
    nickNameInput.classList.add("nick-input");
    commentInput.classList.add("comment-input");
    formCommentBtn.classList.add("form-comment-btn");

    formComment.append(nickNameInput);
    formComment.append(commentInput);
    formComment.append(formCommentBtn);

    wrap.append(formComment);

    fetch(
      `https://nordic-books-api.herokuapp.com/books/${wrap.dataset.id}/comments`
    )
      .then((response) => response.json())
      .then((resp) => {
        console.log(resp.data);
        for (let i = 0; i < resp.data.length; i++) {
          let nameBlock = document.createElement("span");
          let commentBlock = document.createElement("span");
          nameBlock.textContent = resp.data[i].name;
          commentBlock.textContent = resp.data[i].text;

          nameBlock.style.marginRight = "10px";
          wrap.append(nameBlock);
          wrap.append(commentBlock);
        }
      });
  }
});

document.addEventListener("click", (e) => {
  console.log(e.target);
  e.preventDefault();
  if (e.target.classList.contains("form-comment-btn")) {
    console.log(e);
    let wrap = e.target.closest("div");

    const name = document.querySelector(".nick-input").value;
    const text = document.querySelector(".comment-input").value;

    fetch(
      `https://nordic-books-api.herokuapp.com/books/${wrap.dataset.id}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          text,
        }),
      }
    );
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit"))
    currentBookID = e.target.closest("div").dataset.id;
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-link")) {
    let pageLink = document.querySelectorAll(".page-item");
    for (let i = 0; i < pageLink.length; i++) {
      pageLink[i].classList.remove("active");
    }
    bookWrapper.innerHTML = "";
    e.target.parentElement.classList.add("active");
    let pageNumber = e.target.textContent - 1;
    console.log(pageNumber);
    loadBook(pageNumber);
  }
});
