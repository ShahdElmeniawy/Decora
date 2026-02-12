const nav = document.getElementById("decoraNav");

function onScroll() {
  const scrolled = window.scrollY > 60;
  nav.classList.toggle("scrolled", scrolled);
  nav.classList.toggle("transparent", !scrolled);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const overlay = document.getElementById("menuOverlay");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");

function openMenu() {
  overlay.classList.add("show");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  overlay.classList.remove("show");
  document.body.classList.remove("menu-open");
}

openBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeMenu();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

let logElement = document.getElementById("logBtn");
let logOutBtn = document.getElementById("logOutBtn")
let cartCounter = document.getElementById("cartCounter");
const curUser = JSON.parse(localStorage.getItem("loggedUser"));
if (curUser) {
  searchData(curUser.email);
  logOutBtn.style.display = "block";
}
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  logElement.innerHTML = "logIn"
  logOutBtn.style.display = "none";
  cartCounter.innerHTML = 0;

})

function searchData(email) {
  let req = new XMLHttpRequest();
  req.open("GET", `http://localhost:3000/users?email=${email}`);
  req.send();

  req.addEventListener("readystatechange", function () {
    if (req.readyState === 4) {
      if (req.status == 200) {
        let myData = JSON.parse(req.response);
        logElement.innerHTML = myData[0].fristName + " " + myData[0].lastName;
        cartCounter.innerHTML = myData[0].cart.length;
      }
    }
  });
}