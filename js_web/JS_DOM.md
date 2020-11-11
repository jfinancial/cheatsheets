## DOM Manipulation

#### HTML example
- The supplementary example html used here can be found [here](html/domEvents.html)

#### Document Object
- The document object has some some important properties
    <pre>
      document.head     //get the header
      document.body     //get the body
      document.domain   //get hostname
      document.url      //get the url
    </pre>  

#### Converting HTML collections to arrays
  - To convert HTML collections use `Array.from()` 
  
    <pre>
       let scripts = document.scripts;
       let scrArr = Array.from(scripts);
    </pre>

#### Single Element Selector
- In the old way we use `getElementById()`
  <pre>
    //Get the task element with id of task-title
    const title = document.getElementById('task-title');
      
    //Make selected element disappear
    document.getElementById('task-title').style.display = none;
       
    //Set the inner text or html
    document.getElementById('task-title').style.innerText = 'Foo';
    document.getElementById('task-title').style.textContent = 'Foo2';
    document.getElementById('task-title').style.innerHtml = '&lt;h1&gt;bar<`\h1>';
  </pre>
  
- More modern way is to use the **query selector**  
  <pre>
     document.querySelector('li').style.color = 'red';
         
    //Using the query selector to the line item in an unordered list
    document.querySelector('ui li').style.color = 'blue';
        
    //Using the query selector with CSS pseudo classes
    document.querySelector('li:nth-child(3)').style.color = 'yellow';
  </pre>

#### Multiple Element Selector
- In the old way we use `getElementsById()` or `getElementsByTagName`

  <pre>
     const items1 = document.getElementsByClassName('collection-item');
     const items2 = document.querySelector('ul').getElementsByClassName('collection-item');
     const items2 = document.getElementsByTagName('li');
  </pre>

- More modern way is to use the **query selector** (`querySelectorAll`)  which returns a node list (which not an HTML collection and so requires no conversion)
  <pre>
      const qItems1 = document.querySelectorAll('ui.collection');
      const liOdds = document.querySelectorAll('li:nth-child(odd)');
      const liEvens = document.querySelectorAll('li:nth-child(even)');
      
      liOdds.forEach( function(li,index){   //using forEach
        li.style.background = '#ccc';
      }); 
      
      for(let i=0; i < liEvens.length; i++){
        liEvens[i].style.background = '#f4f4f4';
      }
   </pre>
   
#### Traversing the DOM
- We can traverse the DOM by getting an element and iterating over child items
    
  <pre>
    const list = document.querySelector('ul.collection');
    const listItem = document.querySelector('li.collection-item:first-child');

    // Get child nodes
    val = list.childNodes[0].nodeName;
    val = list.childNodes[3].nodeType;
        
    // 1 = Element, 2 = Attribute (deprecated), 3 = Text node, 8 = Comment, 9 = Document itself, 10 = Doctype
                
    // Get children element nodes
    val = list.children[1];
    list.children[1].textContent = 'Hello';

    // Children of children
    list.children[3].children[0].id = 'test-link';
        
    // First child and lastChild
    val = list.firstChild;
    val = list.firstElementChild;
    val = list.lastChild;
    val = list.lastElementChild;
        
    //Count child elements
    val = list.childElementCount;
      
    // Get parent node
    val = listItem.parentNode;
    val = listItem.parentElement;
        
     //Get next and previous sibling
     val = listItem.nextSibling;
     val = listItem.previousSibling;    
   </pre>

    
#### Creating Elements and Adding Element
- We use `createElement` and `createTextNode` to create new elements and `appendChild` to add elements

  <pre>
     // Creating a new item and setting classname
     const li  = document.createElement('li');
     li.className = 'collection-item';
       
     // Add id and attribute
     li.id = 'new-item';
     li.setAttribute('title', 'New Item');
        
     // Create text node and append
     li.appendChild(document.createTextNode('Hello World'));
        
     // Create new link element with classname
     const link = document.createElement('a');
     link.className = 'delete-item secondary-content';
     link.innerHTML = '<i class="fa fa-remove"></i>';
        
     // Append link into li
     li.appendChild(link);
     document.querySelector('ul.collection').appendChild(li);
  </pre>
  
