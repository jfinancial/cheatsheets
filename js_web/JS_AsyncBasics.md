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