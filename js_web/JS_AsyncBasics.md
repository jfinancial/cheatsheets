## Basic Asynchronous Javascrip

### Asynchronous Javascript Libaries
  | Name                                                                     | Description                                            |
  | -------------------------------------------------------------------------|--------------------------------------------------------|
  | [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)  | Fetch API for interacting with REST endpoints          |
  | [Axios](https://github.com/axios/axios)                                  | Promise based HTTP client for the browser and node.js  |
  | [SuperAgent](https://visionmedia.github.io/superagent/)                  | Super light-weight progressive ajax API                |


<hr>

#### XMLHttpRequest With Text File
- `XMLHttpRequest` (XHR) objects are used to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing. XMLHttpRequest is used heavily in AJAX programming.

- The ready state values are:
0. Request not initialized 
1. Server connection established
2. Request received 
3. Processing request 
4. Request finished and response is ready 

  <pre>
      document.getElementById('button').addEventListener('click', loadData);
      
      function loadData() {
        const xhr = new XMLHttpRequest(); // Create an XHR Object
        xhr.open('GET', 'data.txt', true); // Make a GET request for data.txt and async=true
        xhr.onprogress = function(){   // Optional - Used for spinners/loaders
          console.log('READYSTATE', xhr.readyState);
        }
        xhr.onload = function(){
          console.log('READYSTATE', xhr.readyState);
          if(this.status === 200) {
            document.getElementById('output').innerHTML = `&lt;h1&gt;${this.responseText}&lt;/h1&gt;`;
          }
        }
        xhr.onreadystatechange = function() {
           console.log('READYSTATE', xhr.readyState);
           if(this.status === 200 && this.readyState === 4){
             console.log(this.responseText);
           }
        }
        xhr.onerror = function() {
          console.log('Request error...');
        }
        xhr.send();
      }
  </pre>


#### XMLHttpRequest With JSON

- Uses the following customers.json (array): `
[
  {
    "id": 1,
    "name": "John Doe",
    "company": "123 Designs",
    "phone": "444-555-6666"
  },
  {
    "id": 2,
    "name": "Steve Smith",
    "company": "Hello Productions",
    "phone": "333-222-2222"
  },
  {
    "id": 3,
    "name": "Tara Williams",
    "company": "Traversy Media",
    "phone": "111-222-3333"
  }
]

  <pre>
    document.getElementById('button2').addEventListener('click', loadCustomers); 
    
    // Load Customers
    function loadCustomers(e) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'customers.json', true);
        xhr.onload = function(){
          if (this.status === 200) {
            const customers = JSON.parse(this.responseText);  //parse the JSON string in the response
            let output = '';
            customers.forEach(function(customer){
              output += `
              &lt; ul&gt;
                &lt;li&gt;ID: ${customer.id}&lt;/li&gt;
                &lt;li&gt;Name: ${customer.name}&lt;/li&gt;
                &lt;li&gt;Company: ${customer.company}&lt;/li&gt;
                &lt;li&gt;Phone: ${customer.phone}&lt;/li&gt;
              &lt;/ ul&gt;
              `;
            });
            document.getElementById('customers').innerHTML = output;
          }
        }
        xr.send();
    }
  </pre>

#### Using XMLHttpRequest to Call an External API
- This uses [ICNDB](http://www.icndb.com/) (Internet Chuck Norris Database) as an example of a call to an external Rest API
  
  <pre>
      function getJokes(e, numOfJokes) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://api.icndb.com/jokes/random/${numOfJokes}`, true);
        xhr.onload = function() {
          if(this.status === 200) {
            const response = JSON.parse(this.responseText);
            let output = '';
            if(response.type === 'success') {
              response.value.forEach(console.log(joke));
            } else {
              console.log('Something went wrong')
            }
          }
        }
        xhr.send();
      }
  </pre>  
  