#### Removing and Replacing Elements
- Use the `removeChild` and `replaceChild` 

  <pre>
    const newHeading = document.createElement('h2');
    newHeading.id = 'task-title';
    newHeading.appendChild(document.createTextNode('Task List'));
      
    // Get the old heading and replace
    const oldHeading = document.getElementById('task-title');
    const cardAction = document.querySelector('.card-action'); // the parent
    cardAction.replaceChild(newHeading, oldHeading); // Replace
      
    //Remove items
    const lis = document.querySelectorAll('li');
    const list = document.querySelector('ul');
    lis[0].remove();  // Removes list item
    list.removeChild(lis[3]);   // Removes child element
    
    // Adding and Removing Classes
    const firstLi = document.querySelector('li:first-child');
    const link = firstLi.children[0];
    val = link.className;
    val = link.classList;
    val = link.classList[0];
    link.classList.add('test');
    link.classList.remove('test');
      
    // Adding and Removing Attributes
    val = link.getAttribute('href');
    val = link.setAttribute('href', 'http://google.com');
    link.setAttribute('title', 'Google');
    val = link.hasAttribute('title');
    link.removeAttribute('title');
    val = link;
  </pre>

#### Inserting elements before and after and cloning node
- The `insertBefore` and `insertAfter` inserts a node before/adter a reference node as a child of a specified parent node.
  <pre>
    let insertedNode = parentNode.insertBefore(newNode, referenceNode)
  </pre> 
- Note: if the given node already exists in the document, `insertBefore()` moves it from its current position to the new position. (That is, it will automatically be removed from its existing parent before appending it to the specified new parent.) This means that a node cannot be in two locations of the document simultaneously.
- The `cloneNode` function can be used to clone an existing node

#### Disabling buttons, inputs and other elements
- The `disabled` property can be used to disable an element such as a button or input 
  <pre>
    document.getElementById("myBtn").disabled = true;
    document.querySelector('input').disabled = true;
  </pre>

#### Using Timeouts 
- The 'setTimeout' method (on the `Window` object) can be used to perform a function after a given time in ms
  <pre>
    setTimeout(clearError, 3000); //clear error after 3 seconds
  </pre>

#### Events Basics
- From an event such as `onClick` we get can get properties of the target

  <pre>
    document.querySelector('.clear-tasks').addEventListener('click', onClick);
      
    function onClick(e){
     
      // Event target element, event type and timestamp
      val = e.target.id;
      val = e.target.className;
      val = e.target.classList;
      val = e.type;
      val = e.timeStamp;

      // Co-ords event relative to the window
      val = e.clientY;
      val = e.offsetX;
    }
  </pre>
  
#### Overriding Default Behaviour
- The `preventDefault()` method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
- For example, this can be useful when:
  - Clicking on a "Submit" button, prevent it from submitting a form
  - Clicking on a link, prevent the link from following the URL
- Note: Not all events are cancelable. Use the cancelable property to find out if an event is `cancelable`.
- Note: The `preventDefault()` method does not prevent further propagation of an event through the DOM. Use the `stopPropagation()` method to handle this.
  
#### Mouse Events 
- Mouse events are `click`,`dblclick`,`mousedown`,`mouseup`,`mouseenter`,`mouseover`,`mouseout` and `mousemove`
 
  <pre>
      clearBtn.addEventListener('click', handleEvent); // Click     
      function handleEvent(e) {
         heading.textContent= `MouseX: ${e.offsetX} MouseY: ${e.offsetY}`;
         document.body.style.backgroundColor = `rgb(${e.offsetX}, ${e.offsetY}, 40)`;
      }
  </pre>

