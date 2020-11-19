# TYPESCRIPT BASICS 

- TypeScript is a typed superset of javascript that compiles down to javascript. It was created and is maintained by Microsoft
- All ES5/ES6 features are available in TypeScript
- The [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) provides official documentation

### TypeScript Tools
  | Name                                                                                  | Description                                            |
  | --------------------------------------------------------------------------------------|--------------------------------------------------------|
  | [ts-seed-project](https://github.com/UltimateAngular/typescript-basics-seed)          |   A GitHub seed project for using TS/Webpack |
  | [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)                |                             |
  | [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader)  |      |
<hr>


#### Installing the TypeScript Compiler (`tsc`) and Using Webback and Yarn for Building
- `tsc` is the TypeScript compiler and is configured using `tsconfig.json` and you can use the `--outDir dist` to set output directory as `dist`
  - You can use `tsc - version` to get the version of the compiler
  - Use `tsc --init` to get generate a `tsconfig.json`
  - In `tsconfig.json` under `compilerOptions` there are options:
    - `target` : the intended target output (default "es5")
    - `module` : how to use modules (default "commonjs")
    - `outputDir` : the directory the compiler outputs to (no default)
    - use `tsc -w` or `tsc -watch` to tell the compiler to watch for changes and recompile

- We use [Webpack](https://webpack.js.org/) to manage our TypeScript project following the basic configuration
  - `entry` defines the entrypoint for `tsc` 
  - `resolve` defines how Webpack resolves the files that are relevant using extensions
  - `module` tells Webpack how to bundle up everything (including npm modules) into our own module using regex rules for test followed by the loader to `use` and lastly the port
 
 
  <pre>
    modules.export = {
      entry: './src/app.ts',
      output: {
        filename: 'app.js',
        path: __dirname + './dist'
      },
      resole: {
        extensions: ['.ts','.js']
      },
      module: {
        rules: [
           {test: /\.ts$/ , use: 'awesome-typescript-loader'}
        ]
      },
      devServer: {
        port: 3000,  
      }
    }
  </pre>
  
- Install the necessary modules:
  - Run `yarn install`  
  - When using Webpack because we are using a *virtual build directory* in our htm we can just put `<script src="app.js">` and not include the `dist` directory
  - Use `yarn start` to run the scripts (`yarn run start` is the equivalent of `npm start`, which runs the script inside the `start` field of the `script` field in `package.json`)

- Note that Webpack will put the files into a virtual dist folder and serve them up from here


#### Declaring Tvped Variables in TypeScript
- We declare the type after the variable name with colon and TypeScript type are **lowercase** (except `Function`). Return types are declared with a colon after the parameter brackets
- Be aware that types are only used at compile time so in the actual javascript output by tsc we experience [type erasure](https://en.wikipedia.org/wiki/Type_erasure)  

  <pre>
    let price: number = 10;
    
    //function takes two numbers and returns a number
    function calculatePrice(cost: number, extraToppings: number) : number{
       cost + extraToppings * 1.5;
    }
    
    cont cost = calculatePrice(10,2);  //cost is inferred to be a number
  </pre>

#### The TypeScript Types

- Types in TypeScript can be **explicit**  (i.e. declared) or **implicit** via [type inference](https://en.wikipedia.org/wiki/Type_inference). A string will be inferred as `any` unless explicitly declared
- `any` allows any type. (Used in situations where not all type information is available or its declaration would take an inappropriate amount of effort.)

- `void` indicates that a function doesn't have a return type

- `never` indicates that a value never occurs, i.e. in a function that never returns (e.g. `while(true){...}`) although a function declared returning `never` can throw an `Error`

- `null` is a type indicating that a value is unassigned. (If you use the `strict` or `strictNullChecks` then you can define whether variables are [nullable](https://en.wikipedia.org/wiki/Nullable_type), undefined or null by default)

- **Union Types** are defined using `|` e.g. `const name: string | null` declares a nullable string. It can also define whether, for example, a function or a number may be passed. We have also have unions of values:
  
  <pre>
   function selectSize(size: 'small' | 'medium' | 'large'){
    ...
   }
   
   function selectNumberSize(size: 1 | 2){
       ...
   }
  </pre>
  
- `Function types` are declared using uppercase. In this example the function is implictly declared (via an Arrow Function) and then defined:
  
  <pre>
    let sumOrder(price : number, quantity : number) => number;
    sumOrder = (x,y) => price * quantity;
  </pre>
  
- Alternatively we can do definition and assignment at the same time:
  
  <pre>
    let sumOrder(price : number, quantity : number) => number = (x,y) => price * quantity;
    
  </pre>
  
- **Optional types** are declared by adding a `?` to the variable name (not the type!)
  
  <pre>
    let sumOrder(price : number, quantity? : number) => number;
    sumOrder = (x,y) => {
      if(y){
        return x * y;
      } else{
        return x;
      }
    }
    const item = sum(25);
    const ttems = sum(25,2);
    
    //Another way is to introduce a default value
    sumOrder = (x,y = 1) =>  x * y;
  </pre>
  
- **Object types** allows us to define the types of variable and function members
  
  <pre>
    let pizza: {name: string; price: number; getName() : string } = {
       name: 'Italian hot',
       price: 10.5,
       getName(): {
         return pizza.name;
       }
    }
  </pre>

- **Arrays** can be typed or using [**generic types**](https://www.typescriptlang.org/docs/handbook/generics.html) with angled brackets (`< >`) 

  <pre>
     let sizes: string[] = ['small','medium', 'large'];
     let sizes: Array<String> = ['small','medium', 'large'];
  </pre>
  
- **Tuple types** (for arrays) can also be typed but we must presevere the ordering of arguments   

  <pre>
     let pizza: [string, number, boolean];
     pizza = ['Pepperoni',2,true];
  </pre>
  
#### Type Aliases
- `type` keyword is used to define type aliases We can start to define our own custom types which are usually declared at the top. These types are **virtual** and any type information will be erased when compiling TypeScript into JavaScript
 
  <pre>
    type Size = 'small' | 'medium' | 'large';
    type CallBack = (size: Size) => void;
    
    let pizzaSize : Size = 'small';
    const selectSize : Callback = x =>{
        pizzaSize = x;
    };
  
  </pre>

#### Enums
- The [`enum`](https://www.typescriptlang.org/docs/handbook/enums.html) keyword is used for enumerations and allow us to define a set of named constants. Note that Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
- Enums are real objects that exist at runtime but despite this the `keyof` keyword works differently (compared to typical objects.) Instead, use `keyof` `typeof` to get a Type that represents all Enum keys as strings.
- Enums be default are keyed to corresponding integers. If we start with 1 then the others are auto-incremented
  
  <pre>
    enum Direction {
      Up = 1,
      Down,
      Left,
      Right
    }
  </pre>  

- ..alternatively we choose not to initialize with integer values and we can look up the corresponding enum label by accessing the array (but this only works with numeric enums):

  <pre>
    enum Direction {
      Up,
      Down,
      Left,
      Right
    }
    
    val label = Direction[Direction.Up]]; //will return string 'Up'
  </pre>   

- We can have string enums as well as mixed (heterogenous) enums
  <pre>
    enum Direction {
      Up = "UP",
      Down = "DOWN",
      Left = "LEFT",
      Right = "RIGHT"
    }
  </pre>

   
#### Type Assertion
- A type assertion is when we want to tell the TypeScript compiler what a particular type will be. A typical usage might be when we parse a JSON string into an object. There are two ways to do this but using keyword `as` is preferred approach
- We can use `noImplicitAny` to avoid having a function where the argument is an implicit any and we are forced to explicitly declare the type (which can be `any`)

  <pre>
    function getPizzaNameFromJsonString(obj: string) : String{
      return (JSON.parse(obj) as Pizza).name; 
    }
  
    //old way - just tell TS the return type but it becomes problematic with JSX
    function getPizzaNameFromJsonString(obj: string) : Pizza{
      return ( &lt;Pizza&gt; JSON.parse(obj)).name; 
    }
    
  </pre>  

#### Interfaces

- Interfaces are the preferred construct for more complex data types. Interfaces have have optional properties and read-only properties.
- **Note: The `readonly` vs `const` Rule**: *Variables use const whereas properties use `readonly`.

  <pre>
    interface SquareConfig {
      color?: string;
      width?: number;
    }
    
    interface Point {
      readonly x: number;
      readonly y: number;
    }
    
  </pre> 
  
- We can have interfaces that define methods of define individual function type 

  <pre>
    interface Pizza {
      name: string;
      sizes: string[];
      getAvailableSizes(): string[];
    }
    
    type getAvailableSizes = () => string[];  //note use of arrow and not a colon
  </pre> 
  
- We can extend interfaces using the `extends` key word to define base interfaces and sub interfaces

  <pre>
     interface Sizes {
        sizes: string[];
     }
     
     interface Pizza extends Sizes {
       ...
     }
  </pre> 

#### Index Signatures
- An `Object` in JavaScript (and hence TypeScript) can be accessed with a `string` to hold a reference to any other JavaScript object (but if you pass any other object to the index signature the JS runtime calls `.toString` on it before getting the result.)
  
  <pre>
     let foo: any = {};
     foo['Hello'] = 'World';
  </pre> 

- We have also have interfaces with index properties
  
  <pre>
     interface Pizza {
        name: string;
        topics: string[];
        [key: string] : any;
     }
  </pre>

#### Classes, `get` and `set` and static properties/methods 
- Since ES6, Javascript now has classes, however, Typescript can be viewed as a subtle evolution since it requires members to declared before being referenced in the constructor:
- Properties and methods are by default public but can be marked as `private`. Keyword `protected` gives visibility only to subclasses.
  <pre>
    //ES6 class
    class User {
      constructor(name, email, phoneNumbers) {
        this.name = name;
        this.emails = email;
        this.phoneNumbers = phoneNumbers;
      }
    }
    
    //TypeScript class (verbose)
    class User {
      name: string;
      emails: string;
      private phoneNumbers: string[] = [];
      constructor(name, email) {
        this.name = name;
        this.email = email;
       };
       addPhoneNumber(number: string){            //we've added a method add to an empty array
         this.phoneNumbers.push(number);
       }
    }
    
    //TypeScript class (verbose)
    class User {
      private phoneNumbers: string[] = [];
      constructor(public name, public email) {};  //auto-bind our variables
      addPhoneNumber(number: string){            
        this.phoneNumbers.push(number);
      }
    }
  </pre>
  
 - We add **getters/setters** (accessors/mutators) to our class using keyword `get` and `set`
 
   <pre>
     class Sizes{
       constructor(public sizes: string[]){}
       set availableSizes(sizes: string[]){
         this.sizes = sizes;
       }
       get availableSizes() {
         return this.sizes;
       }
     }
     const sizes = new Sizes(['medium','large']);
     console.log(sizes.availableSizes);   //invoke getter
     sizes.availableSizes = ['medium','large','extra large']; //invoke setter
     console.log(sizes.availableSizes);
   </pre>
   
- We can define class hierarchies using the `extends` keyword, remembering to call the `super` constructor of any base classes. We can also make base classes non-instantiable using the `abstract` keyword:
  
  <pre>
     abstract class Sizes {
        constructor(public sizes: string[]){}
     }
     
     class Pizza extends Sizes {
       constructor(readyonly name: string, sizes: string[]){   //no need to declare sizes as public here
         super(sizes);
       }
     }
  </pre>
 
 - A classes can implement interfaces via the `implements` keyword

  <pre>
     interface SizesInterface {
       availableSizes: string[];
     }
  
     abstract class Sizes implements SizesInterface {
        constructor(public sizes: string[]){}
        
        get availableSizes() {
          return this.sizes();
        }
     }
     
     interface PizzaInterface extends SizesInterfaces {
        readonly name: string;
        toppings: strings[];
        updateSizes(sizes: string[]) : void;
        addToppping(topping: string): void;
     }
     
     class Pizza extends Sizes implements PizzaInterface {
       public toppings: string[] = [];
       constructor(readyonly name: string, sizes: string[]){   //no need to declare sizes as public here
         super(sizes);
       }
       
       updateSizes(sizes: string[]){
         this.sizes = sizes;
       }
       
       addTopping(topping: string){
          this.toppings.push(topping);
       }
     }
  </pre> 
  
#### Static Properties and Methods
- Keyword `static` allows us to define static properties and methods. Static methods are very useful for stateless utility methods.

  <pre>
    class Coupon {
      static allowed = ['Pepperoni', 'Blazing Inferno'];
      static create (percentage: number){
         return `DISCOUNT_${percentage}`;
      }
    }
     
  </pre>   
  
#### Rest Operator
- The rest and spread operators can be used in TypeScript to get typed collation of arguments 

  <pre>
    function myFunction(...text: string[]){  //wraps function parameters into an array
      ... 
    }
  </pre>
  
<hr>

# ADVANCED TYPESCRIPT

#### Typing `this`
- In `tsconfig` we can set an option to `noImplicitThis` to avoid a `this` which is not explictly declared and typed 
- The `this` looks like the first argument to the function but in reality it's not
  
  <pre>
    function handleClick(this: HTMLAnchorElement, event: Event){
      event.preventDefault();
      conole.log(this.href);  //this refers to HTMLAnchorElement
    }
    const elem = document.querySelector('.click');
    elem.addEventListener('click', handleClick, false);
  </pre>

#### The `typeof` and `keyof` Operators
- In TypeScript we can use the `typeof` operator perform **type queries**. Meanwhile the `keyof` keyword gives us the keys of an object (literal). 

  <pre>
     const person = {
       name: 'John',
       age: 40
     }
     
     type Person = typeof Person;
     type PersonKeys = keyof Person;
     
     //this will return a union type of string and number
     type PersonTypes = Person[PersonKeys];  
     
     const person: typeof Person = {  //more succinct form 
       name: 'John',
       age: 40
     }
  </pre> 

- We add a new function to the above to demonstrate using `keyof` with generics so that TypeScript will check that the `'name`' does a typesafe lookup type (i.e 'names' would fail) to make sure it exists (these are sometimes called "*index access type*"). Here K is a (generic) subtype of the union type of keys but if we ask for age we would get the number type returned:
  <pre>
     function getProperty<T, K extends keyof T>(obj: T, key K){
       return obj[key];
     }
     
     const personName = getProperty(person, 'name');
  </pre>
  

#### Mapped Types (including Partial, Pick and Record)
- A mapped type its a static way of describing a change that might be occurring (i.e. transforming one type to another)  
- The example below the returned ReadOnly<Person> is a mapped type
  <pre>
     interface Person {
       name: string;
       age: number;
     }
     
     const person: typeof Person = {  //more succinct form 
       name: 'John',
       age: 40
     }
     
     function freeze<T>(obj: T ): ReadOnly<T>{
       return Object.freeze(person);
     }     
     
     //this returns a type of ReadOnly<Person>
     const newPerson = freePerson(person);      
  </pre>     

- We can write out MyReadOnly type which does the same thing as `freeze`:

  <pre>
    type MyReadOnly<T> = {
      readonly [P in keyof T] : T[P];  //P is a placeholder for each key
    };
  </pre>
  
- We can make mapped properties optional (aka partial) using the `?` operator. In the following example we use this to update an object with new partial properties:
  <pre>
    type MyPartial<T> = {
      [P in keyof T]? : T[P];  //P is a placeholder for each key
    };
    
    function updatePerson(personToUpdate: Person, newProperties: MyPartial){
      return {...personToUpdate, ...newProperties };
    };
  </pre>
  
- We can use `+` and `-` to add and remove modifiers such as in the following example:

  <pre>
    interface Person {
      name: string;
      age?: number;
    }
    
    type MyOptional<T> = {
      [P in keyof T]-? : T[P];  //Here we are removing any ? modifiers
    };
    
    type MyOptional<T> = {
      +readonly [P in keyof T] : T[P];  //Here we are adding the readonly modifier
    };
  </pre>

- We can use pick mapped type (similar [Lodash's](https://lodash.com/) `pluck`) to pick an object's properties:

   <pre>
    interface Person {
      name: string;
      age: number;
    }
    
    type MyPick<T, K extends keyof T> = {
      [P in K] : T[P];  
    };
    
    const personProperties: MyPick<Person, 'name' | 'age'> = {    //TS compiler ensures these keys exist
      name: 'John',
      age: 40
    }   
  </pre>
  
- The `Record` mapped type is used for the dictionary pattern to flatten objects

  <pre>
    let dictionary: Record<string, typeof item> = {}  //We could substitute TrackStates for type of item 
    
    interface TrackStates{
      current: string;
      next: string;
    }   
    
    //Here, keyof TrackStates returns union of 'current' and 'next'
    const item: Record< keyof TrackStates ,string> = {  
      current: '78hhjkj',
      next: '9898jjk',  //some hash
    }   
  </pre>
  
#### `typeof` and Type Guards
- We could use `typeof` inside a function to check for types and smart cast it such as in this very simple example:

  <pre>
    function foo(bar : string | number){
      if(typeof bar === 'string'){
         bar.toUpperCase();  //will now have string methods
      } else{
         bar.toFixed(2);     //will now have number methods
      }
    }
  </pre>
  
- Here is more fleshed-out example:

  <pre>
    class Song{
      constructor(public title: string, public duration: string | number){}
    }
    
    function getSongDuration(item: Song){
      if(typeof item.duration === 'string'){
        return item.duration;
      } 
      const {duration} = item;
      const mins = Math.floor(duration / 60000);
      const seconds = (duration / 1000) % 60;
      return `${mins}:${seconds}`;
    }
    
    const songDurationFromString = getSongDuration('My Song','3:35');
    const songDurationFromMillis = getSongDuration('My Longer Song', 33000);
  </pre>
  
#### Using `instanceof`
- In TypeScript we can use `bar instanceof foo` which is equivalent of JS(ES5) `Object.getPrototype(foo) === Bar.prototype`

  <pre>
    class Song{
      constructor(public title: string, public songs: Song[]){}
    }  
    
    function getName(item: Song | Playlist){
      if(item instanceof Song){
        return item.title;  //TypeScript has done a smart cast
      }
      return item.name;
    }
  </pre>
  
- We can introduce user-defined typeguards using the keyword `is` so rather than using `instanceof` returning a boolean to check a type we can do the following:

  <pre>
    //only works if function returns a boolean but then it supplies type information
    function isSong(item: any): item is Song {   
       return item instanceof Song;
    } 
    
    function getName(item: Song | Playlist){
      if(isSong(item)){
        return item.title;  //TypeScript has done a smart cast
      }
      return item.name;
    }
  </pre>
  
- We can also use keyword `in` to check if a property exists in an object

  <pre>
    function hasTitle(item: any): item is Song {   
       return 'title' in item;
    }
  </pre>   

  
#### Advanced Types

- We can use **Intersection Types** which under the hood uses ES5's `Object.assign()`

  <pre>
    interface Order{
      id: string;
      amount: number;
      currency: string;
    }
    
    interface Stripe {
      card: string;
      cvc: number;
    }
    
    type CheckoutCard = Order & Stripe;
    type CheckoutPayPal = Order & { email: string}; //here we specify the object must have an email

    const order : Order = {
      id = 'P8989',
      amount: 100,
      currency: 'USD'
    }
    
    //Under the hood this does Object.assign({},order, orderCard);
    const orderCard : CheckoutCard = {
      order...,
      card: '4929100020003000',
      cvc: '123'
    }
    
    const orderPayPal : CheckoutPayPal = {
        order...,
        email: 'john@gmail.com'
     }    
  </pre>

- We can use **Discriminated (Tagged) Union** with one *common property between interfaces*. In this example we use a property of `type`:

  <pre>
    interface Stripe {
      type: 'stripe',
      card: string;
      cvc: number;
    }
    
    interface PayPal {
      type: 'paypal',
      email: string
    }
    
    type Payload =  CheckoutCard | CheckoutPayPal;
    
    function checkout(payload: Payload){
      if(payload.type === 'stripe){
         //payload is now inferred as of type Stripe
      }
    }
  </pre>    
    
#### Interfaces, Classes and  Type Aliases
- We can extend interface using keyword `extends` but we can't do this with a `type` declaration although we can use union types. Interface is preferred as it gives more flexibility (e.g. merging declarations because we can have 2 interfaces of the same name but not 2 diferent types)    

  <pre>
    interface Item {
      name: string;
    }
    
    interface Artist extends Item {
      songs: number;
    }
    
    type ArtistType = { name: string } & Item; 
  </pre>
  
- Because we cannot instantiate an interface sometimes we prefer to uses classes to give type definition such as in this factory method example:

  <pre>
    class Artist {
      constructor(public name: string){}
    }
    
    function artistFactory({ name }: Artist){
      return new Artist(name);
    }
    
    artistFactory({ name: 'Prince'});
  </pre>
  
#### Generics And Function Overloads
- In TypeScript can define Generics with angled brackets `< >` to attribute a generic type to a class

  <pre>
    class MyList<T>{
       private list: T[];
       
       addItem(item: T){
         this.list.push(item);
       }
       
       getList(): T[]{
         return this.item;
       }
    }
    
    const pizzas = new MyList<Pizza>();
  </pre>
  
- A **function overload** allows to define what argument types are taken by a function and the return type:

  <pre>
    //function overloads are virtual and not real functions
    function reverse(s: string) : string;  
    function reverse<T>(a: T[]) : T[];
    
    //this is our real function which provides the implementation
    function reverse<T>(stringOrArray: string | T[]) : string : T[] {
      if(typeof stringOrArray === 'string'){
         return stringOrArray.split('').reverse().join('');
      }
      //call splice to make sure we don't mutate original array
      return stringOrArray.splice().reverse();  
    }
  </pre>