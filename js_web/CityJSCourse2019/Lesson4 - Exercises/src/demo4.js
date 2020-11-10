var inner = document.getElementById("headline"),
outer = document.getElementById("content");

inner.addEventListener("click", function (event) {
    console.log('I am the inner element');
});

outer.addEventListener("click", function (event) {
    console.log('I am the outer element');
});

// // Assuming user clicks on the "inner" element
// inner.addEventListener("click", function (event) {
//     console.log(event.target); // inner
//     console.log(event.currentTarget); // inner
// });

// outer.addEventListener("click", function (event) {
//     console.log(event.target); // inner
//     console.log(event.currentTarget); // outer
// });