// ---------------------------------------------------------------------
// CALL and APPLY
// Both of these allow us to share functionality between objects
// They both do the same thing, so example only uses "call()"
// ---------------------------------------------------------------------

// EXAMPLE 1

// Note, this example is a rough form of (temporary) "inheritance" in Javascript...
// You might also call it "method borrowing"...

// Object with useful methods we might want to share with other objects
var ObjectToolKit = {
    countProps: function () {
        var total = 0;
        for (prop in this) {
            if ((typeof this[prop]) !== "function") {
                total++;
            }
        }
        return total;
    },
    countMethods: function () {
        var total = 0;
        for (prop in this) {
            if ((typeof this[prop]) === "function") {
                total++;
            }
        }
        return total;
    }
};

// An object
var Car = {
    name: 'Ford',
    model: 'Cortina',
    go: function () {
        console.log('Going...');
    },
    stop: function () {
        console.log('Stopping...');
    },
    crash: function () {
        console.log('Boom...');
    }
};

// Call the ObjectToolKit methods, using the Car object as context
// Result: "this" in the ObjectToolKit methods points to "Car" object
var carProps = ObjectToolKit.countProps.call(Car);
var carMethods = ObjectToolKit.countMethods.call(Car);

console.log('Car has ' + carProps + ' properties');
console.log('Car has ' + carMethods + ' methods');

// Another object... completely different to Car object
var Person = {
    firstname: 'Joe',
    lastname: 'Bloggs',
    children: ['James', 'Mary', 'Paul']
};

// We can still use the ObjectToolKit, but this time, "this" will be the "Person" object
var personProps = ObjectToolKit.countProps.call(Person);
var personMethods = ObjectToolKit.countMethods.call(Person);

console.log('Person has ' + personProps + ' properties');
console.log('Person has ' + personMethods + ' methods');

// Without call() or apply(), "this" will be the ObjectToolKit object
// But, due to the abstract nature of the methods, they will still work!
console.log('Toolkit has ' + ObjectToolKit.countProps() + ' properties');
console.log('Toolkit has ' + ObjectToolKit.countMethods() + ' methods');


// EXAMPLE 2

// A slightly different example... not perfect, but worth exploring...

// Object with helper methods to work with HTML elements
var ElementHelper = {
    update: function (textString) {
        this.textContent = textString;
    },
    toggleClass: function (cls) {
        this.classList.toggle(cls);
    }
};

// An HTML element
var el = document.getElementById('my-button');

// Use the Helper methods, passing the element as the context of "this"
// IN this scenario, the methods also accept arguments, so they are passed too
ElementHelper.update.call(el, 'Hello World!');
ElementHelper.toggleClass.call(el, 'highlighted');

// Note, in this case, we can't use the ElementHelper methods without call/apply
// Why... because it has no classList or textContent properties!
// To make the code robust, we could perform some sanity checks in the methods
// e.g. check to see if "this" has a classList property before trying to use it


// EXAMPLE 3

// Chained constructors... based on code from the MDN page for call()
// ... Yet another way of achieving something like "inheritance" in JavaScript

// The base constructor with some properties shared by all product types
function Product(name, price) {
    this.name = name;
    this.price = price;
}
// Constructor for Book Products
function Book(name, price, pages) {
    Product.call(this, name, price);
    this.pages = pages;
}
// Constructor for Record Products
function Record(name, price, tracks) {
    Product.call(this, name, price);
    this.tracks = tracks;
}

// When we call the "Book" constructor, it calls the "Product" constructor, 
// but with "this" bound to the object that the Book constructor will return
// So, when the "Product" constructor sets properties, those properties are 
// created in the "Book" constructor's object
var myBook = new Book('Why I love JavaScript', 2.99, 154);

// Same thing applies to the Record constructor...
var myRecord = new Record('Songs about JavaScript', 4.99, 12);

// The Book and Record objects inherit the price and name properties from the product object
// ... and they can have properties of their own too...
console.log(myBook.name + ' costs ' + myBook.price + ' and has ' + myBook.pages + ' pages');
console.log(myRecord.name + ' costs ' + myRecord.price + ' and has ' + myRecord.tracks + ' tracks');


// ---------------------------------------------------------------------
// BIND
// Bind allows us to set the context in which a function runs...
// It is most useful when functions are passed to other functions or
// when we make copies of functions (functions are not copied by reference)
// ---------------------------------------------------------------------

// An object representing the "application"
var MyObject = {
    title: 'This is my object!',
    getTitle: function () {
        console.log(this.title);
    },
};

// A button to trigger our "application"
var myButton = document.getElementById('my-button');


// Run the getTitle method of object when button is clicked
myButton.addEventListener("click", MyObject.getTitle);
// Result: "I am the button!"
// When we pass "MyObject.getTitle" to addEventListener, it is a 
// copy of the function that is being passed... not a reference!
// Therefore, "this" in getTitle no longer refers to "MyObject"
// Also... when a function runs as an event handler, "this" refers to element that triggered the event (the button)
// So "this.title" in getTitle is retrieving the button's "title" attribute value (see the HTML)

// Solution...
// Use "bind()" when passing the method to addEventListener
// ... and bind the method to the object it was in originally (MyObject)
// Result: "This is my object!"
myButton.addEventListener("click", MyObject.getTitle.bind(MyObject));





