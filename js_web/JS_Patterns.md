# JAVASCRIPT PATTERNS

#### Module Pattern (Standard)  

- The module pattern allows for improved [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) and using an [IFFE](https://flaviocopes.com/javascript-iife/) function to only expose what is public via a function `return` and so hides private state for the user of the module:
- Sometimes private variable are marked with a preceding underscore

  <pre>    
    (function() {
      // Declare private vars and functions 
      return {
        // Declare public var and functions
      }
    })();
    
    const UICtrl = (function() {
      let text = 'Hello World';
    
      const changeText = function() {
        const element = document.querySelector('h1');
        element.textContent = text;
      }
    
      return {
        callChangeText: function() {
          changeText();
          // console.log(text);
        }
      }
    })();
    
    UICtrl.callChangeText();
    // UICtrl.changeText();
    
    console.log(UICtrl.text);
  </pre>
  
#### Revealing Module Pattern

- The difference to the standard module is that you map an *object literal* to methods you want to reveal:       

  <pre>
    const ItemCtrl = (function() {
      let data = [];
    
      function add(item) {
        data.push(item);
        console.log('Item Added....');
      }
    
      function get(id) {
        return data.find(item => {
          return item.id === id;
        });
      }
    
      return {
        add: add,
        // get: get
      }
    })();
    
    ItemCtrl.add({id: 1, name: 'John'});
    ItemCtrl.add({id: 2, name: 'Mark'});
    console.log(ItemCtrl.get(2));  
  </pre>
  

#### [Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)

- Singleton uses an IFFE (rather like the Module Pattern) but it ensures only one object of a type is instantiated. An example might be representing a user who is logged in.

  <pre>
    const Singleton = (function() {
      let instance;
    
      function createInstance() {
        const object = new Object({name:'John'});
        return object;
      }
    
      return {
        getInstance: function() {
          if(!instance){
            instance = createInstance();
          }
          return instance;
        }
      }
    })();
    
    const instanceA = Singleton.getInstance();
    const instanceB = Singleton.getInstance();
    
    console.log(instanceA === instanceB);
  </pre>
  
#### [Factory Pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)

  <pre>
     function MemberFactory() {
       this.createMember = function(name, type) {
         let member;
     
         if(type === 'simple') {
           member = new SimpleMembership(name);
         } else if (type === 'standard') {
           member = new StandardMembership(name);
         } else if (type === 'super') {
           member = new SuperMembership(name);
         }
     
         member.type = type;
     
         member.define =  function() {
           console.log(`${this.name} (${this.type}): ${this.cost}`);
         }
     
         return member;
       }
     }
     
     const SimpleMembership = function(name) {
       this.name = name;
       this.cost = '$5';
     }
     
     const StandardMembership = function(name) {
       this.name = name;
       this.cost = '$15';
     }
     
     const SuperMembership = function(name) {
       this.name = name;
       this.cost = '$25';
     }
     
     const members = [];
     const factory = new MemberFactory();
     
     members.push(factory.createMember('John Doe', 'simple'));
     members.push(factory.createMember('Chris Jackson', 'super'));
     members.push(factory.createMember('Janice Williams', 'simple'));
     members.push(factory.createMember('Tom Smith', 'standard'));
  </pre>

#### [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern)

Here is the accompanying [HTML](js_pattern/index.html)

  <pre>
    class EventObserver {
      constructor() {
        this.observers = [];
      }
    
      subscribe(fn) {
        this.observers.push(fn);
        console.log(`You are now subscribed to ${fn.name}`);
      }
    
      unsubscribe(fn) {
         // Filter out from the list whatever matches the callback function. If there is no match, the callback gets to stay on the list. The filter returns a new list and reassigns the list of observers.
         this.observers = this.observers.filter(function(item){
          if(item !== fn) {
            return item;
          }
        });
        console.log(`You are now unsubscribed from ${fn.name}`);
      }
    
      fire() {
        this.observers.forEach(function(item) {
          item.call();
        });
      }
    }
    
    
    const click = new EventObserver();
    
    // Event Listeners
    document.querySelector('.sub-ms').addEventListener('click', function() {
      click.subscribe(getCurMilliseconds);
    });
    
    document.querySelector('.unsub-ms').addEventListener('click', function() {
      click.unsubscribe(getCurMilliseconds);
    });
    
    document.querySelector('.sub-s').addEventListener('click', function() {
      click.subscribe(getCurSeconds);
    });
    
    document.querySelector('.unsub-s').addEventListener('click', function() {
      click.unsubscribe(getCurSeconds);
    });
    
    document.querySelector('.fire').addEventListener('click', function() {
      click.fire();
    });
    
    // Click Handler
    const getCurMilliseconds = function() {
      console.log(`Current Milliseconds: ${new Date().getMilliseconds()}`);
    }
    
    const getCurSeconds = function() {
      console.log(`Current Seconds: ${new Date().getSeconds()}`);
    }
  </pre>  

#### [Mediator Pattern](https://en.wikipedia.org/wiki/Mediator_pattern)

  <pre>
    const User = function(name) {
      this.name = name;
      this.chatroom = null;
    }
    
    User.prototype = {
      send: function(message, to) {
        this.chatroom.send(message, this, to);
      },
      recieve: function(message, from) {
        console.log(`${from.name} to ${this.name}: ${message}`);
      }
    }
    
    const Chatroom = function() {
      let users = {}; // list of users
    
      return {
        register: function(user) {
          users[user.name] = user;
          user.chatroom = this;
        },
        send: function(message, from, to) {
          if(to) {
            // Single user message
            to.recieve(message, from);
          } else {
            // Mass message
            for(key in users) {
              if(users[key] !== from) {
                users[key].recieve(message, from);
              }
            }
          }
        }
      }
    }
    
    const brad = new User('Brad');
    const jeff = new User('Jeff');
    const sara = new User('Sara');
    
    const chatroom = new Chatroom();
    
    chatroom.register(brad);
    chatroom.register(jeff);
    chatroom.register(sara);
    
    brad.send('Hello Jeff', jeff);
    sara.send('Hello Brad, you are the best dev ever!', brad);
    jeff.send('Hello Everyone!!!!');
  </pre>


#### [State Pattern](https://en.wikipedia.org/wiki/State_pattern)
  <pre>
    const PageState = function() {
      let currentState = new homeState(this);
    
      this.init = function() {
        this.change(new homeState);
      }
    
      this.change = function(state) {
        currentState = state;
      }
    };
    
    // Home State
    const homeState = function(page) {
      document.querySelector('#heading').textContent = null;
      document.querySelector('#content').innerHTML = `
        &lt;div class="jumbotron"&gt;
        &lt;h1 class="display-3"&gt;Hello, world!&lt;/h1&gt;
        &lt;p class="lead"&gt;This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.&lt;/p&gt;
        &lt;hr class="my-4"&gt;
        &lt;p&gt;It uses utility classes for typography and spacing to space content out within the larger container.&lt;/p&gt;
        &lt;p class="lead"&gt;
          &lt;a class="btn btn-primary btn-lg" href="#" role="button"&gt;Learn more&lt;/a&gt;
        &lt;/p&gt;
      &lt;/div&gt;
      `;
    };
    
    // About State
    const aboutState = function(page) {
      document.querySelector('#heading').textContent = 'About Us';
      document.querySelector('#content').innerHTML = `
        &lt;p&gt;This is the about page&lt;/p&gt;
    `;
    };
    
    // Contact State
    const contactState = function(page) {
      document.querySelector('#heading').textContent = 'Contact Us';
      document.querySelector('#content').innerHTML = `
      &lt;form&gt;
        &lt;div class="form-group"&gt;
          &lt;label&gt;Name&lt;/label&gt;
          &lt;input type="text" class="form-control"&gt;
        &lt;/div&gt;
        &lt;div class="form-group"&gt;
        &lt;label&gt;Email address&lt;/label&gt;
        &lt;input type="email" class="form-control"&gt;
      &lt;/div&gt;
      &lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
      &lt;/form&gt;
    `;
    };
    
    // Instantiate pageState
    const page = new PageState();
    
    // Init the first state
    page.init();
    
    // UI Vars
    const home = document.getElementById('home'),
          about = document.getElementById('about'),
          contact = document.getElementById('contact');
    
    // Home
    home.addEventListener('click', (e) =&gt; {
      page.change(new homeState);
    
      e.preventDefault();
    });
    
    // About
    about.addEventListener('click', (e) =&gt; {
      page.change(new aboutState);
    
      e.preventDefault();
    });
    
    // Contact
    contact.addEventListener('click', (e) =&gt; {
      page.change(new contactState);
    
      e.preventDefault();
    });
  </pre>
  
