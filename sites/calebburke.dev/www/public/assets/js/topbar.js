const topbar_path = document.querySelector('.topbar-path')
const arrow = " <p style='display: inline;'>></p> "
const pathname = location.pathname.split(".html")[0].split("/")

let path = "/";
let _str = "<a style='padding-left: 2rem;' class='topbar-link' href='/'>Home</a>"

pathname.forEach(i => {
    if (i) {
        path += i + "/";
        _str += arrow + `<a class='topbar-link' href='${path}'>${decodeURIComponent(i)}</a>`;
    }
})

topbar_path.innerHTML = _str;
