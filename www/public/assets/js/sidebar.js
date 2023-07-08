const topbar = document.querySelector('.topbar');
const content = document.querySelector('.content-wrapper');
const sidebar = document.querySelector('.sidebar-wrapper');
const sidebar_toggle = document.querySelector('.sidebar-toggle');

function toggle(){
    const sb = sessionStorage.getItem('sidebar');
    if(typeof sb === "string"){
        sessionStorage.setItem('sidebar', !JSON.parse(sb));
    }
    sidebar.classList.toggle('show');

    if(sidebar.classList.contains('show')){
        content.style.marginLeft = "var(--sidebar-size)";
    } else {
        content.style.marginLeft = "0";
    }
}

/*
    I gotta rewrite this messy code, but for now it 'works'
 */

function set_off(){
    if (sidebar.classList.contains('show')) {
        sidebar.classList.toggle('show');
        content.style.marginLeft = "0";
    }
}

function set_on(){
    if (!sidebar.classList.contains('show')) {
        sidebar.classList.toggle('show');
        content.style.marginLeft = "var(--sidebar-size)";
    }
}

const sidebar_on = sessionStorage.getItem('sidebar');

if(!sidebar_on){
    sessionStorage.setItem('sidebar', false);
    /* If the window is a big screen, we can show the sidebar */
    if (window.innerWidth < 600) {
        set_on();
        sessionStorage.setItem('sidebar', true);
    } else {
        sessionStorage.setItem('sidebar', false);
    }
} else {
    console.log('Sidebar exists');
    let sb = JSON.parse(sidebar_on);
    sb ? set_on() : set_off();
}

sidebar_toggle.addEventListener('click', toggle);
