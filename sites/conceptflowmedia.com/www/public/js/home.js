/*
    Image optimizer for mobile

    Don't load in clouds on mobile.
*/
window.addEventListener('DOMContentLoaded', () => {
    const clouds = '<img id="section-home-cloud1" alt="cloud 1" src="images/clouds/cloud1.png">\
    <img id="section-home-cloud2" alt="cloud 2" src="images/clouds/cloud2.png">\
    <img id="section-home-cloud3" alt="cloud 3" src="images/clouds/cloud2.png">';

    if(window.innerWidth > 1000){
        document.getElementById('section-home-clouds').innerHTML = clouds;
    }
});

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
