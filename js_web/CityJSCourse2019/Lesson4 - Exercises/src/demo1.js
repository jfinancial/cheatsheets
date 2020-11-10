// The handler function
function listenerTest() {
  console.log('I am handling an Event!');
}
    
// The element to attach handler to
var myEl = document.getElementById("headline1");
    
// Adding the event handler to myEl...
myEl.addEventListener("click", listenerTest);


// The element to attach handler to
var myEl2 = document.getElementById("headline2");
// Adding the event handler to myEl...
myEl2.addEventListener("click", function () {
console.log('I am handling an Event too!');
});