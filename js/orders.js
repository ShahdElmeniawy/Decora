let USER_ID = null;
let PRODUCTS_MAP = {};
let CURRENT_USER = null;
let pageTitle = document.getElementById("pageTitle");
let pageSub = document.getElementById("pageSub");
let ordersWrap = document.getElementById("ordersWrap");
let ordersSearch = document.getElementById("ordersSearch");


function checkAdmin() {
  let curUser = null;

  try {
    curUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  } catch (e) {
    curUser = null;
  }

  if (!curUser || curUser.email !== "decora@gmail.com") {
    window.location.href = "login.html";
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

function formatDate(iso) {
  if (!iso) return "-";
  try {
    let d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  } catch (e) {
    return "-";
  }
}

function getParam(name) {
  let u = new URL(window.location.href);
  return u.searchParams.get(name);
}

function escapeQuotes(text) {
  return String(text || "").split('"').join("&quot;");
}


function getRequest(url, callback) {
  let req = new XMLHttpRequest();
  req.open("GET", url);
  req.send();

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        callback(null, JSON.parse(req.responseText));
      } else {
        callback(new Error("GET failed: " + url), null);
      }
    }
  });
}


function getData() {
  USER_ID = getParam("userId");

  if (!USER_ID) {
    pageTitle.textContent = "Orders";
    pageSub.textContent = "Missing userId";
    ordersWrap.innerHTML = `<div style="opacity:.7;font-family:system-ui;padding:10px 2px">No userId in URL.</div>`;
    return;
  }

  getRequest("http://localhost:3000/products", function (err, products) {
    if (err) return console.log(err);

    PRODUCTS_MAP = {};
    for (let p of (products || [])) {
      PRODUCTS_MAP[String(p.id)] = p;
    }

    getRequest("http://localhost:3000/users/" + encodeURIComponent(USER_ID), function (err2, user) {
      if (err2) {
        console.log(err2);
        pageTitle.textContent = "Orders";
        pageSub.textContent = "User not found";
        renderOrders(null);
        return;
      }

      CURRENT_USER = user;

      let fullName = ((user.fristName || "") + " " + (user.lastName || "")).trim() || "User";
      pageTitle.textContent = fullName + " Orders";
      pageSub.textContent = (user.email || "-");

      renderOrders(user);
    });
  });
}


function renderOrders(user) {
  if (!user) {
    ordersWrap.innerHTML = `<div style="opacity:.7;font-family:system-ui;padding:10px 2px">No user data.</div>`;
    return;
  }

  let q = safeLower(ordersSearch.value).trim();
  let orders = Array.isArray(user.orders) ? user.orders : [];
  if (!orders.length) {
    ordersWrap.innerHTML = `
    <div class="empty-state">
        <div class="empty-icon">
            <i class="bi bi-receipt"></i>
        </div>
        <h2 class="empty-title">No orders yet</h2>
        <p class="empty-text">
            This user hasn’t placed any orders. Try searching another user or check back later.
        </p>
        <div class="empty-actions">
            <button class="btn-empty" id="goBackBtn">
                <i class="bi bi-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    </div>
    `;

    document.getElementById("goBackBtn").addEventListener("click", function () {
      window.location.href = "admin.html";
    });

    return;
  }


  let filteredOrders = [];

  for (let ord of orders) {
    ord = ord || {};
    let st = normalizeStatus(ord.status);
    let orderId = String(ord.id || "");

    if (!q) {
      filteredOrders.push(ord);
      continue;
    }

    let ok = false;
    if (safeLower(orderId).includes(q)) ok = true;
    if (safeLower(st).includes(q)) ok = true;

    let items = Array.isArray(ord.items) ? ord.items : [];
    for (let it of items) {
      if (ok) break;

      let pid = String(it.productId || "");
      let p = PRODUCTS_MAP[pid];
      let pname = p ? p.name : ("#" + pid);

      if (safeLower(pname).includes(q)) ok = true;
    }

    if (ok) filteredOrders.push(ord);
  }

  let html = "";

  for (let ord of filteredOrders) {
    ord = ord || {};

    let orderId = ord.id || "-";
    let date = formatDate(ord.createdAt);
    let st = normalizeStatus(ord.status);

    let pillClass = (st === "paid") ? "pill paid" : (st === "cancelled" ? "pill cancelled" : "pill unpaid");
    let pillText = (st === "paid") ? "PAID" : (st === "cancelled" ? "CANCELLED" : "UNPAID");

    let items = Array.isArray(ord.items) ? ord.items : [];
    let rows = "";

    for (let it of items) {
      it = it || {};

      let pid = String(it.productId || "");
      let p = PRODUCTS_MAP[pid];

      let pname = p ? p.name : ("#" + pid);
      let pcat = p ? (p.category || "-") : "-";
      let prating = p ? (p.rating != null ? p.rating : "-") : "-";
      let pimg = p ? (p.image || "") : "";
      let pdesc = p ? (p.description || "") : "";

      let qty = asNum(it.qty || 0);
      let unit = (it.unitPrice != null) ? asNum(it.unitPrice) : (p ? asNum(p.price) : 0);
      let line = (it.lineTotal != null) ? asNum(it.lineTotal) : (unit * qty);

      rows += `
        <tr>
          <td>
            <div class="prod">
              ${pimg ? `<img src="${pimg}" alt="${pname}">` : `<div style="width:44px;height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05)"></div>`}
              <div>
                <div class="name">${pname}</div>
                <div class="id">#${pid} • ${pcat} • Rating: ${prating}</div>
              </div>
            </div>
          </td>
          <td title="${escapeQuotes(pdesc)}">${pdesc ? (pdesc.length > 80 ? pdesc.slice(0, 80) + "…" : pdesc) : "-"}</td>
          <td class="num">${qty}</td>
          <td class="num">${moneyEGP(unit)}</td>
          <td class="num">${moneyEGP(line)}</td>
        </tr>
      `;
    }

    let subtotal = (ord.subtotal != null) ? asNum(ord.subtotal) : null;
    let tax = (ord.tax != null) ? asNum(ord.tax) : null;
    let grand = (ord.grandTotal != null) ? asNum(ord.grandTotal) : null;

    if (grand == null) {
      let sum = 0;
      for (let it of items) {
        it = it || {};
        let qty = asNum(it.qty || 0);
        let unit = asNum(it.unitPrice || 0);
        let line = (it.lineTotal != null) ? asNum(it.lineTotal) : (unit * qty);
        sum += line;
      }
      subtotal = (subtotal == null) ? sum : subtotal;
      grand = (grand == null) ? (subtotal + (tax || 0)) : grand;
    }

    html += `
      <section class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Order: ${orderId}</div>
            <div class="card-meta">${date}</div>
          </div>
          <span class="${pillClass}">${pillText}</span>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th class="num">Qty</th>
                <th class="num">Unit</th>
                <th class="num">Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5" style="opacity:.7;padding:14px 16px">No items.</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="summary">
          <span><b>Subtotal:</b> ${moneyEGP(subtotal || 0)}</span>
          <span><b>Tax:</b> ${moneyEGP(tax || 0)}</span>
          <span><b>Grand:</b> ${moneyEGP(grand || 0)}</span>
          <span><b>Currency:</b> ${(ord.currency || "EGP")}</span>
        </div>
      </section>
    `;
  }

  ordersWrap.innerHTML = html || `<div style="opacity:.7;font-family:system-ui;padding:10px 2px">No orders found.</div>`;
}


ordersSearch.addEventListener("input", function () {
  renderOrders(CURRENT_USER);
});

getData();
