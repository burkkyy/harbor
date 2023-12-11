/*
    Navbar background

    Sets the navbar background the white once its past the home section
*/
window.addEventListener('scroll', () => {
    var navbar = document.getElementById('navbar-main');
    var scrolled = window.scrollY + navbar.offsetHeight;

    if (scrolled > window.innerHeight) {
        navbar.style.backgroundColor = 'white';
    } else {
        navbar.style.backgroundColor = 'transparent';
    }
});

/*
    Background image fade effect
*/
document.addEventListener("DOMContentLoaded", () => {
    var image = document.getElementById("section-home-image");

    window.addEventListener("scroll", function () {
        image.style.opacity = 1 - window.scrollY / 700;
    });
});