#### Keyboard and Input Events
- Keyboard events are: `keydown`,`keyup`,`keypress`,`focus`,`blur`,`cut`, `paste`,`input` and `change`
- Form event has an `onSubmit`
  <pre>
      const form = document.querySelector('form');
      const taskInput = document.getElementById('task');
      const select = document.querySelector('select');
 
      form.addEventListener('submit', handleEvent);
      taskInput.addEventListener('keydown', handleEvent); //Keydown
      
      function handleEvent(e){
        console.log(e.target.value);
        console.log(taskInput.value);
        e.preventDefault();
      }
  </pre>
  
#### Event Bubbling and Delegation
- Use `addEventListener` to add a function to be called on an event
- *Event bubbling* refers to elements bubbling up through parent elements in the DOM. Here when we click on card-title then it bubbles up and fires the event in the parent elements:
  <pre>
    document.querySelector('.card-title').addEventListener('click', function(){
      console.log('card title');
    });
    document.querySelector('.card-content').addEventListener('click', function(){
      console.log('card content');
    });  
    document.querySelector('.card').addEventListener('click', function(){
      console.log('card');
    });  
    document.querySelector('.col').addEventListener('click', function(){
      console.log('col');
    });
  </pre>
        
- *Event delegation* refers to elements trickling down the DOM 
  <pre>
     //this only puts it on them item so when deleted the function is removed
     const delItem = document.querySelector('.delete-item');
     delItem.addEventListener('click', deleteItem);
  </pre>
- Instead (using event delegation) we put a listener on the parent and using a condition to target the class we want: 
  <pre>
      //if we put it on the body we can delegate to child elements
      document.body.addEventListener('click', deleteItem);
      
      function deleteItem(e){
        // This solution is naive because the string might have multiple classes
        // but using == means it has to match the entire string
        // if(e.target.parentElement.className === 'delete-item secondary-content'){
        //   console.log('delete item');
        // }
      
        // Here we just check the target class is in the class list
        if(e.target.parentElement.classList.contains('delete-item')){
          console.log('delete item');
          e.target.parentElement.parentElement.remove();
        }
      }
      function deleteItem(e){
        if(e.target.parentElement.className === 'delete-item secondary-content'){
           console.log('delete item');
         }
      }
  </pre>
  
#### Local and Session Storage API    
- The local storage API is part of the browser allows values to stored as key/values
    <pre>
      localStorage.setItem('name', 'John');
      localStorage.setItem('age', '30');
      const name = localStorage.getItem('name');
      const age = localStorage.getItem('age');
      localStorage.removeItem('name');
      localStorage.clear();
    </pre>

- The session storage is cleared after the browse
    <pre>
        sessionStorage.setItem('name', 'Beth');
    </pre>
- We can store arrays/object literals using `JSON.stringify()` and `JSON.parse()` 
    <pre>    
      document.querySelector('form').addEventListener('submit', function(e) {
          const task = document.getElementById('task').value;
          let tasks = localStorage.getItem('tasks') === null ? [] : JSON.parse(localStorage.getItem('tasks'));
          tasks.push(task);      
          localStorage.setItem('tasks', JSON.stringify(tasks));
          e.preventDefault();
      });
        
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.forEach(function(task){ console.log(task); });
    </pre>
    
### Adding All Event Listeners    
- A common pattern is to add event listeners inside a single function
<pre>
// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  document.addEventListener('DOMContentLoaded', getTasks); // DOM Load event
  form.addEventListener('submit', addTask); // Add task event
  taskList.addEventListener('click', removeTask);// Remove task event
  clearBtn.addEventListener('click', clearTasks); // Clear task event
  filter.addEventListener('keyup', filterTasks); // Filter tasks event
}

</pre>

#### Simple DOM examples
- [Task List](./jsdom_examles/tasklist/index.html)
- [Loan Calculator](./jsdom_examles/loancalculator/index.html)
- [Number Guesser](./jsdom_examles/numberguesser/index.html)