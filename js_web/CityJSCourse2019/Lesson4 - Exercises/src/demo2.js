var myEl = document.getElementById("headline");

myEl.addEventListener("click", function (event) {
// "event.target" is a DOM node...
// ... so DOM methods are available
    console.log(event.target.textContent);
});