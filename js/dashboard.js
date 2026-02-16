let PRODUCTS = [];
let USERS = [];
let PRODUCTS_MAP = {};

let statProducts = document.getElementById("statProducts");
let statUsers = document.getElementById("statUsers");
let statPaidItems = document.getElementById("statPaidItems");
let statRevenue = document.getElementById("statRevenue");
let productsBody = document.getElementById("productsBody");
let usersBody = document.getElementById("usersBody");

let productSearch = document.getElementById("productSearch");
let userSearch = document.getElementById("userSearch");

let tabs = document.querySelectorAll(".tab");
let panelProducts = document.getElementById("panel-products");
let panelUsers = document.getElementById("panel-users");


function checkAdmin() {
  let curUser = null;

  try {
    curUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  } catch (e) {
    curUser = null;
  }

  if (!curUser || curUser.email !== "decora@gmail.com") {
    window.location.href = "logIn.html";
    return false;
  }

  return true;
}

if (!checkAdmin()) {

}


function asNum(x) {
  let v = Number(x);
  return Number.isFinite(v) ? v : 0;
}

function moneyEGP(n) {
  return "EGP " + asNum(n).toFixed(2);
}

function safeLower(s) {
  return String(s || "").toLowerCase();
}

function normalizeStatus(st) {
  let s = safeLower(st);
  if (s === "paid") return "paid";
  if (s === "cancelled") return "cancelled";
  return "pending";
}

function escapeQuotes(text) {
  
  return String(text || "").split('"').join("&quot;");
}


for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function () {
    for (let j = 0; j < tabs.length; j++) tabs[j].classList.remove("active");
    this.classList.add("active");

    let t = this.getAttribute("data-tab");
    if (t === "products") {
      panelProducts.style.display = "";
      panelUsers.style.display = "none";
    } else {
      panelProducts.style.display = "none";
      panelUsers.style.display = "";
    }
  });
}


function getRequest(url, callback) {
  let req = new XMLHttpRequest();
  req.open("GET", url);
  req.send();

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        let data = JSON.parse(req.responseText);
        callback(null, data);
      } else {
        callback(new Error("GET failed: " + url), null);
      }
    }
  });
}



function getData() {
  getRequest("http://localhost:3000/products", function (err, products) {
    if (err) return console.log(err);

    PRODUCTS = products || [];
    PRODUCTS_MAP = {};

    for (let item of PRODUCTS) {
      PRODUCTS_MAP[String(item.id)] = item;
    }

    getRequest("http://localhost:3000/users", function (err2, users) {
      if (err2) return console.log(err2);

      USERS = users || [];
      display(); 
    });
  });
}


function computePaidStats(users) {
  let paidItemsCount = 0;
  let revenue = 0;

  for (let u of (users || [])) {
    let orders = Array.isArray(u.orders) ? u.orders : [];

    for (let ord of orders) {
      ord = ord || {};
      let st = normalizeStatus(ord.status);
      if (st !== "paid") continue;

      let items = Array.isArray(ord.items) ? ord.items : [];
      for (let it of items) {
        it = it || {};
        paidItemsCount += asNum(it.qty || 0);
      }

      if (ord.grandTotal != null) {
        revenue += asNum(ord.grandTotal);
      } else {
        for (let it of items) {
          it = it || {};
          let pid = String(it.productId || "");
          let p = PRODUCTS_MAP[pid];

          let unit = (it.unitPrice != null) ? asNum(it.unitPrice) : (p ? asNum(p.price) : 0);
          revenue += unit * asNum(it.qty || 0);
        }
      }
    }
  }

  return { paidItemsCount: paidItemsCount, revenue: revenue };
}


function display() {
  statProducts.textContent = String(PRODUCTS.length);
  statUsers.textContent = String(USERS.length);

  let paidInfo = computePaidStats(USERS);
  statPaidItems.textContent = String(paidInfo.paidItemsCount);
  statRevenue.textContent = moneyEGP(paidInfo.revenue);

  displayProducts(PRODUCTS);
  displayUsers(USERS);
}


