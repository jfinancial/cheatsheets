var Car = (function() {
  var doors = 4;

  var printDoors = function() {
    var element = document.getElementById('doors');
    element.innerHTML = doors;
  }

  return {
    callPrintDoors: function() {
      printDoors();
      console.log(doors);
    }
  };

})();


Car.callPrintDoors();       // Outputs: 'doors'
console.log(Car.doors);     // undefined