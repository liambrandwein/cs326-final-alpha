document.getElementById("logout").onclick = async function () {
    alert("You have been logged out");
    const deleteAllCookies = () => {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
    deleteAllCookies();
    const response = await fetch('/logout');
}


document.getElementById('search-form').addEventListener('submit', function (e) {
    document.getElementById("search").click();
    e.preventDefault();
}, false);



document.getElementById("search").onclick = function () {
    const need_reload = location.href.includes("results");
    const query = document.getElementById("search-input").value;
    location.href = `./results#${query}`;
    if (need_reload) {
        // if the current page is the results page, reload the page
        location.reload();
    }
}