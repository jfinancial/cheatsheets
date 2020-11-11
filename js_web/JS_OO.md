## Object Oriented Javascript & Javascript Prototypes

#### ES5-style OO
- In ES5 functions are used for classes. Here the constructor has a method for calculateAge
  <pre>
      function Person(name, dob) {
        this.name = name;
        this.birthday = new Date(dob);
        this.calculateAge = function(){    //it's better to put this on the prototype
          const diff =  Date.now() - this.birthday.getTime();
          const ageDate = new Date(diff);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      }
      const brad = new Person('Brad', '9-10-1981');
      let bradAge = brad.calculateAge());
  </pre>

#### Constructors for Object Types and Typing Gotchas!
- Usually we don't use the constructor for strings, numbers and booleans as it slows down execution speed using reference type rather than primitives

  - String example using primitive an object
  
      <pre>
          // String
          const name1 = 'Jeff';
          const name2 = new String('Jeff'); //create as as an object (and not a primitive)
          console.log(name2); //we'll see primitive value as the key
          console.log(typeof name2); //we'll see object (not string!)
          console.log(name === name2); //we'll get false because they are different type
          name.surname = 'Jones';  //because its now an object we can add properties
      </pre>    
      
  - Number and boolean examples using primitives and object
  
      <pre>
          const num1 = 5;
          const num2 = new Number(5);
          
          const bool1 = true;
          const bool2 = new Boolean(true);    
      </pre>
    
  - For object literals and arrays there is no difference in type
  
      <pre>   
        const john1 = {name: "John"};
        const john2 = new Object({name: "John"});
        
        const arr1 = [1,2,3,4];
        const arr2 = new Array(1,2,3,4);
        
        const re1 = /\w+/;
        const re2 = new RegExp('\\w+');    
      </pre>    

#### Prototypes
- JS is unlike most OO languages which used class based object but follows a [Prototype](https://en.wikipedia.org/wiki/Prototype_pattern) pattern
- Each object in JS has a prototype and inherits methods and properties from them
- When dealing with object literals then you're inheriting from an object called `Object.prototype' but if you're creating a Person object then you're inheriting from `Person.prototype`
- The prototype chains allows you to access super classes / prototypes
- We can put methods on the prototype to avoid flooding the constructor
- We can use `hasOwnProperty` to see if a property belongs to the class but if its on the property it will be false
 
  <pre>
      function Person(firstName, lastName, dob) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = new Date(dob);
      }
      
      Person.prototype.calculateAge = function(){
        const diff =  Date.now() - this.birthday.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }
      
      // Get full name
      Person.prototype.getFullName = function(){
        return `${this.firstName} ${this.lastName}`;
      }
      
      // Gets Married
      Person.prototype.getsMarried = function(newLastName){
        this.lastName = newLastName;
      }
      
      const john = new Person('John', 'Doe', '8-12-90');
      const mary = new Person('Mary', 'Johnson', 'March 20 1978');
 
      console.log(john.calculateAge());
      console.log(mary.getFullName());
      mary.getsMarried('Smith');
      console.log(mary.getFullName());
      console.log(mary.hasOwnProperty('firstName'));  //true
      console.log(mary.hasOwnProperty('getFullName')); // will be false because its on the prototype
  </pre>
  
#### Prototype Inheritance (ES5)
- In this example we use `Person.call` to call the constructor of the superclass and we use `Person.create` and pass a prototype to inherit methods. If we don't use create then we won't have the `greeting` method
- The last thing is set to set the `Customer.prototype.constructor` to the  make the customer prototype return a Customer

  <pre>
      function Person(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
      }
      
      Person.prototype.greeting = function(){
        return `Hello there ${this.firstName} ${this.lastName}`;
      }
      
      const person1 = new Person('John', 'Doe');
      console.log(person1.greeting());
      
      function Customer(firstName, lastName, phone, membership) {
        Person.call(this, firstName, lastName); 
        this.phone = phone;
        this.membership = membership;
      }
    
      // Inherit the Person prototype methods
      Customer.prototype = Object.create(Person.prototype);
      
      // Make customer.prototype return Customer()
      Customer.prototype.constructor = Customer;
      
      // Create customer
      const customer1 = new Customer('Tom', 'Smith', '555-555-5555', 'Standard');
      
      console.log(customer1);
      
      // Customer greeting
      Customer.prototype.greeting = function(){
        return `Hello there ${this.firstName} ${this.lastName} welcome to our company`;
      }
  </pre>
  
#### Using `Object.create` to pass in prototypes (ES5)
- Using `Object.create` we can pass in an object containing our prototypes to inherit from
- Notice how when using `Object.create` we must use object literal with `value` as the key

  <pre>
      const personPrototypes = {
        greeting: function() {
          return `Hello there ${this.firstName} ${this.lastName}`;
        },
        getsMarried: function(newLastName) {
          this.lastName = newLastName;
        }
      }
      
      const mary = Object.create(personPrototypes);
      mary.firstName = 'Mary';
      mary.lastName = 'Williams';
      mary.age = 30;
      
      mary.getsMarried('Thompson');
      console.log(mary.greeting());
      
      const brad = Object.create(personPrototypes, {
        firstName: {value: 'Brad'},
        lastName: {value: 'Traversy'},
        age: {value: 36}
      });
      
      console.log(brad);
      console.log(brad.greeting());
  </pre>
  
#### ES6 Classes
- ES6 introduced classes with a `constructor` method and also add `static` methods. Under the hood it still uses prototype inheritance so ES6 just provides syntactic sugar

  <pre>
      class Person {
        constructor(firstName, lastName, dob) {  //constructor method
          this.firstName = firstName;
          this.lastName = lastName;
          this.birthday = new Date(dob);
        }
      
        greeting() {
          return `Hello there ${this.firstName} ${this.lastName}`;
        }
      
        calculateAge() {
          const diff = Date.now() - this.birthday.getTime();
          const ageDate = new Date(diff);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      
        getsMarried(newLastName) {
          this.lastName = newLastName;
        }
      
        static addNumbers(x, y) {  //static method
          return x + y;
        }
      }
      
      const mary = new Person('Mary', 'Williams', '11-13-1980');   
      mary.getsMarried('Thompson');
      console.log(mary);
      console.log(Person.addNumbers(1,2));
  </pre>