let products = [];

fetch("dp.json")
  .then(response => response.json())
  .then(data => {
    products = data.products; 
    displayProducts(products); 
  })
  .catch(error => console.error("Error loading JSON:", error));

const productsContainer = document.getElementById("productsContainer");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const filterBtn = document.getElementById("filterBtn");
let cartCount = 0; 

function displayProducts(list) {
  productsContainer.innerHTML = ""; 
  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    const stars = generateStars(product.rating);

    card.innerHTML = `
      <div class="card h-100 text-center">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <div class="rating">${stars}</div>
          <p class="card-text"> ${product.price} EGP </p>
          <small class="text-muted">${product.category}</small><br>
          <button class="btn btn-cart mt-2 add-to-cart">Add to Cart <i class="fa-solid fa-cart-shopping"></i></button>
        </div>
      </div>
    `;
    productsContainer.appendChild(card);
  });

  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      cartCount++;
      cartCounter.textContent = cartCount;
    });
  });
}

function generateStars(rating) {
  const fullStar = '<i class="bi bi-star-fill text-warning"></i>';
  const halfStar = '<i class="bi bi-star-half text-warning"></i>';
  const emptyStar = '<i class="bi bi-star text-warning"></i>';

  let starsHTML = "";
  let fullCount = Math.floor(rating); 
  let hasHalf = rating % 1 !== 0;     

  for (let i = 0; i < fullCount; i++) starsHTML += fullStar;
  if (hasHalf) starsHTML += halfStar;
  let emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyCount; i++) starsHTML += emptyStar;

  return starsHTML;
}

function setupFilter(priceRangeId, priceValueId, filterBtnId, checkboxesSelector) {
  const priceRangeEl = document.getElementById(priceRangeId);
  const priceValueEl = document.getElementById(priceValueId);
  const filterBtnEl = document.getElementById(filterBtnId);

  priceRangeEl.addEventListener("input", function () {
    priceValueEl.textContent = this.value;
  });

  filterBtnEl.addEventListener("click", function () {
    const selectedPrice = parseInt(priceRangeEl.value);
    const selectedCategories = Array.from(document.querySelectorAll(checkboxesSelector))
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const filtered = products.filter(p => {
      const priceMatch = parseInt(p.price) <= selectedPrice;
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      return priceMatch && categoryMatch;
    });

    displayProducts(filtered);
  });
}


setupFilter("priceRange", "priceValue", "filterBtn", ".form-check-input");


setupFilter("priceRangeMobile", "priceValueMobile", "filterBtnMobile", ".form-check-input-mobile");


const filterOverlay = document.getElementById("filterOverlay");
const filterToggle = document.getElementById("filterToggle");
const closeFilter = document.getElementById("closeFilter");

filterToggle.addEventListener("click", () => {
  filterOverlay.classList.add("active");
});

closeFilter.addEventListener("click", () => {
  filterOverlay.classList.remove("active");
});




