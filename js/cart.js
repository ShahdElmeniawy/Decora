let cartItemsContainer = document.getElementById("cartItems");

const CART_TAX_RATE = 0.10;
let discountRate = 0;

function money(n) {
  return Number(n).toFixed(2) + " EGP";
}

function getLoggedEmail() {
  let raw = localStorage.getItem("loggedUser");
  if (!raw) return null;
  try {
    let obj = JSON.parse(raw);
    return obj.email || null;
  } catch {
    return null;
  }
}

/* ===== coupon storage ===== */
function getCouponFromStorage() {
  let c = localStorage.getItem("decoraCoupon");
  return c ? JSON.parse(c) : null;
}
function setCouponToStorage(code, rate) {
  localStorage.setItem("decoraCoupon", JSON.stringify({ code, rate }));
}
function clearCoupon() {
  localStorage.removeItem("decoraCoupon");
}


function getData() {
  const email = getLoggedEmail();

  if (!email) {
    window.location.href = "logIn.html";
    return;
  }

  let req = new XMLHttpRequest();
  req.open("GET", `http://localhost:3000/users?email=${encodeURIComponent(email)}`);
  req.send();

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        let users = JSON.parse(req.responseText);

        if (!users.length) {
          showEmpty();
          return;
        }

        let user = users[0];
        getProducts(user);
      }
    }
  });
}

function getProducts(user) {
  let req = new XMLHttpRequest();
  req.open("GET", "http://localhost:3000/products");
  req.send();

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        let products = JSON.parse(req.responseText);
        display(user, products);
      }
    }
  });
}

/* ===== display ===== */
function display(user, products) {
  let cartIds = Array.isArray(user.cart) ? user.cart.map(String) : [];

  document.getElementById("cartTitle").textContent =
    `Your Cart (${cartIds.length} items)`;

  if (cartIds.length === 0) {
    showEmpty();
    updateSummary([]);
    return;
  }

  let qtyMap = {};
  for (let id of cartIds) {
    qtyMap[id] = (qtyMap[id] || 0) + 1;
  }

  let items = [];
  for (let id in qtyMap) {
    let p = products.find(x => String(x.id) === String(id));
    if (p) {
      items.push({
        id: String(p.id),
        name: p.name,
        price: Number(p.price),
        image: p.image,
        category: p.category,
        qty: qtyMap[id]
      });
    }
  }

  let container = "";
  for (let item of items) {
    let lineTotal = item.price * item.qty;

    container += `
      <div class="cart-row" data-id="${item.id}">
        <div class="item-col">
          <img class="item-img" src="${item.image}" alt="${item.name}">
          <div>
            <p class="item-name">${item.name}</p>
            <p class="item-meta">${item.category || ""}</p>
          </div>
        </div>

        <div class="money hide-sm">${money(item.price)}</div>

        <div class="qty">
          <button class="qty-btn" data-action="dec">−</button>
          <div class="qty-num">${item.qty}</div>
          <button class="qty-btn" data-action="inc">+</button>
        </div>

        <div class="end-col">
          <div class="money">${money(lineTotal)}</div>
          <button class="remove-btn" data-action="remove" title="Remove">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    `;
  }

  cartItemsContainer.innerHTML = container;
  document.getElementById("emptyState").style.display = "none";

  updateSummary(items);

  let rows = document.querySelectorAll(".cart-row");
  for (let row of rows) {
    row.addEventListener("click", function (e) {
      let btn = e.target.closest("[data-action]");
      if (!btn) return;

      let action = btn.getAttribute("data-action");
      let productId = row.getAttribute("data-id");

      if (action === "inc") {
        updateCart(user, productId, +1);
      } else if (action === "dec") {
        updateCart(user, productId, -1);
      } else if (action === "remove") {
        deleteFromCart(user, productId);
      }
    });
  }
}

function updateCart(user, productId, delta) {
  let cart = Array.isArray(user.cart) ? user.cart.map(String) : [];
  let pid = String(productId);

  if (delta > 0) {
    cart.push(pid);
  } else {
    let idx = cart.findIndex(x => String(x) === pid);
    if (idx !== -1) cart.splice(idx, 1);
  }

  let req = new XMLHttpRequest();
  req.open("PATCH", `http://localhost:3000/users/${user.id}`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({ cart: cart }));

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        getData();
      }
    }
  });
}


function deleteFromCart(user, productId) {
  let pid = String(productId);
  let cart = (user.cart || []).map(String).filter(x => x !== pid);

  let req = new XMLHttpRequest();
  req.open("PATCH", `http://localhost:3000/users/${user.id}`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({ cart: cart }));

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        getData();
      }
    }
  });
}

function updateSummary(items) {
  let subtotal = 0;
  for (let it of items) subtotal += (it.price * it.qty);

  const discount = subtotal * (discountRate || 0);
  const afterDiscount = subtotal - discount;

  let tax = afterDiscount * CART_TAX_RATE;
  let grand = afterDiscount + tax;

  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("tax").textContent = money(tax);
  document.getElementById("grand").textContent = money(grand);
}

