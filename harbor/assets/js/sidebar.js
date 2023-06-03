const topbar = document.querySelector('.topbar');
const content = document.querySelector('.content-wrapper');
const sidebar = document.querySelector('.sidebar-wrapper');
const sidebar_toggle = document.querySelector('.sidebar-toggle');

function toggle(){
    sidebar.classList.toggle('show');
    
    if(sidebar.classList.contains('show')){
        content.style.marginLeft = "var(--sidebar-size)";
        topbar.style.marginLeft = "var(--sidebar-size)";
    } else {
        content.style.marginLeft = "0";
        topbar.style.marginLeft = "0";
    }
}

/* If the window is a big screen, we can show the sidebar */
if (window.innerWidth > 600){
    toggle();
}

sidebar_toggle.addEventListener('click', toggle);
