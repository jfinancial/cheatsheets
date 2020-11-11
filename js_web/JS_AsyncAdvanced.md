
## ASYNCHRONOUS JS

### The Event Loop
- JS a single threaded, event driven, asynchronous programming language. The browser has a JS runtime (e.g. Chome's [V8](https://v8.dev/)) but also other parts such as [WebAPIs](https://developer.mozilla.org/en-US/docs/Web/API) (e.g. `XMLHttpRequest`, JSON engine) but JS is single-threaded and handles asynchronous operations through the [Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) (which is really 4 parts → heap, stack, event queue and the main Event Loop). 
- When a function makes an asynchronous operation, it puts an event handler into the heap. When the async operation completes, the event is pushed to the event queue. The event loop polls the queue, continually checking whether the call stack is empty and so where completed calls can be *pushed* on to the stack – see `setTimeOut` and specifically `setTimeOut(0)`
  
  <pre>
    setTimeout(function() { 
      console.log('AAA');
    }, 0);
  </pre>
  
- The JavaScript engine has a single call stack. The event loop stack (which is a traditional call stack) keeps track of the currently executing function and what function is to be executed after. (Functions held in the stack are called **frames**; event loop takes a FIFO approach so function frames are added and removed only from the top of the stack.)
- The (FIFO message) Queue is used to track asynchronous event completions. Each message in the queue has an associated function which gets called when the message is handled. Handling a message means it's removed from queue and its corresponding function is called with the message's data as its input parameters and a new stack frame is created when the function is called. Three things to consider:
  -   Events come back out of sync (and we must account for this with callbacks and promises)
  -   Synchronous code is blocking
  -   Zero-delay functions do not actually execute after 0 milliseconds (because the event queue may have many messages to process)

<hr>

### Callbacks  
  
- [Callbacks](https://www.w3schools.com/js/js_callback.asp) (most basic form of JS asynchronous programming) is a function that gets called after another function completes. Callbacks are used to handle the response of an asynchronous function call. In JS, functions are treated like objects (i.e.can be passed as arguments, returned by functions, and saved into variables.) So callback is a function object that is passed as an argument into a higher order function. Once the higher order finishes doing some form of work, such as an HTTP request or database call, it calls the callback function with the error or return values.A callback function should take in at least two arguments: error and result. A callback may take in as many arguments as needed or specified by the higher order function, but the *first argument must be the error object *(which in most cases is an instance of the Error class but there's no convention for the contents of the error object.)If the higher order function does NOT encounter an error, the error parameter should be set to null. (Some third-party APIs may return a **falsy** value that is not null, but this is discouraged because it can makes error handling more complicated.)
- Result argument of a callback contains the evaluated result of the higher order function. (e.g. an HTTP response, db query). Some APIs also may provide more detailed error information in the result field when an error is returned so it's *important to not assume a function completed successfully if the result object is present*. You must check the error field; if error argument is not null or undefined, then we must handle the error in some way.

  <pre>
    TwitterAPI.listFollowers( 
      { user_id: "example_user" }, (err, result) => { 
          if ( err ) { // HANDLE ERROR } 
          console.log( err, result );
    });
  </pre>
  
- Checking if `err` is truthy then executing error handling is the lazy way of coding (i.e. error object could be the Boolean false, the number 0, the empty string which all evaluate to falsy, even though the value is not null or undefined):
- If you are using an API, check that it will not return an error that evaluates to falsy
- If you are building an API, don't ever return an error that could evaluate to falsy

 #### Callback Pitfalls

  - **'Callback Hell'** : This occurs after work completes and a callback is called, the callback function can then call another asynchronous function to do more asynchronous work and on and on.  This can be avoided with two tricks: *modules* and *named functions* (i.e. define the callback and assign it to an variable) so the defined callback functions can be kept in the same file or put into a module and imported. Using named functions in callbacks will help prevent callback nesting from cluttering your code.
  
  - **'Non-existence of callback'**: When writing an API, we must consider the possibility that the user of the API might not pass a valid callback function into the API. If intended callback is not a function or does not exist, then trying to call it will cause a runtime error so *good practice to validate that a callback exists and that it is a function* before attempting to call it; if the user passes in an invalid callback, then we can fail gracefully:

  <pre>
    function apiFunction( args, callback ){ 
       if ( !callback || !( typeof callback === "function" ) ){ 
         throw new Error( "Invalid callback. Provide a function." );
       } 
    } 
    
    let result = {}; 
    
    let err = null; 
    
    // Do work 
    // Set err and result 
    callback( err, result ); 
  </pre>

<hr>

## Promises

- In JS, a **promise** is an object that wraps an asynchronous operation and notifies the program when the asynchronous operation completes. A promise represents the eventual completion or failure of the wrapped operation and is a proxy for a value not necessarily known. Instead of providing the value immediately (synchronous). it promises to provide a value at some point in the future. Promises allow you to associate success and error handlers with an asynchronous action. These handlers are called at the completion or failure of the wrapped asynchronous process.

- **Promise States**: a promise can only succeed with a value or fail with an error once. The state of a promise defines where the promise is in its work towards the resolution of a value. A promise comes in three states:
  -   **Pending** is the state the promises starts in and async operation being done inside the promise is not complete.
  -   **Fulfilled** means a value is available (i.e value generated by the async operation has been returned and can be used)
  -   **Rejected** means the async operation has completed with an error so no future work will be done and no value will be provided. The error from the asynchronous operation has been returned and can be referenced from the promise object.

- **Resolving or Rejecting a Promise**: promise created via new instance of Promise which accepts a single argument (a function and this function must have two arguments:`resolve` and `reject`.)

<pre>
  const myPromise1 = new Promise( ( resolve, reject ) => 
     { setTimeout( () => { resolve( 'Done!' ) }, 1000 ) 
   } ); 
   
   const myPromise2 = new Promise( ( resolve, reject ) => { 
	  // Do asynchronous work here 
      reject( new Error( 'Oh no! Promise was rejected' ) ); 
   });
</pre>

#### Using Promises

- The promise class has 3 member functions (promise handlers) used to handle promise fulfillment and rejection and these are `then()`, `catch()`, and `finally()`. When a promise completes, one of the handler functions is called.

  - If the promise fulfills, the `then()` function is called.
  
  - If the promise is rejected, either the `catch()` function is called, or the `then()` function with a rejection handler is called.
  - The `then()` member function is designed to handle and get the promise fulfillment or rejection result. The then function takes in two function arguments, a fulfillment callback and a rejection callback. This is shown in the following example: 

  <pre>
    // Resolve the promise with a value or reject with an error 
    myPromise.then( 
      (result) => { /* handle result */ },   //Promise fulfilled  
      (err) => { /* handle error here */ }   //Promise rejected 
    );
  </pre>  

- The first argument in the `then()` function is the promise **fulfillment handler**. If the promise is fulfilled with a value, the promise fulfillment handler callback is called. The promise fulfillment handler takes one argument. The value of this argument will be the value passed in to the fulfilled callback in the promise function body.:

  <pre>
    // Resolve the promise with a value 
    const myPromise = new Promise( (resolve,reject) => { 
      resolve( 'Promise was resolved!' ); // Do asynchronous work here 
     } );
     myPromise.then(value => console.log(value)); 	//'Promise was resolved' 
  </pre>
  
- The second argument in the `then()` function is the promise **rejection handler**. If the promise is rejected with an error, the promise rejection handler callback is called. The promise rejection handler takes one argument. The value of this argument is the value passed in to the reject callback in the promise function body. An example of this is shown in the following snippet:

  <pre>
     // Reject the promise with a value 
     const myPromise = new Promise( (resolve,reject) => { 
   	   reject( new Error ('Promise was rejected!'));  // Do asynchronous work here 
     }); 
     myPromise.then( () => {}, error => console.log( error) ); 
  </pre>

#### Handling Promises
- When **Promise.then()** is called, it returns a new promise in the pending state. After the promise handler for fulfilled or rejected has been called, the handlers in `Promise.then()` get called asynchronously. When the handler called from `Promise.then()` returns a value, that value is used to resolve or reject the promise returned by promise.then(). The following table provides the action taken if the handler function returns a value, an error, or a promise at any stage:

  |Handler return function          |Action taken                                                                                                                                                                                          |
  |---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  |Returns a value                  |The promise returned by `promise.then()` is resolved with the value returned by the handler function                                                                      |
  |Throws an error                  |The promise returned by `promise.then()` is rejected, with the thrown error as its value                                                                                  |
  |Returns a resolved promise       |The promise returned by `promise.then()` gets resolved with the handler function's returned promise's resolution value                                                    |
  |Returns a rejected promise       |The promise returned by `promise.then()` gets rejected with the handler function's returned promise's rejection value                                                     |
  |Returns a pending promise        |The resolution or rejection of the promise returned by `promise.then()` will be subsequent to the rejection or resolution of the promise returned by the handler function | 
  
- **Promise.catch()** takes one argument, a handler function, to handle the promise rejection value. When `Promise.catch()` is called, internally it calls `Promise.then( undefined, rejectHandler )`. So internally, the `Promise.then()` handler is called with only the promise rejection callback, rejectHandler, and no promise fulfillment callback. `Promise.catch()` returns the value of the internal `Promise.then()` call:
  <pre>
    const myPromise = new Promise( ( resolve, reject ) => { 
 	     reject( new Error 'Promise was resolved!' ); 
    });
    
    myPromise.catch( err => console.log( err ) );
  </pre>
  
- **Promise.finally()** is a promise handler to catch **all promise completion cases** so is called for both promise rejections and resolutions. It takes a single function argument that is called when the promise is rejected or fulfilled. (It provides us with a catch all handler to handle either fulfillment case.) It should be used to avoid duplication of code between then and catch handlers. The function passed to `Promise.finally()` does not take in any arguments, so any value passed in to a promise's resolution or rejection will be ignored. Because there is no way to reliably distinguish between a rejection and a fulfillment then this should only be used when we do not care if the promise has been rejected or fulfilled:
  <pre>
    // Resolve the promise with a value
    const myPromise = new Promise( ( resolve, reject ) = {
       resolve( 'Promise was resolved!' );
    });
    
    myPromse.finally(
      value =; { console.log('Finally!');}
    );
    
    // Expected output: Finally
  </pre>
  
- Sometimes we may want to create a promise that is already in the fulfilled state and there's 2 static member functions to do this:
   - **Promise.reject()** takes a single argument and returns a promise that has been rejected with the value passed in to the reject function.
  
   - **Promise.resolve()** takes in a single argument and returns a promise that has been resolved with the value passed in to resolve:

  <pre>
     Promise.resolve( 'Resolve value!' ).then( console.log );
     Promise.reject( 'Reject value!' ).catch( console.log );
     //Expected output:
     // Resolve value!
     // Reject value!
  </pre>
  
#### Promise Chaining
  
-  **Promise Chaining** is used when promise body needs to do more async work after the value is obtained. Nested promise calls can get difficult to follow so to avoid ***promise hell***, we can chain promises. Promise.then(), Promise.catch(), and Promise.finally() all return promises so we can tack on another then handler to this promise and make a promise chain to handle the newly returned promise
-  Here `apiCall1()` and `apiCall2()` return a promise that does more asynchronous work. When  `myPromise` (the original promise) completes, the `Promise.then()` handler calls `apiCall1()`, which returns another promise. The second Promise.then() handler is applied to this newly returned promise. When the promise returned by `apiCall1()` is resolved, the handler function calls `apiCall2()`, which also returns a promise. When the promise returned by `apiCall2()` is returned, the final Promise.then() handler is called. (If these handler functions with asynchronous work were nested, it could get very difficult to follow the program.) By chaining promises, it is possible for the promise handler to return a value instead of a new promise. If a value is returned, the value gets passed as an input to the next Promise.then() handler in the chain allowing you to embed synchronous steps into the promise chain.

  <pre>
    function apiCall1( result ) {
       // Function that returns a promise return
       new Promise( ( resolve, reject ) => {  resolve( 'value1' ); });
    }
    
    function apiCall2( result ) {
      // Function that returns a promise
      return new Promise( ( resolve, reject ) => { resolve( 'value2' );}} ); 
    };
    
    myPromise.then(apiCall1).then(apiCall2).then(
  	  result => console.log('done!')  
    );
  </pre>

- When chaining, we must be careful with **catch handlers**.

  -  When a promise is rejected, it jumps to the next promise rejection handler (which can be the second argument in a then/catch handler.) All handlers between where the promise is rejected, and the next rejection handlers, will be ignored.
  -  When the catch handler completes, the promise returned by catch() will be fulfilled with the returned value of the rejection handler, therefore, the following promise fulfillment handler will be given a value to run with. If the catch handler is not the last handler in the promise chain, the promise chain will continue to run with the returned value of the catch handler. This can be a tricky error to debug; however, it allows us to catch a promise rejection, handle the error in a specific way, and continue with the promise chain. It allows the promise chain to handle a reject or accept in different ways, then continue with the async work.

- Here's a promise chain with 3 async calls after the resolution of myPromise. The first API call will reject the promise with an error, the rejected promise is handled by the second then handler (which is errorHandler2 and so ignores apiCall2). So errrorHandler1 does some work and returns a value or promise which is passed to apiCall3 which return a resolved promise:

  <pre>
     // Promise chain handles rejection and continues
     //apiCall1 is a funciton that returns a rejected promise 
     //apiCall2 is a function that returns a resolved promise 
     //apiCall3 is a function that returns  a resolved promise
     //errrorHandler1 is a function that returns a resolved promise 
     
     myPromise.then(apiCall1)
           .then(apiCall2, errorHandler1)
           .then(apiCall3)
           .catch(errorHandler2);
 </pre>

- To skip one rejection handler to the next handler, we need to throw an error inside the rejection handler function. This will cause the returned promise to be rejected with the error thrown and skip to the next catch handler. If we wish to exit the promise chain early and not continue when a promise is rejected, you should only include a single catch handler at the end of the chain. When a promise is rejected, the rejection is handled by the first handler found. If this handler is the last handler in the promise chain, the chain ends. Here p1 is resolved with a value and then first then hander is called. Here, apiCall1() is called an it returns a rejected promise. But the next two handlers do not have an argument to handle the promise rejection so the rejection is passed to the catch handler. The catch handler calls errorHandler1 and then and then promise chain ends:

  <pre>
     //Promise chain handles rejection and continues
     //apiCall1 returns a rejected promise
     
     p1.then(apiCall1)
       .then(apiCall2)
       .then(apiCall3)
       .catch(errorHandler1);
  </pre>

- Chaining promises ensures all promises complete in the order of the chain. If promises need not be competed in order we can use `Promise.all()` function, (a static class function) which takes an array of promises and when all have been resolved then handler is called. The then handler function's parameter will be the array with the resolve value of each promise and these will be in the original order (i.e. not completion order.) If one or more promises are rejected then reject handler will be called with the rejection value of the first promise; all other promises will complete but rejection/resolutions of these not call any then/catch:
  <pre>
    let p1 = new Promise( (resolve,reject) => {
  	  setTimeout( () => { reject('Error 1'); }, 100}; 
    });
    
    let p2 = new Promise( (resolve,reject) => {
  	  setTimeout( () => { reject('Error 2'); }, 200}; 
    });
    
    let p3 = new Promise( (resolve,reject) => {
  	  setTimeout( () => { reject('Error 3'); }, 10}; 
    });
   
   Promise.all([p1,p2,p3]).then(console.log).catch(console.log);
   
   //Expected output: Error: Error 3
  </pre>
  
- `Promise.race()` handles only the first promise fulfilled or rejected (so is ideal where there's an intentional race condition but the response handler should only be called once.) It takes an array of promises but `Promise.race()` only calls fulfilment handler for first promise completed (and then proceeds with chain) as normal (so results from other promises in the array are discarded.) Promise rejection handling with `race()` works same way as `all()` but  only first rejected promise is handled:
  <pre>
      let p1 = new Promise( (resolve,reject) => {
        setTimeout( () => { resolve(10); }, 100}; 
      });
      
      let p2 = new Promise( (resolve,reject) => {
        setTimeout( () => { resolve(20); }, 200}; 
      });
      
      let p3 = new Promise( (resolve,reject) => {
        setTimeout( () => { resolve(30); }, 10}; //shortest timeout 
      });
      
      Promise.race([p1,p2,p3]).then(result => console.log(result));
      //Expected output: 30
  </pre>

- **Promises & Callbacks should never never be mixed together** as things can get very complicated and extremely difficult to debug. To avoid mixing callback logic and promise, we must add *shims* \[i.e. a code file used to add missing functionality to a codebase (e.g. ensure cross-browser compatability)] to ensure our code to handle callbacks are promises and promises as callbacks.

- **Wrapping Promises In Callbacks** means simply creating a wrapper function that takes the promise function, the arguments, and a callback. Inside the wrapper, we call the promise function and pass in the provided arguments and attach then and catch handlers. When these handlers resolve, we call the callback function with the result /error returned by the promise. Here we call the callback with the result of promise. If promise is resolved with value then we pass it with error set to null; if rejected pass the error into callback with null result.

  <pre>
    // Promise function to be wrapped 
    function promiseFn( args ){ 
      return new Promise( ( resolve, reject ) => {  /* resolve or reject */ } );
    }

    // Wrapper function 
    function wrapper( promiseFn, args, callback){  
       promiseFn( args )
         .then( value =>  callback( null, value )
         .catch( err => callback( err, null ); 
    }
  </pre>

- **Wrapping Callback-based Function In A Promise** means simply creating a wrapper function that takes the function to wrap and the function arguments. Inside the wrapper function, we call the function being wrapped inside a new promise. When the callback returns a result or error, we reject the promise (if there's an error), or we resolve the promise (if there's no error):
  <pre>
    // Promise function to be wrapped 
    function wrappedFn( args, cb ){ 
      /* do work */ 
      /* resolve or reject */);
    }
      
    // Promise function to be wrapped 
    function wrapper( wrappedFn, args ){ 
      return new Promise( (resolve, reject) => {
         wrappedFn(args, (err, result) => {
            if(err){
              return reject(err);
            } 			
            resolve(result);
            });
        });
    }
  </pre>

Since this function returns a promise, it can be embedded in a promise chain or can have a then/catch handler attached to it.

<hr/>

### Async & Await

- The `async` keyword is added to a function declaration and `await` used inside and allows us to write promise-based asynchronous code that looks almost identical to synchronous code. An `async` function implicit returns a promise no matter what the return type is declared as. 
- The `await` keyword can only be used inside of an `async` function and tells JS to wait until the associated promise settles and returns its result so execution of that block of code pauses, waits for the promise to be resolved while doing other async work, then resumes that block of code once the promise settles. So awaited block of code runs like a synchronous function, (but it does not cost any resources because it is not blocking even though async/await functionality makes JavaScript code look and act as if it were.)

- Inside the following `async` function, we create a promise that does asynchronous work: it waits 100 ms and then resolves the promise. We then await the created promise: when promise is resolved, the await takes the value and returns it, and it is saved in the variable result. Instead of using a handler on the promise to get the resolution, we simply await the value:
 
  <pre>
     async function awaitExample( /* arguments */ ){
  	   let promise = new Promise( ( resolve, reject ) => {
  		 setTimeout( () => resolve( 'done!'), 100 ); 
  	  }); 
  	  const result = await promise; 
  	  console.log(result)
     }
     awaitExample( /* arguments */)
 
  </pre>
  
- **How to handle promise rejection with async?** Error rejection with async/await is very simple. If a promise is rejected, the await statement waiting for that promise resolution throws an error. When an error is thrown inside an async function, it is caught automatically by the JavaScript engine and the promise returned by the async function is rejected with that error:

    <pre>
        async function errorExample1( /* arguments */ ){
             return Promise.reject('Rejected');
        }
        async function errorExample2( /* arguments */ ){
             throw 'Rejected';
        }
        async function errorExample3( /* arguments */ ){
             await Promise.reject('Rejected');
        }
        
        //we return a promise that is rejected with the string Rejected!
        errorExample1().catch( console.log ); // Expected output: Rejected!
        
        //error thrown inside an async function, the async function wraps it in 
        //a promise and returns a promise rejected with the thrown value
        errorExample2().catch( console.log ); // Expected output: Rejected!
        
        //await rejected promise causing JS to throw the promise rejection value;
        //the aync function the error thrown with this value, wraps it in a //promise, rejects promise with that value and returns rejected promise  
        errorExample3().catch( console.log ); // Expected output: Rejected! 
    </pre>  

- Since await throws an error if the awaited promise is rejected, we can use standard `try/catch` mechanism to handle the async errors allowing us to handle all errors in the same manner, whether asynchronous or synchronous. Here an async function tries to await three promises in a row. The final one is rejected, which causes an error to be thrown. This error is caught and handled by the catch block. :

    <pre>
        async function tryCatchExample() { 
          // Try to do asynchronous work
          try { 
             const value1 = await Promise.resolve( 'Success 1' ); 
             const value2 = await Promise.resolve( 'Success 2' ); 
             const value3 = await Promise.reject( 'Oh no!' ); 
          } catch( err ) { 
            console.log( err ); // Expected output: Oh no! 
          }	
        }
        
        tryCatchExample()
    </pre>

- In following example,several `async` functions that await the result of another async function. They are called in the order. 
  - The body of `nested1()` awaits a rejected promise, which throws an error, `nested1()` catches this error and returns a promise rejected with that error. 
  - The body of `nested2()` awaits the promise returned by nested1(). The promise returned by `nested1()` was rejected with the original error, so the await in `nested2()` throws an error wrapped in a promise by `nested2()` propagating down until the await in `nestedErrorExample()`.
  - The await in the nested error example throws an error, which is caught and handled. Since we only need to handle the error at the highest level, we put the `try/catch` block at the outermost await call and allow the error to propagate upward until it hits that `try/catch` block.
  
    <pre>
        async function nested1() { 
            return await Promise.reject( 'Error!' ); 
        } 
        async function nested2() { 
            return await nested1; 
        } 
        async function nested3() { 
            return await nested2; 
        }
        
        async function nestedErrorExample() { 
            try{ 
              const value1 = await nested3; 
            } catch( err ){ 
              console.log( err ); 
            } // Expected output: Oh no!
        }
    </pre>  

= In order to **convert our `Promise` code to user Async/Await** we simply break the promise chains into async functions and await each step.
  - The chain of promise handlers is separated at each handler function (`then()`, `catch()`, and so on). 
  - The value returned by the promise is caught with an `await` statement and saved into a variable which is then passed into the callback function of the first promise `then()` promise handler, and the result of the function should be caught with an `await` statement and saved into a new variable. This is done for each `then()` handler in the promise chain. 
  - To handle the errors and promise rejections, we surround the entire block with a try catch block.
- In this promise chain, we chain three API calls and an error handler on to the resolution of myPromise. At each promise chain step, a promise is returned and a new `Promise.then()` handler is attached:

    <pre>
        // Promise chain - API functions return a promise myPromse.then(apiCall1).then(apiCall2).then(apiCall3).catch(errHandler); 
        async function asyncAwaitUse( myPromise ) {
            try{ 
               const value1 = await myPromise; 
               const value2 = await apiCall1( value1 ); 
               const value3 = await apiCall2( value2 ); 
               const value4 = await apiCall3( value3 ); 
            } catch( err ){ 
               errHandler( err ); 
            } 
        } 
        asyncAwaitUse( myPromise ); 
    </pre>

- If one of the promise chain steps is rejected, the catch handler is called. In the `async/await` example, we break the promise chain at each `Promise.then()` handler. We then convert the then handlers into functions that return promises. In this case, apiCall1(), apiCall2(), and apiCall3() already return promises. We then await each API call step and handle promise rejection with a surrounding `try/catch`.
- As with promise chains with multiple chained then handlers, an `async` function with multiple await calls will run each await call one at a time, not starting the next await call until the previous await call has received a value from the associated promise. This can slow down asynchronous work if we are trying to complete several asynchronous tasks at the same time. We must wait for each step to complete before starting the next step. To avoid this, we can use `Promise.all` with await.

    <pre>
        async function awaitPromiseAll() {
           let p1 = new Promise((resolve,reject) =>
                    setTimeout( () => resolve(10),100));
           let p2 = new Promise((resolve,reject) =>
                    setTimeout( () => resolve(20),200));
           let p3 = new Promise((resolve,reject) =>
                    setTimeout( () => resolve(30),10));   
           const result = await Promise.all([p1,p2,p3]);
           console.log(result); //Expected output: 10, 20, 30
        }
        
        awaitPromiseAll(); 
    </pre>

- We can also use `Promise.race()` to get first returned result:

    <pre>
        async function awaitPromiseAll() {
           let p1 = new Promise((resolve,reject) =>
                    setTimeout( () => resolve(10),100));
           let p2 = new Promise((resolve,reject) =>
                    setTimeout( () => resolve(20),200));
           const result = await Promise.race([p1,p2]);
           console.log(result);  // Expected output 10
        } 
        awaitPromiseAll();
    </pre>
