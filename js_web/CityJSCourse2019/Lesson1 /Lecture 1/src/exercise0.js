//create an array numbers that has values 1, 2, 3
//initialize a new empty array

//iterate through each element of numbers array in the original array


//alter that element adding 1 and put the altered value into the new array

//final aray should have [2, 3, 4]

const arr =[1,2,3];
const newArray = [];

for (let i = 0; i < arr.length; i++) {
   newArray[i] = arr[i] + 1;
}
return newArray;