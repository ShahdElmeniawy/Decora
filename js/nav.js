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
