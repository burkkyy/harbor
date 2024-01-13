/*
    Image optimizer for mobile

    Don't load in clouds on mobile.
*/
function create_image(id, alt, src) {
    const img = document.createElement('img');
    img.id = id;
    img.alt = alt;
    img.src = src;
    return img;
}

window.addEventListener('DOMContentLoaded', () => {
    /*
    if(window.innerWidth > 768){
        const container = document.getElementById('section-home-clouds');
        container.appendChild(create_image("section-home-cloud2", "cloud 2", "images/clouds/cloud2.png"));
        container.appendChild(create_image("section-home-cloud3", "cloud 3", "images/clouds/cloud2.png"));
    }
    */
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