function showEmpty() {
  cartItemsContainer.innerHTML = "";
  document.getElementById("emptyState").style.display = "block";
  document.getElementById("subtotal").textContent = money(0);
  document.getElementById("tax").textContent = money(0);
  document.getElementById("grand").textContent = money(0);
}


const toggleCouponBtn = document.getElementById("toggleCoupon");
const couponBox = document.getElementById("couponBox");
const couponInput = document.getElementById("couponInput");
const applyCouponBtn = document.getElementById("applyCoupon");
const couponMsg = document.getElementById("couponMsg");

if (toggleCouponBtn) {
  toggleCouponBtn.addEventListener("click", function () {
    couponBox.style.display = (couponBox.style.display === "none") ? "block" : "none";
  });
}

if (applyCouponBtn) {
  applyCouponBtn.addEventListener("click", function () {
    const code = (couponInput.value || "").trim().toUpperCase();

    if (code === "DECORA10") {
      discountRate = 0.10;
      setCouponToStorage(code, discountRate);
      couponMsg.textContent = "Coupon applied: 10% OFF ";
      couponMsg.style.color = "#c8b27a";
      getData();
    } else if (code === "DECORA20") {
      discountRate = 0.20;
      setCouponToStorage(code, discountRate);
      couponMsg.textContent = "Coupon applied: 20% OFF ";
      couponMsg.style.color = "#c8b27a";
      getData();
    } else {
      discountRate = 0;
      clearCoupon();
      couponMsg.textContent = "Invalid coupon ";
      couponMsg.style.color = "#ffb4a8";
      getData();
    }
  });


  const saved = getCouponFromStorage();
  if (saved) {
    discountRate = saved.rate || 0;
    couponInput.value = saved.code || "";
    couponMsg.textContent = `Coupon applied: ${Math.round(discountRate * 100)}% OFF ✅`;
    couponMsg.style.color = "#c8b27a";
  }
}

getData();


function detectCardType(number) {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  return null;
}

function validateCardNumber(number) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

const cardName = document.getElementById("cardName")
const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");
const form = document.getElementById("paymentForm");

cardNumber.addEventListener("input", function () {
  const value = this.value.replace(/\s+/g, '');

  document.querySelectorAll(".card-icons img").forEach(img => img.classList.remove("active"));
  const type = detectCardType(value);
  if (type) document.getElementById(type).classList.add("active");
});

let validtion = true;

expiry.addEventListener("input", function () {
  let currentMonthIndex = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  currentMonthIndex += 1;
  currentYear -= 2000;
  let value = this.value.replace(/\D/g, '');

  if (value.length >= 1) {
    let month = value.substring(0, 2);

    if (month.length === 2) {
      if (parseInt(month) > 12) month = "12";
      if (parseInt(month) === 0) month = "01";
    }
    value = month + value.substring(2, 4);
  }
  console.log(currentYear);

  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
    expiry.classList.remove("is-invalid");
    validtion = false;
  }
  if (value.substring(3, 5) < currentYear || (value.substring(3, 5) == currentYear && value.substring(0, 2) < currentMonthIndex)) {
    expiry.classList.add("is-invalid");
    validtion = true;
  }
  this.value = value;
});


form.addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;

  const number = cardNumber.value.replace(/\s+/g, '');

  const trimmedName = cardName.value.trim();

  if (trimmedName === '' || !/^[A-Za-z]+(?:[-\s'’.][A-Za-z]+)*$/.test(trimmedName)) {
    cardName.classList.add("is-invalid");
    valid = false;
  } else {
    cardName.classList.remove("is-invalid");
  }

  if (!validateCardNumber(number) || number === '') {
    cardNumber.classList.add("is-invalid");
    valid = false;
  } else {
    cardNumber.classList.remove("is-invalid");
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value) || validtion) {
    expiry.classList.add("is-invalid");
    valid = false;
  } else {
    expiry.classList.remove("is-invalid");
  }

  if (!/^\d{3,4}$/.test(cvv.value)) {
    cvv.classList.add("is-invalid");
    valid = false;
  } else {
    cvv.classList.remove("is-invalid");
  }

  if (valid) {
    const modalElement = document.getElementById('paymentModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    const toastE1 = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastE1);
    toast.show();
    fixData();
  }

});

function fixData() {
  const reqget = new XMLHttpRequest;
  reqget.open('GET', `http://localhost:3000/users?email=${curUser.email}`);
  reqget.send();
  reqget.addEventListener("readystatechange", function () {
    if (reqget.readyState === 4) {
      if (reqget.status == 200) {
        let myUserData = JSON.parse(reqget.response);
        myUserData[0].cart = [];
        myUserData[0].orders.at(-1).status = "paid";
        const regPut = new XMLHttpRequest;
        regPut.open('PUT', `http://localhost:3000/users/${myUserData[0].id}`);
        regPut.setRequestHeader("Content-Type", "application/json");
        regPut.send(JSON.stringify(myUserData[0]));
      }
    }
  })
}
