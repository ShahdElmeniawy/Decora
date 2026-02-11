document.addEventListener("scroll", function () {
  const image = document.querySelector(".hero-image");
  const overlay = document.querySelector(".overlay-text");
  const scrollY = window.scrollY;

  if (scrollY > 50) {
    image.style.transform = "translateY(-100px)";
    image.style.opacity = "0";
    overlay.style.transform = "translate(-50%, calc(-50% - 100px))";
    overlay.style.opacity = "0";
  } else {

    image.style.transform = "translateY(0)";
    image.style.opacity = "1";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.opacity = "1";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("input, textarea").forEach(field => {
      if (!field.checkValidity()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (valid) {
      alert("Message sent successfully!");
      form.reset();
    }
  });
});