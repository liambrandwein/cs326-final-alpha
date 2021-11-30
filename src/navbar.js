if (localStorage.getItem("username") === null) {
    alert("You are not signed on")
    location.href = "./signin"
}
document.getElementById("logout").onclick = function () {
    alert("You have been logged out");
    window.localStorage.clear();
}

document.getElementById("search").onclick = function () {
    const need_reload = location.href.includes("results");
    const query = document.getElementById("search-input").value;
    location.href = `./results#${query}`;
    if (need_reload) {
        // if the current page is the results page, reload the page
        location.reload();
    }
}