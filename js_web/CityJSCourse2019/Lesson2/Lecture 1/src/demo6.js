// The function to run
function sayHello(event) {
    alert("Hello World");
    console.log("Hello world!");
}
    
// Element to listen for clicks on
var trigger = document.getElementById("myButton");
    
// Adding the listener:
// run the sayHello function when trigger is clicked
trigger.addEventListener("click", sayHello);