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
  
- **Tuples** can also be type  