function displayProducts(list) {
  let q = safeLower(productSearch.value).trim();
  let filtered = [];

  if (q) {
    for (let p of list) {
      if (
        safeLower(p.name).includes(q) ||
        safeLower(p.category).includes(q) ||
        safeLower(p.id).includes(q)
      ) {
        filtered.push(p);
      }
    }
  } else {
    filtered = list.slice();
  }

  let html = "";

  for (let p of filtered) {
    let stock = (p.onStock == null) ? "-" : String(p.onStock);
    let desc = String(p.description || "");
    let short = desc.length > 90 ? desc.slice(0, 90) + "…" : desc;

    html += `
      <tr>
        <td>
          <div class="prod">
           <img src="${p.image}" alt="${p.name}" class="prod-img">
            <div>
              <div class="name">${p.name || "-"}</div>
              <div class="id">#${p.id}</div>
            </div>
          </div>
        </td>
        <td>${p.category || "-"}</td>
        <td class="num">${moneyEGP(p.price)}</td>
        <td class="num">${stock}</td>
        <td class="num">${p.rating != null ? p.rating : "-"}</td>
        <td title="${escapeQuotes(desc)}">${short}</td>
      </tr>
    `;
  }

  productsBody.innerHTML = html || `
    <tr><td colspan="6" style="padding:18px;color:rgba(233,225,211,.65)">No products found.</td></tr>
  `;
  
}


function aggregateUserPaid(u) {
  let paidOrders = 0;
  let totalPaid = 0;

  let orders = Array.isArray(u.orders) ? u.orders : [];

  for (let ord of orders) {
    ord = ord || {};
    let st = normalizeStatus(ord.status);
    if (st !== "paid") continue;

    paidOrders += 1;

    if (ord.grandTotal != null) {
      totalPaid += asNum(ord.grandTotal);
    } else {
      let items = Array.isArray(ord.items) ? ord.items : [];
      for (let it of items) {
        it = it || {};
        let line = (it.lineTotal != null) ? asNum(it.lineTotal) : (asNum(it.unitPrice) * asNum(it.qty));
        totalPaid += line;
      }
    }
  }

  return { paidOrders: paidOrders, totalPaid: totalPaid };
}

function displayUsers(users) {
  let q = safeLower(userSearch.value).trim();
  let filtered = [];

  if (q) {
    for (let u of users) {
      let fullName = ((u.fristName || "") + " " + (u.lastName || "")).trim();
      if (safeLower(fullName).includes(q) || safeLower(u.email).includes(q)) {
        filtered.push(u);
      }
    }
  } else {
    filtered = users.slice();
  }

  let html = "";

  for (let u of filtered) {
    let fullName = ((u.fristName || "") + " " + (u.lastName || "")).trim() || "User";
    let ordersCount = Array.isArray(u.orders) ? u.orders.length : 0;

    let paidAgg = aggregateUserPaid(u);

    html += `
      <tr>
        <td>${fullName}</td>
        <td>${u.email || "-"}</td>
        <td class="num">${ordersCount}</td>
        <td class="num">${paidAgg.paidOrders}</td>
        <td class="num">${moneyEGP(paidAgg.totalPaid)}</td>
        <td>
          <button class="btn-mini" data-view-user="${u.id}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      </tr>
    `;
  }

  usersBody.innerHTML = html || `
    <tr><td colspan="6" style="padding:18px;color:rgba(233,225,211,.65)">No users found.</td></tr>
  `;

  let btns = usersBody.querySelectorAll("[data-view-user]");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      let uid = this.getAttribute("data-view-user");
      window.location.href = "orders.html?userId=" + encodeURIComponent(uid);
    });
  }
}

productSearch.addEventListener("input", function () {
  displayProducts(PRODUCTS);
});

userSearch.addEventListener("input", function () {
  displayUsers(USERS);
});

getData();
