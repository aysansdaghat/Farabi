
/* =====================================
   ABOUT PAGE SLIDER
===================================== */

const track = document.getElementById('aboutSlider');
const dotsContainer = document.getElementById('aboutDots');

const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentSlide = 0;
let autoSlide = null;

const slides = track
    ? Array.from(track.querySelectorAll('.slide'))
    : [];

const totalSlides = slides.length;


/* GO TO SLIDE */
function goToSlide(index) {

    if (!track || totalSlides === 0) return;

    currentSlide = (index + totalSlides) % totalSlides;

    track.style.transform =
        `translateX(${currentSlide * (100 / totalSlides)}%)`;

    if (dotsContainer) {
        dotsContainer.querySelectorAll('button').forEach((btn, i) => {
            btn.classList.toggle('active', i === currentSlide);
        });
    }
}


/* CREATE DOTS */
function createDots() {

    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    slides.forEach((slide, index) => {

        const button = document.createElement('button');

        button.setAttribute('aria-label', `اسلاید ${index + 1}`);

        button.addEventListener('click', () => {
            goToSlide(index);
            restartAutoSlide();
        });

        dotsContainer.appendChild(button);

    });
}


/* AUTO SLIDE */
function startAutoSlide() {

    if (totalSlides <= 1) return;

    clearInterval(autoSlide);

    autoSlide = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);

}


function stopAutoSlide() {
    clearInterval(autoSlide);
}


function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}


/* INITIALIZE */
function initSlider() {

    if (!track || totalSlides === 0) return;

    createDots();

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            restartAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            restartAutoSlide();
        });
    }

    const slider = track.closest('.about-slider');

    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    goToSlide(0);
    startAutoSlide();

}


/* RUN */
initSlider();
