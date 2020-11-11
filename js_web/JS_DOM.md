## DOM Manipulation

**Document Object**
- The document object has some some important properties
    <pre>
      document.head     //get the header
      document.body     //get the body
      document.domain   //get hostname
      document.url      //get the url
    </pre>  

**Converting HTML collections to arrays**
  - To convert HTML collections use `Array.from()` 
  
    <pre>
       let scripts = document.scripts;
       let scrArr = Array.from(scripts);
    </pre>

**Single Element Selector**

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

**Multiple Element Selector**
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
   
**Traversing the DOM**
- We can traverse the DOM by geet elements and iterating over child items
    
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

    
**Creating Elements**
- We use `createElement` and `createTextNode` to create new elements

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
  
**Removing and Replacing Elements**

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