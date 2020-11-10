var button = document.getElementById("goBtn"); 

button.addEventListener("click", goPage);  

//This function determines which page is selected and goes to it.
function goPage(event) {
    console.log(event.target);
    var e = document.getElementById("pages");
    var page = e.options[e.selectedIndex].value;

    window.location = page
}