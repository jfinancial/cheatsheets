// Some variables to test with
var a = 5,
    b = 10,
    c = {
        name: "Joe",
        age: 25,
        isAdult: function () {
            var isOverEighteen = this.age >= 18;
            return isOverEighteen;
        }
    };

// Inspect some variables...
console.log(a);
console.log(c);
// Inspect an expression
console.log(a > b);