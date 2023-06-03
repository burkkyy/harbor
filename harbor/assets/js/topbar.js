const topbar_path = document.querySelector('.topbar-path')
const _sub = " <p style='display: inline;'>></p> "
const _path = location.pathname.split(".html")[0].split("pages/")[1].split("/")

_str = "<a href='../index.html'>Home</a>"

_path.forEach(i => { _str += _sub + "<span>" + i + "</span>"; })
topbar_path.innerHTML = _str;