### XmlHttpRequest with Callbacks (easyHttp)
- We can write our own library to simplify making XMLHttpRequests using callbacks [`easthttp.js`](js_async_examples/easyhttp.js). Here's the implementation for Http `POST`
 
 <pre>    
     easyHTTP.prototype.post = function(url, data, callback) {
       this.http.open('POST', url, true); // Make an async HTTP POST Request
       this.http.setRequestHeader('Content-type', 'application/json');
       //we do this because function doesn't have a this (fixed in arrow functions which proivide a lexical this)
       let self = this;  
       this.http.onload = function() {
         //we pass in the response text to the callback so it only populates once the response returns
         callback(null, self.http.responseText);  
       }
       this.http.send(JSON.stringify(data));
     }
 </pre>
 
 - The `easyhttp.js` library also implements other HTTP methods
 
  <pre>
      const http = new easyHTTP;
 
      http.get('https://jsonplaceholder.typicode.com/posts', function(err, posts) {
         if(err) {  console.log(err); } else { console.log(posts); }
      });
      
      const data = { title: 'Custom Post', body: 'This is a custom post' };
      
      http.post('https://jsonplaceholder.typicode.com/posts', data, function(err, post) {    // Create Post
        if(err) {  console.log(err); } else { console.log(post); }
      });
      
      http.put('https://jsonplaceholder.typicode.com/posts/5', data, function(err, post) {   // Update Post
        if(err) {  console.log(err); } else { console.log(posts); }
      });
      
      http.delete('https://jsonplaceholder.typicode.com/posts/1', function(err, response) {  // Delete Post
        if(err) {  console.log(err); } else { console.log(posts); }
      });
    </pre>
    
#### Promises

- Promises are an alternative to callbacks and you just create a new `Promise` taking a function with `resolve` and `reject` parameters:
- In this example `createPost` returns a `Promise` so when we call it we use then to call `getPosts` which replaces the callback
  <pre>
      function createPost(post) {
        return new Promise(function(resolve, reject){ //crete the promise
          setTimeout(function() {
            posts.push(post);
            const error = false;
            if(!error) {
              resolve();
            } else {
              reject('Error: Something went wrong');
            }
          }, 2000);
        });
      }
      
      function getPosts() {
        setTimeout(function() {
          let output = '';
          posts.forEach(function(post){
            output += `&lt;li&gt;${post.title}&lt;li&gt;`;
          });
          document.body.innerHTML = output;
        }, 1000);
      }
      
      //here createPost returns a Promise so we use the then/catch sytnax
      createPost({title: 'Post Three', body: 'This is post three'})
      .then(getPosts)
      .catch(function(err) {
        console.log(err);
      });
  </pre>
#### Arrow Functions (`=>`))

- Arrow functions provide a more concise way of defining functions
  
  <pre>
      const sayHelloES6 = function() {
        console.log('Hello');
      }
      
      const sayHelloES6 = () => {
        console.log('Hello');
      }
      
      // One line function does not need braces
      const sayHelloOnOneLine = () => console.log('Hello');
      
      // One line returns
      const sayHello = () => 'Hello';      
  </pre>
  
- Be careful when using object literals because the literal needs to wrapped in brackets otherwise it gets interpreted as a function body:
  
  <pre>
      const sayHello = () => ({ msg: 'Hello' }); // Return object - note double brackets!
      
      // Single param does not need parenthesis
      const sayHello = name => console.log(`Hello ${name}`);
      
      // Multuiple params need parenthesis
      const sayHello = (firstName, lastName) => console.log(`Hello ${firstName} ${lastName}`);
      sayHello('John', 'Smith');
      
      const users = ['Nathan', 'John', 'William'];
      const nameLengths = users.map(name => name.length);
      
  </pre>
  
#### Using the Fetch API (using Arrow functions (ES6))
- Fetch provides a more modern approach to working with APIs
- **Gotcha!** Error handling with Fetch API is not like Axios or jQuery. *If there is an http error, it will not fire off .catch automatically. You have to check the response and throw an error yourself.* 
  
  <pre>
    function handleErrors(res) {
      if (!res.ok) throw new Error(res.error);
      return res;
    }  
  </pre>  
  
 - Example of using Fetch for Http GET 
 
   <pre>
      // Make an HTTP GET Request 
      get(url) {
        return new Promise((resolve, reject) => {
          fetch(url)
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err));
        });
      }
  </pre>
  
 - Example of using Fetch for Http POST

  <pre>
      // Make an HTTP POST Request
      post(url, data) {
        return new Promise((resolve, reject) => {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err));
        });
      }
   </pre>

#### Async and Await (ES7)
- Using` async` means the result of a function *automatically gets wrapped in a* `Promise`:
- The` await` keyword means execution waits for the promise to be resolved 
  <pre>
      async function getUsers() {
        // await response of the fetch call
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        // Only proceed once its resolved
        const data = await response.json(); 
        // only proceed once second promise is resolved
        return data;
      }
  
       getUsers().then(users => console.log(users));
  </pre>
- More about using [async/wait](https://blog.alexdevero.com/es6-es7-es8-modern-javascript-pt7)
- [Three ways to write aysnchronous code](https://blog.alexdevero.com/asynchronous-javascript-code)