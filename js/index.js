const slides = document.querySelectorAll('.slide');
const slideBtns = document.querySelectorAll('.slideBtn');
const activeBtns = document.querySelectorAll('.choose');
let currentIndex = 0;

function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    activeBtns[currentIndex].classList.remove('activeBtn');
    slideBtns[currentIndex].classList.remove('activeSlideBtn');
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    activeBtns[currentIndex].classList.add('activeBtn');
    slideBtns[currentIndex].classList.add('activeSlideBtn');
}

function showNextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
}

setInterval(showNextSlide, 6000);

slideBtns.forEach((btn, i) => {
    btn.addEventListener('click', function () {
        goToSlide(i);
    });
});


const cards = document.querySelectorAll('.cards');
const word = document.querySelectorAll('.cardWord');

cards.forEach((element, i) => {
    element.addEventListener("mouseover", function () {
        element.classList.add('activeCard')
        word[i].classList.add('roateWord')
    })
    element.addEventListener("mouseout", function () {
        element.classList.remove('activeCard')
        word[i].classList.remove('roateWord')

    })
});
