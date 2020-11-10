var daysofweek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

// Print my array elements 
console.log(daysofweek);

// Step 1
// get a copy of the days of week with the new format
var listOfDaysOfTheWeek = daysofweek.map(function(day){
    return "<li>"+day+"</li>"
})

console.log(listOfDaysOfTheWeek);

// Step 2
// Adding the </ul> at the end of the array
listOfDaysOfTheWeek.push("</ul>");

console.log(listOfDaysOfTheWeek);

// Step 3
// Adding the <ul> at the beginning of the code 
var ul = ["<ul"];
listOfDaysOfTheWeek = ul.concat(listOfDaysOfTheWeek); 

console.log(listOfDaysOfTheWeek);

// Step 4
// Convert daysofweek_as_list_elements to string
var arrayToString = listOfDaysOfTheWeek.join('');
console.log(arrayToString);

// Step 5
// Get the element updated on dom
var element =  document.getElementById('content');

element.innerHTML= arrayToString;


// Step 6
// Set the element with the values
element.innerHTML = arrayToString;  