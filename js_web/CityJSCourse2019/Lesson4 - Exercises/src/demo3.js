// The handler function
function listenerTest() {
    event.preventDefault();
    console.log(event);
    console.log('I am handling an Event!');
  }
      
  // The element to attach handler to
  var myEl = document.getElementById("headline1");
      
  // Adding the event handler to myEl...
  myEl.addEventListener("click", listenerTest);
  