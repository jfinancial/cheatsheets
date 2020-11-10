var daysofweek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

// Print my array elements with a console log
console.log(daysofweek);
// Step 1
// get a copy of the days of week with the new format e.g <li>Monday</li><li>Tuesday</li>
var newdaysofweek = daysofweek.map(function(item){
    return "<li>"+ item +"</li>";
});
// Print it with console log 
console.log(newdaysofweek);
// Step 2
// Adding the </ul> at the end of the array
newdaysofweek.push("</ul>");
// Print the result
console.log(newdaysofweek);

// Step 3
// Adding the <ul> at the beginning of the code 
// var newarray = ['<ul>'];
// var evenNewerArray = newarray.concat(newdaysofweek);
// console.log(evenNewerArray);
newdaysofweek.unshift('<ul>');
console.log(newdaysofweek);
// Print the result
//console.log(newdaysofweek.toString());

var printnewdays = newdaysofweek.join(" ");
console.log(printnewdays);




// Step 4
// Convert daysofweek_as_list_elements to string

// Print the result

// Step 5
// Get the element updated on dom
var element = document.getElementById("content");
console.log(element);
element.insertAdjacentHTML("afterbegin",printnewdays);
// Step 6
// Set the element with the values
