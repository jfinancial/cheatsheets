#JAVASCRIPT (INCLUDING ES6)

### Web and Javascript Tools
  | Name                                                                     | Description                                            |
  | -------------------------------------------------------------------------|--------------------------------------------------------|
  | [Jest](https://jestjs.io/)                                               | Preferred testing framework                            |
  | [TypeScript](https://www.typescriptlang.org/)                            | Strongly typed js                                      |
  | [Gulp](https://gulpjs.com/)                                              | Task/pipeline runner used for build                    |
  | [Webpack](https://webpack.js.org/)                                       | Module bundler and packaging for browser               |
  | [Babel](https://babeljs.io/)                                             | Compiler / transpiler                                  |
  | [Bootstrap](https://getbootstrap.com/)                                   | CSS framework for responsive web                       |
  | [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)  | Fetch API for interacting with REST endpoints          |
  | [Axios](https://github.com/axios/axios)                                  | Promise based HTTP client for the browser and node.js  |
  | [Materialize](https://materializecss.com/)                               | A modern responsive front-end/CSS framework            | 
<hr>

## Basics

###Variables & Scope

-   **Variable Declaration var vs let** 
   - `var` :  function or global scope if outside function 
   - `let` : block scope (can be updated but not redeclared) 
   - `const` : immutable constant (but obviously a `Map` declared as a `const` can still be mutated)
   -  [Opinion: Should we never use var?](#https://dev.to/johnwolfe820/should-you-never-truly-use-var-bdi)
   
-   **Primitive Types** is data that is not an object, has no methods and represented directly at the lowest level of the language implementation. (`null` is seemingly primitive but is a special case for every Object: and any structured type is derived from null by the *Prototype Chain*.) All primitives are immutable, i.e., they cannot be altered. It is important not to confuse a primitive itself with a variable assigned a primitive value. The variable may be reassigned a new value, but the existing value cannot be changed in the ways that objects, arrays, and functions can be altered. The six types are    
    - `undefined : typeof instance === "undefined"`
    - `Boolean : typeof instance === "boolean"`
    - `Number : typeof instance === "number"`
    - `String : typeof instance === "string"`
    - `BigInt : typeof instance === "bigint"`
    - `Symbol : typeof instance === "symbol"` (ES6)
- **Falsy** is a term used in JavaScript type comparison and conversion. Falsy values in JavaScript translate to the Boolean false when used in type comparisons. Examples of falsy values are null, undefined, 0, and the Boolean false.
    
-   **Reference Types** are held on the heap and have methods. Examples are: 
    - `Array`, Object Literals, `Functions`, `Date` 

-  [Explaining Value vs. Reference in Javascript](https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0)

-   Why is **NaN** not a number? (`NaN` is defined as a numeric type, but it’s not a real number. NaN is result of some mathematical operations that can’t be quantified as a number)

-  **Objects literals** are comma-separated list of name-value pairs inside of curly braces; values can be properties and functions. All members of an object literal in JavaScript, both properties and functions, are public. Private members can only be inside a function. You cannot copy an object literal without manually copying all the values.
    <pre>
      let person = { name: "John", lastname: "Doe" };
      console.log(person.name);
    </pre>

-   **Function Scope** is created inside functions. When a function is declared, a new scope block is created inside body of that function. A `var` declared inside the new function scope cannot be accessed from parent scope, however, the function scope has access to variables in the parent scope. When a variable is created with function scope, it's declaration automatically gets hoisted to the top of the scope. 

-   **Weak Types & Coercion** Difference between `==` and `===` (when in doubt always use triple equals). See [Double Equals vs. Triple Equals](#https://codeburst.io/javascript-double-equals-vs-triple-equals-61d4ce5a121a)

-   **Hoisting** means that the interpreter moves the instantiation of an entity to the top of the scope it was declared in, regardless of where in the scope block it is defined. Functions and variables declared using var are hoisted in JavaScript; that is, a function or a variable can be used before it has been declared. When a variable is created with function scope, it's declaration automatically gets hoisted to the top of that scope (i.e. the interpreter moves the instantiation of an entity to the top of the scope it was declared in, regardless of where in the scope block it is defined.) Functions and variables declared using `var` are hoisted in JavaScript so a function or a variable can be used before it has been declared.

-   **Temporal Dead Zone (TDZ)** is the period between when a scope is entered and when a variable is declared. Variables that are added are not hoisted and are subject to the TDZ. If variable is accessed inside the TDZ, then a runtime error will be thrown.

-   **Functions: `Bind`, `Apply`, `Call`**
    -   `call()` and `apply()` are very similar—they invoke a function with a specified `this` context, and optional arguments. The only difference between them is that call requires the arguments to be passed in one-by-one, and apply takes the arguments as an array.
    -   `bind()` allows you to set the `this` value now while allowing you to execute the function in the future, because it returns a new function object.

<hr>

###IIFEs - Immediately Invoked Function Expressions

[An introduction to IFFEs](#http://adripofjavascript.com/blog/drips/an-introduction-to-iffes-immediately-invoked-function-expressions.html)
  <pre>
    var foo = "foo";
    
    (function (innerFoo) {
        // Outputs: "foo"
        console.log(innerFoo);
    })(foo);
  </pre>

<hr>

###Arrays
-   Array Operations: push, pop, concat, slice, join, forEach, map, filter

<hr>

###Iterables
- An object is iterable if it defines its iteration behavior, such as what values are looped over in a `for...of` construct. 
- Some built-in types, such as `Array` or `Map`, have a default iteration behavior, while other types (such as `Object`) do not. 
- In order to be iterable, an object must implement the `@@iterator` method. This simply means that the object (or one of the objects up its prototype chain) must have a property with a `Symbol.iterator` key. 
- It may be possible to iterate over an iterable more than once, or only once. (It is up to the programmer to know which is the case.) Iterables which can iterate only once (such as a `Generator`) customarily return this from their `@@iterator` method, whereas iterables which can be iterated many times must return a new iterator on each invocation of `@`@iterator`.

<pre>
  function* makeIterator() {
    yield 1;
    yield 2;
  }
    
  const it = makeIterator();
    
  for (const itItem of it) {
     console.log(itItem);
  }
    
  console.log(it[Symbol.iterator]() === it) // true;
    
  // This example show us generator(iterator) is iterable object, which has the @@iterator method return the it (itself), and consequently, the it object can iterate only _once_.
  // If we change it's @@iterator method to a function/generator which returns a new iterator/generator object, (it)can iterate many times
    
  it[Symbol.iterator] = function* () {
    yield 2;
    yield 1;
   };
    //Output is 1, 2, true
</pre>

<hr>

###Generators
The `function*` declaration (function keyword followed by asterisk) defines a generator function, which returns a Generator object. Generators compute their yielded values on demand, which allows them to efficiently represent sequences that are expensive to compute (or even infinite sequences). The next() method also accepts a value, which can be used to modify the internal state of the generator. A value passed to next() will be received by yield .(A value passed to the first invocation of `next()` is always ignored.) Here is the fibonacci generator using `next(x)` to restart the sequence:
<pre>
   function* fibonacci() {
     let current = 0;
     let next = 1;
     while (true) {
       let reset = yield current;
       [current, next] = [next, next + current];
       if (reset) {
         current = 0;
         next = 1;
       }
    }
  }
</pre>

<hr>

###ES6: Arrow Functions

-  Difference between arrow function and normal functions is that they are [**anonymous**](#https://en.wikipedia.org/wiki/Anonymous_function). To write an arrow function, simply omit the function keyword and add =&gt; between the arguments and fn body.
-  If arrow function is returning a **single line of code,** you can omit statement brackets and return
-  Arrow functions follow normal scoping rules, with the exception of the `this` scope. (In basic JavaScript, each function is assigned a scope, that is, the `this` scope.) Arrow functions are not assigned a `this`scope - they inherit their *parent's* `this` scope and cannot have a new `this` scope bound to them*! 
-  Arrow functions have access to the scope of the parent function (i.e. the variables in that scope) but the scope of this cannot be changed in an arrow function. Using the `apply()`, `call()`, or `bind()` function modifiers will NOT change the scope of an arrow function's `this` property.

<pre>
    const fn1 = function( a, b ) { return a + b; }; 
    const fn2 = ( a, b ) => { return a + b; };
    
    // Single argument arrow function 
    arg1 => { /* Do function stuff here */ } 
    
    // Non simple identifier function argument 
    ( arg1 = 10 ) => { /* Do function stuff here */ }
    
    // No arguments passed into the function 
    ( ) => { /* Do fn stuff here */ }
    
    // Arrow function with an object literal in the body 
    ( num1, num2 ) => ( { prop1: num1, prop2: num2 } )
</pre>

<hr>

###ES6: Enhanced Object Literals (Provides Syntactic Sugar Over ES5)
  <pre>
    function getPersonES5( name, age, height ) { 
     return { name: name, age: age, height: height }; 
    }
  
    function getPersonES6( name, age, height ) { 
      return { name, age, height};
    }
  </pre>

..and including function declarations

  <pre>   
    function getPersonES5( name, age, height ) { 
       return { name: name, height: height, getAge: function(){ return age; } }; 
    }
  
    function getPersionES6( name, age, height ) { 
       return { name, height, getAge(){ return age; } }; 
    }
  </pre>

<hr>

###ES6: Computed Property Notation
ES6 provides new, efficient way to create property names from variables.  In ES5,  only one way to create a dynamic property whose name is specified by a variable; this is through bracket notation e.g  obj[ expression ] = 'value' . 
In ES6, we can use this same type of notation during the object literal's declaration:

  <pre>
     const varName = 'firstName'; 
     const person = { [ varName ] = 'John', lastName: 'Smith' }; 
     console.log( person.firstName ); // Expected output: John
  </pre>

<hr>

###ES6: Template Literals

Use `${foo}` for expressions. New lines will be included in the output. To escape a template literal, simply use a backslash.

  <pre>
    console.log(`Template literals are ${ example }`);
    console.log(`${a} + ${b} is equal to ${a + b}`);
  </pre>   

You can also nest template literals:

  <pre>
    const p = `Learning ${ `Professional ${ javascriptOrCPlusPlus() }` }`
  </pre>

-  **Tag functions** allow you to parse template literals with a function; these functions take a string array and then arguments

  <pre>
    function myTag(strings, personExp, ageExp) { ...}
    let output = myTag`That ${ person } is a ${ age }`;
  </pre>

Special property `raw` is available for the first argument of a tagged template. This returns array that contains the raw, unescaped, versions of each part of the split template literal.

<hr>

###ES6: Default Parameters

Default function parameters allow named parameters to be initialized with default values if no value or undefined is passed:

  <pre>
    function multiply(a, b = 1) {
      return a * b;
    }
    console.log(multiply(5, 2));// expected output: 10
    console.log(multiply(5));  // expected output: 5
  </pre>

<hr>

###ES6: Destructuring

- **Destructuring assignment** is syntax in JavaScript that allows you to unpack values from arrays or properties from objects, and save them into variables.

- **Array Destructuring** allows us to extract multiple array elements and save them into variables. We create an array containing the variable to assign data into, and set it equal to the data array being destructured and values in the array are unpacked and assigned to the variables in the left-hand side array from left to right, one variable per array value. If there's more array items than vars, then remaining items will be discarded and not be destructured. Conversely, if there are more variables than the total number of array elements in the data array, some of the variables will be set to undefined. So *don't unintentionally assume that a variable will contain a value!*

  <pre>
    let names = [ 'John', 'Michael' ]; 
    let [ name1, name2 ] = names; 
    console.log( name1 ); // Expected output: 'John' 
    console.log( name2 ); // Expected output: 'Michael'
  </pre>


###ES6 Rest and Spread Operator (… or 'elipses') for Deep Copy

-   The operator is used to represent an infinite number of arguments as an array; it is used to allow an iterable object to be expanded into multiple arguments. To identify which is being used, we must look at the item that the argument is being applied to.

    -   If applied to an **iterable object** (array, object, and so on), then it is the **spread operator**
    -   If applied to **function arguments**, then it is the **rest operator**.

* **Rest Operator**
  - Like the arguments object of a fn (which is array-like object that contains each argument passed into the fn), the rest operator contains a list of fn arguments but has three distinct differences from the arguments object.
  - Rest operator contains only the input parameters that have *not been given a separate formal declaration* in the function expression
  - The arguments object is not an instance of an Array object. The *rest parameter is an instance of an array* so functions like `sort()`, `map()`, and `forEach()` can be applied
  - The arguments object has special functionality that the rest parameter does not have (e.g. the caller property exists on the arguments object.) The rest parameter can be destructured similar to how we destructure an array. Instead of putting a single variable name inside before the ellipses, we can replace it with an

  <pre>
    function fn( num1, num2, ...args ) //rest operator used for args
  </pre>

  - Rest parameter can be destructured (just like an array.) Instead of a single variable name inside before the ellipses, we can replace it with an array of variables to fill:

  <pre>
    function fn( ...[ n1, n2, n3 ] ) { 
    	//destructures indefinite #of function parameters into array args 	
    	//then destructured into 3 vars 
    	console.log( n1, n2, n3 ); 
    }   
    fn( 1, 2 ); // Expected output: 1, 2, undefined
    console.log( n1, n2, n3 );
  </pre>

* **Spread Operator** 
  - Allows an iterable object such (e.g. an array or string to be expanded into multiple arguments (for function calls), array elements (for array literals), or key-value pairs (for object expressions) so we can expand an array into arguments for creating another array, object, or calling function:

  <pre>
    function fn( n1, n2, n3 ) {
       console.log( n1, n2, n3 );
    }
    const values = \[ 1, 2, 3 \];
    fn( ...values ); // Expected output: 1, 2, 3
    const obj = { firstName: 'Bob', lastName: 'Smith' };
    const { firstName, lastName } = obj;
    console.log( firstName ); // Expected output: 'Bob'
    console.log( lastName ); // Expected output: 'Smith'
  </pre>

  ...the exception to previous rule is if there's a **default value**:

  <pre>
    const obj = { firstName: 'Bob', lastName: 'Smith' }; 
    const { firstName = 'Samantha', middleName = 'Chris' } = obj; 
    console.log( firstName ); // Expected output: 'Bob' 
    console.log( middleName ); // Expected output: 'Chris'
  </pre>

- We can also save the key that's extracted into a **var with a different name** by a*dding a colon and the new variable name after the key name* in the destructuring notation:

  <pre>
    const obj = { firstName: 'Bob', lastName: 'Smith' }; 
    const { firstName: first, lastName } = obj; c
    console.log( first ); // Expected output: 'Bob' 
    console.log( lastName ); // Expected output: 'Smith'
  </pre>

<hr>

###DOM Manipulation

- **Single Element** Selector

  <pre>
    //Get the task element with id of task-title
    document.getElementById('task-title')
      
    //Make selected element disappear
    document.getElementById('task-title').style.display = none
       
    //Set the inner text or html
    document.getElementById('task-title').style.innerText = Foo
    document.getElementById('task-title').style.innerHtml = &lt;body..&gt;
       
    //Using the query selector to the line item in an unordered list
    document.querySelector('ui li')
        
    //Using the query selector with CSS pseudo classes
    document.querySelector('li:nth-child(3)').style.color = 'yellow'
  </pre>

<hr>

###ES6: Classes & Modules

- **Classes** were introduced in ES6 as means to expand on prototype-based inheritance by adding some OO concepts; it is syntactic sugar to expand on the existing prototype-based inheritance. Classes can have function constructors; subclasses must call super constructor:
  <pre>
    class House{ 
        constructor(address, garage = false) {
            this.address = address; 
            this.garage = garage;
        } 
    }
    
    
    class Mansion extends House { 
        constructor( address, floors = 3 ) { 
                super( address ); 
                this.floors = floors; 
         }
    }
  </pre>

- **Modules** were introduced in ES6 via import and export keywords allowing the contained code to be quickly and easily shared without any code duplication. Use export keyword to expose variables and functions contained in a file. Everything inside an ES6 module is private by default so only way to make anything public is to use the export keyword. Modules can export properties in two ways, via named exports or default exports.

-   **Named exports** allow for multiple exports per module. Multiple exports may be useful if you are building a math module that exports many functions and constants.
-   **Default exports** allow for just a single export per model. A single export may be useful if you are building a module that contains a single class.

  <pre>
    export const PI = 3.1415;                           //export constant
    export function convertDegToRad( degrees ) {        //export function 
        return degrees * PI / (360/2); 
    } 
    export { PI, DEGREES_IN_CIRCLE, convertDegToRad }; 	//export via object
  </pre>

 - Use the `default` keyword, to **export** the contents of module as a default export. When we default export a module, we can also omit the identifier name of the class, function, or variable we are exporting. Here we export a class and the other exports a function. When we export a default class, the export is not named. When we are importing default export modules, the name of the object we are importing is derived via the module's name.
  <pre>
    //HouseClass.js 
    export default class() { /* Class body goes here */ }   // export class
    
    // myFunction.js export 
    default function() { /* Function body goes here */ }    //export fn
  </pre>

- The `import` keyword allows you to import a module, allowing you to pull any items from that module into the current code file. When we import a module, we start the expression with the import keyword, identify what parts of the module we are going to import then follow that with the `from` keyword, and finally we finish with the path to the module file.

  <pre>
    import { PI as pi } from 'math-module.js
    import * as MathModule from 'math-module.js'
  </pre>
  
-  **Note:** ES6 modules may not have full support from all browsers versions. You must use a transpiler (e.g. Babel) to run your code on certain platforms. To use an import in the browser, we must use the script tag and set type to module and the src to the file. (If the browser does not support modules, there's a fallback option with the nomodule attribute.) Finally, be careful of **circular dependencies** which cause lots of errors in transpilation!

###Transpilation with Babel

To install the Babel cuse the following: `npm install --save-dev babel-cli`

After that, the `babel-cli` field will have been added to the devDependencies object in the `package.json` file (although this only installed base Babel with no plugins for transpiling):

<pre>
    "devDependencies": {
        "babel-cli": "^6.26.0"
    
    }
</pre>

To install the plugin to transpile to ECMAScript 2015, use

`npm install --save-dev babel-preset-es2015`

Once this finishes, our `package.json` `file will contain another dependency:

  <pre>
    "devDependencies": {
        "babel-cli": "^6.26.0",
        "babel-preset-es2015": "^6.24.1"
    }
  </pre>

This installs the ES6 presets. To use these, we must tell Babel to configure itself with these presets. Create a file called `.babelrc` which is Babel's configuration. This is where we tell Babel what presets, plugins etc. Once created, add the following contents to the file:

  <pre>
    { "presets": ["es2015"] }
  </pre>

Now that Babel has been configured to transpile we need to update our `package.json` file to add a **transpile script** for npm. Add the following lines to your `package.json` file:
  <pre>
    "scripts": {
        "transpile": "babel app.js --out-file app.transpiled.js --source-maps"
    }
  </pre>

The scripts object allows us to run these commands from npm.

-   We name the npm script transpile and it will run the command chain babel `app.js --out-file app.transpiled.js --source-maps` where `app.js` is our input file
-   The `--out-file` command specifies the output file for compilation. The `app.transpiled.js` is our output file.
-   Lastly, `--source-maps` creates a source map file. This file tells the browser which line of transpiled code corresponds to which lines of the original source. This allows us to debug directly in the original source file, that is, `app.js`.
-   

Now we can transpile by typing npm run transpile into the terminal window.

-   Inheritance, Composition &Prototype** (\_\_proto\_\_ points back to the function)
-   Closures
-   Dom Events & Custom Events
-   Events, Event Handlers, Delegation Filtering & Bubbling

<hr>

