const topbar_path = document.querySelector('.topbar-path')
const _sub = " <p style='display: inline;'>></p> "
const _path = location.pathname.split(".html")[0].split("/")

_str = "<a href='home'>Home</a>"

_path.forEach(i => { if(i != 0){ _str += _sub + "<span>" + i + "</span>"; } })
topbar_path.innerHTML = _str;
