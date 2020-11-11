## Object Oriented Javascript & Javascript Prototypes

#### ES5-style OO
- In ES5 functions are used for classes. Here the constructor has a method for calculateAge
  <pre>
      function Person(name, dob) {
        this.name = name;
        this.birthday = new Date(dob);
        this.calculateAge = function(){
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
  