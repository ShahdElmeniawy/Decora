
if (!curUser || curUser.email != "decora@gmail.com") {
  window.location.href = "login.html";
}
function toggleForm() {
  const form = document.getElementById("boxinputitem");
  form.style.display = (form.style.display === "none") ? "block" : "none";
}

let currentCategory = "";
function chooseCategory(categoryName) {
  currentCategory = categoryName;
  document.getElementById("categoryBtn").textContent = categoryName;
}

document.getElementById("boxinputitem").addEventListener("submit", function(e) {
  e.preventDefault();

  document.querySelectorAll(".error-msg").forEach(el => el.remove());
  document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));

  let valid = true;

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const error = document.createElement("small");
    error.className = "error-msg text-danger";
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.classList.add("is-invalid"); 
    valid = false;
  }

  const id = document.getElementById("Numirc").value.trim();
  const name = document.getElementById("nameOfprodct").value.trim();
  const description = document.getElementById("descrip").value.trim();
  const price = document.getElementById("prise").value.trim();
  const image = document.getElementById("imaginput").value.trim();

  if (!id || isNaN(id)) showError("Numirc", "Enter the ID number");  
  if (!name) showError("nameOfprodct", "Name required");
  if (!description) showError("descrip","Add a description");
  if (!price || isNaN(price) || price <= 0) showError("prise", "Add a price");
  if (!image || !image.startsWith("http")) showError("imaginput", "Enter a valid image URL starting with http");

  if (!currentCategory) {
    const btn = document.getElementById("categoryBtn");
    const error = document.createElement("small");
    error.className = "error-msg text-danger";
    error.textContent = "Choose a category";
    btn.parentNode.appendChild(error); 
    valid = false;
  }

  ["Numirc", "nameOfprodct", "descrip", "prise", "imaginput", "categoryBtn"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("input", function() {
      const error = input.parentNode.querySelector(".error-msg");
      if (error) error.remove();         
      input.classList.remove("is-invalid");
    });
  });

  if (!valid) return;

  const product = { id, name, description, price, image, category: currentCategory };
  const btn = document.getElementById("btnAddItem");

  if (btn.dataset.mode === "edit") {
    const productId = btn.dataset.productId;
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/products/" + productId, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(product));
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/products", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(product));
  }

  xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    document.getElementById("successMsg").textContent = "Product saved successfully!";
  }
};


  e.target.reset();
  document.getElementById("categoryBtn").textContent = "Categories";
  currentCategory = "";
  btn.textContent = "Add Item";
  btn.dataset.mode = "add";
});



function hideForm() {
  document.getElementById("boxinputitem").style.display = "none";
}

function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:3000/products/" + productId, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var card = document.querySelector('[data-id="' + productId + '"]');
      if (card) {
        card.parentNode.removeChild(card);
      }
    }
  };
  xhr.send(null);
}

function openEditForm(product) {
  const form = document.getElementById("boxinputitem");
  form.style.display = "block";

  document.getElementById("Numirc").value = product.id;
  document.getElementById("nameOfprodct").value = product.name;
  document.getElementById("descrip").value = product.description;
  document.getElementById("prise").value = product.price;
  document.getElementById("imaginput").value = product.image;
  document.getElementById("categoryBtn").textContent = product.category;

  const btn = document.getElementById("btnAddItem");
  btn.textContent = "Edit";
  btn.dataset.mode = "edit";
  btn.dataset.productId = product.id;
}

function renderCards(products) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.setAttribute("data-id", prod.id);
    card.innerHTML = `
      <div class="cardmange h-100">
        <img src="${prod.image}" class="card-img-top  cardmangeImg" alt="${prod.name}" />
        <div class="cardmange-body">
          <h5 class="cardmange-title text-center">${prod.name}</h5><hr />
          <p class="cardmange-text">${prod.description}</p>
          <p class="cardmange-text"><strong>Price:</strong> ${prod.price} EGP </p>
          <button class="editBtn" type="button" onclick='openEditForm(${JSON.stringify(prod)})'>Edit</button>
          <button class="delBtn" type="button" onclick="deleteProduct(${prod.id})">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadCategory(categoryName) { 
  hideForm(); 
  var xhr = new XMLHttpRequest(); 
  xhr.open("GET", "http://localhost:3000/products?category=" + encodeURIComponent(categoryName), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) { 
      var data = JSON.parse(xhr.responseText); 
      renderCards(data); 
    } 
  }; 
  xhr.send(null); 
}

document.getElementById("btnTable").addEventListener("click", () => loadCategory("Table"));
document.getElementById("btnChair").addEventListener("click", () => loadCategory("Chair"));
document.getElementById("btnLivingroom").addEventListener("click", () => loadCategory("Living Room"));
document.getElementById("btnbedroom").addEventListener("click", () => loadCategory("Bedroom"));
