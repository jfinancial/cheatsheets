# ANGULAR BASICS 

#### Angular Architecture Overview
- There are 5 basic building blocks to Angular:

  - **Modules** are the main, high-level building block containing components, services and routes 
  - **Components** contains a template, data and logic (e.g. directives) and is part of a DOM tree and which contains subtree nodes
  - **Services** are generally the data layer and so make API requests
  - **Directives** are bound to an existing element (or inside a template) and attach behaviour, extend, or transform a particular element and its children 
  - **Routing** renders a component based on the URL state

#### Angular Concepts

- `imports` makes the exported declarations of other modules available in the current module
- `declarations` are to make directives (including components and pipes) from the current module available to other directives in the current module. Selectors of directives, components or pipes are only matched against the HTML if they are declared or imported.
- `providers` are to make services and values known to DI (dependency injection). They are added to the root scope and they are injected to other services or directives that have them as dependency.
- A special case for providers are lazy loaded modules that get their own child injector. providers of a lazy loaded module are only provided to this lazy loaded module by default (not the whole application as it is with other modules).


#### Simple Component Example
- To make a component, we import `Component`, set the `styleUrls` property to our [Sass](https://sass-lang.com/) stylesheet, define the template our HTML and finally we export our component.
- The `selector` refers to the name of the html tag we'll use to embed our component
- In this example, we use the sugar syntax (`{}`) for **interpolation** to bind the title property/expression in the HTML template  

```typescript
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'app-root',
      styleUrls: ['app.component.scss'],
      template: `
        <div class="app">
          {{ title }}
        </div>
      `
    })
    export class AppComponent {
      title: string;
      constructor() {
        this.title = 'Ultimate Angular';
      }
    }
``` 
  
#### Root module with @NgModule
- Angular modules are similar to ES5 modules and we use import/export but the @NgModule annotation works as a special decorator. (We don't need to add the `.ts` extension for our component.) 
- We include NgModule, BrowserModule (for Broswer functionality) and CommonModule (for templating and directives) and add these to our `imports` section and then add our component to `declarations` and `bootstrap`. (Here, `bootstrap` corresponds to the <appRoot> tag in our HTML.

```typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { CommonModule } from '@angular/common';
    
    import { AppComponent } from './app.component';
    
    @NgModule({
      imports: [
        BrowserModule,
        CommonModule
      ],
      bootstrap: [
        AppComponent
      ],
      declarations: [
        AppComponent
      ]
    })
    export class AppModule {}
```
  
#### Bootstrapping Angular
- We bootstrap Angular with our `main.ts` file. We import from Angular's `@angular/platform-browser-dynamic` which allows us to perform dependecy injection and then using the imported `platformBrowserDynamic()` function we tell it which module to bootsrap:

```typescript
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import { AppModule } from './app/app.module';
    
    platformBrowserDynamic().bootstrapModule(AppModule);
```


#### Property Binding And Event Binding (`ngModelChange`)
 - We use `square bracket` notation to indicate **one-way dataflow** for binding a property (instead of standard sugar syntax for interpolation which is curly brackets)
 
 ```html
      <h1 [innerHTML]="title"></h1>      
      <img [src]="logo">                     //we bind the expression 'logo' which might be 'img/logo.svc'   
 ```
      
- We can perform **event binding** using normal brackets `()` and...

 ```html
     <button (click)="handleClick()" >
     <input type="text" [value]="{{name}}" (input)="handleInput($event)" (blur)="handleBlur($event)">
 ```
   
- ...then add the event handler function to our component:

```typescript
    export class AppComponent {
          title: string;
          constructor() {
            this.title = 'Ultimate Angular';
          }
          handleClick(){
             this.name = 'Jack';         
          }
          handleInput(event: any){
            this.name = event.target.value;         
          }
          handleBlur(event: any){
            this.name = event.target.value;
            console.log(event);
          }
        }
```
     
- To perform **two-way data-binding** we have to use Angular's Forms Module so `import { FormsModule } from '@angular/forms'` and add it to our imports array
- We use combination of normal and square brackets `[()]` to tell Angular we are using two-way data-binding

 ```html
     <button (click)=@handleClick()" >
     <input type="text" [ngModel]="{{name}}" (ngModelChange)="handleChange($event)">
     
     //This uses two-way data-binding
     <input type="text" [(ngModel)]="{{name}}" (input)="handleChange($event)">ngModel)]="{{name}}">  
 ```

#### Template Refs (`#`)
- A template ref allows to set a reference to a DOM node using the # syntax. In this example, we give the input box a `#username` reference and pass the value of this node to the onClick function on our button: 

```html
     <button (click)=@handleClick(username.value)" >
     <input type="text" #username">
```   
  
#### Basic Angular Directives  
- `ngIf` is Angular's if expression. Here name references a javascript variable. (Note that the * in `*ngIf` refers to a [WebComponent](https://developer.mozilla.org/en-US/docs/Web/Web_Components) template element. Angular sits on top of the Web Platform so we can use things like [ShadowDom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) and so in reality Angular is using the directive to put the our HTML inside a template which is what the * really represents)

```html
      <input type="text" [value]="name" (input)="handleChange($event.target.value)">
      <div *ngIf="name.length > 2">
        Searching for... {{ name }}
      </div>  
```

- `ngFor` is used to iterate over an iterable. Here we have an array of passenger objects which have a fullname property. Angular also exposes the index for us.

```html
      <li *ngFor="let passenger of passengers; let i = index;">
        {{i}} : {{ passenger.fullname }}
      </li>
      
- `ngClass` is used to apply styling for CSS/SASS classes. In this example, when the boolean flag `checkedIn` the `checked-in` style is applied and then when checkedIn is false the `checked-out` class is applied

```html
    <ul>
      <li *ngFor="let passenger of passengers; let i = index;">
        <span class="status" [ngClass]="{
              'checked-in': passenger.checkedIn,
              'checked-out': !passenger.checkedIn
            }">
        </span>
        {{ i }}: {{ passenger.fullname }}
      </li>
    </ul>  
```

- We can also `ngClass`to apply **conditional styling** by referring to a method:

```html
    <ul>
      <li *ngFor="let passenger of passengers; let i = index;">
        <span class="status" [ngClass]="passengerClasses(passenger)">
        </span>
        {{ i }}: {{ passenger.fullname }}
      </li>
    </ul>  
```
The `passengerClasses()` method on the component:

```typescript
  passengerClasses(passenger){
    if(passenger.isCheckedIn()){
        return 'checkedInClass'
    }    
  }
```


- `ngStyle` is another directive which allows CSS/SASS styling to be applied to elements

 ```html
     <li *ngFor="let passenger of passengers; let i = index;">
       <span class="status" [ngStyle]="{ backgroundColor: (passenger.checkedIn ? '#2ecc71' : '#c0392b')}">
       </span>
       {{ i }}: {{ passenger.fullname }}
     </li>  
 ```

#### Pipes
- [Pipes](https://angular.io/guide/pipes) are functions for data transformation and can be applied (and chained) using `|` syntax similar to piping unix commands.
- Examples of pipe are json (which turns a JS object into JSON), date (performs date formatting) and uppercase
```html
    <p>{{ passenger | json }}</p>
    <div class="date">
      Check in date: 
      {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
    </div>
```
  
#### Safe Navigation Operator (`?`)
- The safe navigation operator allows us to perform an implicit null check:
```html
     <div class="children">Children: {{ passenger.children?.length || 0 }}</div>
```

#### Component Architecture and Presentational Components
- One important distinction with respect to components is **container components** and **presentational components**. (These are also referred to as stateful/stateless components or smart/dumb components). Smart/Container components may *receive data from a service* and then feed dumb/presentational components.
- Data is flowed by events (and **event emitters**). Container components talk to the back end and the child presentational components are re-rendered.
- To enforce separation of concerns we can divide up our application into **feature modules**. Here we create a feature module ([passenger-dashboard](https://github.com/UltimateAngular/angular-fundamentals-src/tree/master/16-container-component)) which lives in its own `passenger-dashboard` directory. We then import this module into our `app.ts` imports and the `imports` array. We also have to export it or it will not be available. (It's a good idea to put container compents into a subdirectory called `containers`.) 
- Note that `app.css` in top level `css` directory applies global styles but we usually use encapsulated styles (i.e. scoped to the component) for each component (and in this example we use `passenger-dashboard.component.scss`)
  
```typescript
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { PassengerDashboardComponent } from './containers/passenger-dashboard/passenger-dashboard.component';
    
    @NgModule({
      declarations: [
        PassengerDashboardComponent
      ],
      imports: [
        CommonModule
      ],
      exports: [
        PassengerDashboardComponent
      ]
    })
    export class PassengerDashboardModule {}
    export class PassengerDashboardModule {}
```
 
- We create a new component and create a `models` directory which contains our interfaces (which we should be exported!)

```typescript
    import { Component } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        <div>
          <h3>Airline Passengers</h3>
          <ul>
            <li *ngFor="let passenger of passengers; let i = index;">
              <span 
                class="status"
                [class.checked-in]="passenger.checkedIn"></span>
              {{ i }}: {{ passenger.fullname }}
              <div class="date">
                Check in date: 
                {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
              </div>
              <div class="children">
                Children: {{ passenger.children?.length || 0 }}
              </div>
            </li>
          </ul>
        </div>
      `
    })
    export class PassengerDashboardComponent {
      passengers: Passenger[] = [...passenger array...];
    }
```
   
#### Lifecyle Hooks (`@OnInit`)
- Lifecycle hooks allow Angular to perform certain actions on various lifecycle events. The `@OnInit` hook allows us to execute logic on initilisation of the component.
- To use `@OnInit` we must import it from `'@angular/core` and declare that our class `implements OnInit` and then implement the `ngOnInit()` method: 

```typescript
    import { Component, OnInit } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        <div>
          <h3>Airline Passengers</h3>
          <ul>
            <li *ngFor="let passenger of passengers; let i = index;">
              <span 
                class="status"
                [class.checked-in]="passenger.checkedIn"></span>
              {{ i }}: {{ passenger.fullname }}
              <div class="date">
                Check in date: 
                {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
              </div>
              <div class="children">
                Children: {{ passenger.children?.length || 0 }}
              </div>
            </li>
          </ul>
        </div>
      `
    })
    export class PassengerDashboardComponent implements OnInit {
      passengers: Passenger[];
      constructor() {}
      ngOnInit() {
        console.log('ngOnInit');
        this.passengers = [...some data...;
      }
    }
```
  
#### Presentational Components
- To use presentaional components, we must first change our feature moddule so that we import our presentational components (`PassengerCountComponent` and `PassengerDetailComponent`) and add them to declarations but we **don't export** them as only our container needs to know about them. 

```typescript
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { PassengerDashboardComponent } from './containers/passenger-dashboard/passenger-dashboard.component';
    import { PassengerCountComponent } from './components/passenger-count/passenger-count.component';
    import { PassengerDetailComponent } from './components/passenger-detail/passenger-detail.component';
    
    @NgModule({
      declarations: [
        PassengerDashboardComponent,
        PassengerCountComponent,
        PassengerDetailComponent
      ],
      imports: [
        CommonModule
      ],
      exports: [
        PassengerDashboardComponent
      ]
    })
    export class PassengerDashboardModule {}
```
  
- This is our simple presentational component. Note that our selector will be the name of the HTML tag we embed in our container
```typescript
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'passenger-count',
      template: `<div> Count component <§/div>`
    })
    export class PassengerCountComponent {
      constructor() {}
    }
```
  
- Our simplified container now contains our `passenger-count` and `passenger-detail` components:
  
```typescript
      import { Component, OnInit } from '@angular/core';
      import { Passenger } from '../../models/passenger.interface';
      
      @Component({
        selector: 'passenger-dashboard',
        styleUrls: ['passenger-dashboard.component.scss'],
        template: `
          <div>
            <passenger-count></passenger-count>
            <passenger-detail></passenger-detail>
            <h3>Airline Passengers</h3>
           ....
          </div>
        `
      })
      export class PassengerDashboardComponent implements OnInit {
        passengers: Passenger[];
        constructor() {}
        ngOnInit() {
          this.passengers = [...data....];
        }
      }
```
  
#### Binding Input Data with `@Input()`
- We bind data to out container component using standard square bracket (`[]`) syntax. For iteration, we can use `*ngFor` and bind our individual collection element (i.e. `[detail]="passenger"`)

```typescript
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        <div>
          <passenger-count [items]="passengers">
          </passenger-count>
          
          <passenger-detail *ngFor="let passenger of passengers;" [detail]="passenger">
          </passenger-detail>
        </div>
      `
    })
```

- ...then can use Angular's `@Input()` annotation to bind one-way input data  

```typescript
    import { Component, Input } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-count',
      template: `
        <div>
          <h3>Airline Passengers!</h3>
          <div>
            Total checked in: {{ checkedInCount() }}/{{ items.length }}
          </div>
        </div>
      `
    })
    export class PassengerCountComponent {
      @Input()
      items: Passenger[];
      checkedInCount(): number {
        if (!this.items) return;
        return this.items.filter((passenger: Passenger) =(passenger.checkedIn).length;
      }
    }
```
  
- For out iterated element we again add the `@Input()` annotation

```typescript
    import { Component, Input } from '@angular/core';  
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-detail',
      styleUrls: ['passenger-detail.component.scss'],
      template: `
        <div>
          <span class="status" [class.checked-in]="detail.checkedIn"></span>
          {{ detail.fullname }}
          <div class="date">
            Check in date: 
            {{ detail.checkInDate ? (detail.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
          </div>
          <div class="children">
            Children: {{ detail.children?.length || 0 }}
          </div>
        </div>
      `
    })
    export class PassengerDetailComponent {
      @Input()
      detail: Passenger;
      constructor() {}
    }
```  
  
  
#### Emitting changes with `@Output()` and Event Emitters
- For getting data out of a component we import `Output` and `EventEmitter`
- Here we have a child (presentational) component which emits custom output events for `onRemove()` and `onEdit()` using an `EventEmitter`. We then fire the event using the emitter with our object that's being edited/removed and this event will notify our parent (container) component. 

```typescript
    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-detail',
      styleUrls: ['passenger-detail.component.scss'],
      template: `
        <div>
          <span class="status" [class.checked-in]="detail.checkedIn"></span>
          <div *ngIf="editing">
            <input  type="text"  [value]="detail.fullname" (input)="onNameChange(name.value)" #name>
          </div>
          <div *ngIf="!editing">{{ detail.fullname }}</div>
          <div class="date"> Check in date:  {{ detail.checkInDate ? (detail.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}</div>
          <div class="children">  Children: {{ detail.children?.length || 0 }} </div>
          <button (click)="toggleEdit()">
            {{ editing ? 'Done' : 'Edit' }}
          </button>
          <button (click)="onRemove()">
            Remove
          </button>
        </div>
      `
    })
    export class PassengerDetailComponent {
      @Input()
      detail: Passenger;
      @Output()
      edit: EventEmitter<any> = new EventEmitter();
      @Output()
      remove: EventEmitter<any> = new EventEmitter();
      editing: boolean = false;
      constructor() {}
      onNameChange(value: string) {
        this.detail.fullname = value;
      }
      toggleEdit() {
        if (this.editing) {
          this.edit.emit(this.detail);
        }
        this.editing = !this.editing;
      }
      onRemove() { this.remove.emit(this.detail); }
    }
```
  
- In our **container component**, we can now implement the typed `handleEdit`/`handleRemove` methods and we do this preserving immutability and in our template we refer to the `passenger` object directly: 

```typescript
     import { Component, OnInit } from '@angular/core';
     import { Passenger } from '../../models/passenger.interface';
     
     @Component({
       selector: 'passenger-dashboard',
       styleUrls: ['passenger-dashboard.component.scss'],
       template: `
         <div>
           <passenger-count [items]="passengers"> </passenger-count>
           <div *ngFor="let passenger of passengers;">
             {{ passenger.fullname }}
           </div>
           <passenger-detail *ngFor="let passenger of passengers;"
             [detail]="passenger"
             (edit)="handleEdit($event)"
             (remove)="handleRemove($event)">
           </passenger-detail>
         </div>`
     })
     export class PassengerDashboardComponent implements OnInit {
       passengers: Passenger[];
       constructor() {}
       ngOnInit() {
         this.passengers = [{ ...passenger data... }];
       }
       handleEdit(event: Passenger) {
         this.passengers = this.passengers.map((passenger: Passenger) => {
           if (passenger.id === event.id) {
             passenger = Object.assign({}, passenger, event);
           }
           return passenger;
         });
       }
       handleRemove(event: Passenger) {
         this.passengers = this.passengers.filter((passenger: Passenger) => {
           return passenger.id !== event.id;
         });
       }
     }
``` 
  
#### The `ngOnChanges` Lifecycle Hook
- The `ngOnChanges` allows us to emit events containing state change and the event will have the `currentValue` and `previousValue` values. In this way, we can use the `ngOnChanges` hook to break the binding between the parent and child component. (We may need to do this to make sure edits are not immediately shown.)
- In this example, we implement `ngOnChanges` (which is called before `ngOnInit`): we do a safety check and then we override the `detail` object with an empty object and *merge* it with the current value

```typescript
     import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
     import { Passenger } from '../../models/passenger.interface';
     
     @Component({
       selector: 'passenger-detail',
       styleUrls: ['passenger-detail.component.scss'],
       template: `
         <div>
           <span class="status" [class.checked-in]="detail.checkedIn"></span>
           <div *ngIf="editing"> 
             <input type="text"  [value]="detail.fullname" (input)="onNameChange(name.value)" #name>
           </div>
           <div *ngIf="!editing">
             {{ detail.fullname }}
           </div>
           <div class="date">
             Check in date: {{ detail.checkInDate ? (detail.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
           </div>
           <div class="children">
             Children: {{ detail.children?.length || 0 }}
           </div>
           <button (click)="toggleEdit()">
             {{ editing ? 'Done' : 'Edit' }}
           </button>
           <button (click)="onRemove()">
             Remove
           </button>
         </div>`
     })
     export class PassengerDetailComponent implements OnChanges, OnInit {
     
       @Input()
       detail: Passenger;
       @Output()
       edit: EventEmitter<any> = new EventEmitter();
       @Output()
       remove: EventEmitter<any> = new EventEmitter();
       editing: boolean = false;
       constructor() {}
       ngOnChanges(changes) {
         if (changes.detail) {
           this.detail = Object.assign({}, changes.detail.currentValue);
         }
       }
       ngOnInit() {
         console.log('ngOnInit');
       }       
       onNameChange(value: string) {
         this.detail.fullname = value;
       }
       toggleEdit() {
         if (this.editing) {
           this.edit.emit(this.detail);
         }
         this.editing = !this.editing;
       }
       onRemove() {
         this.remove.emit(this.detail);
       }
     }
```    

  
#### Data Services And Dependency Injection
- To create service (`passenger-dashboard-service.ts`) we import `HttpModule` and use `Http` (for which we need `Injectable`)  
- We implement our `getPassengers()` object make makes an API call calling `get` on our injected Http token. We also then use `map` function (imported from `rxjs/add/operator/map`) to convert our json response of `Observable`: 
- We also import `Headers` and `RequestOptions` so can set the content type on our Http header
- We also import `catch` and `throw` for error handling

```typescript
 
    import { Injectable } from '@angular/core';
    import { Http, Response, Headers, RequestOptions } from '@angular/http';
    
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/catch';
    import 'rxjs/add/observable/throw';
    import { Passenger } from './models/passenger.interface';
    
    const PASSENGER_API: string = '/api/passengers';
    
    @Injectable()
    export class PassengerDashboardService {
      constructor(private http: Http) {}
    
      getPassengers(): Observable<Passenger[]> {
        return this.http.get(PASSENGER_API)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
      }
      
      getPassenger(id: number): Observable<Passenger> {
          return this.http
            .get(`${PASSENGER_API}/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json()));
        }
    
      updatePassenger(passenger: Passenger): Observable<Passenger> {
        let headers = new Headers({
          'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
          headers: headers
        });
        return this.http
          .put(`${PASSENGER_API}/${passenger.id}`, passenger, options)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
      }
    
      removePassenger(passenger: Passenger): Observable<Passenger> {
        return this.http
          .delete(`${PASSENGER_API}/${passenger.id}`)
          .map((response: Response) => response.json())
          .catch((error: any) => Observable.throw(error.json()));
      }
    }
```
  
- Now in our container component we can use our new service (PassengerDashboardService). In `ngInit` and `handleRemove` and `handleEdit` methods we call `subscribe`:

```typescript
    import { Component, OnInit } from '@angular/core';
    import { PassengerDashboardService } from '../../passenger-dashboard.service';  
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        <div>
          <passenger-count [items]="passengers"></passenger-count>
          <div *ngFor="let passenger of passengers;">
            {{ passenger.fullname }}
          </div>
          <passenger-detail *ngFor="let passenger of passengers;"
            [detail]="passenger"
            (edit)="handleEdit($event)"
            (remove)="handleRemove($event)">
          </passenger-detail>
        </div>`
    })
    export class PassengerDashboardComponent implements OnInit {
      passengers: Passenger[];
      constructor(private passengerService: PassengerDashboardService) {}
      ngOnInit() {
         this.passengerService
          .getPassengers()
          .subscribe((data: Passenger[]) => this.passengers = data);
      }
      handleEdit(event: Passenger) {
        this.passengerService
          .updatePassenger(event)
          .subscribe((data: Passenger) => {
            this.passengers = this.passengers.map((passenger: Passenger) => {
              if (passenger.id === event.id) {
                passenger = Object.assign({}, passenger, event);
              }
              return passenger;
            });
          });
      }
      handleRemove(event: Passenger) {
        this.passengerService
          .removePassenger(event)
          .subscribe((data: Passenger) => {
            this.passengers = this.passengers.filter((passenger: Passenger) => {
              return passenger.id !== event.id;
            });
          });
      }
    }
```

#### Using Promises (As Replacement For RxJs Subscriptions)
- Instead of using RxJs subscriptions we can use promises by importing `rxjs/add/operator/toPromise` and calling `toPromise()` on the respone
```typescript

    import { Injectable } from '@angular/core';
    import { Http, Response, Headers, RequestOptions } from '@angular/http';   
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/operator/toPromise';
    import { Passenger } from './models/passenger.interface';
    
    const PASSENGER_API: string = '/api/passengers';
    
    @Injectable()
    export class PassengerDashboardService {
      constructor(private http: Http) {}
    
      getPassengers(): Promise<Passenger[]> {
        return this.http.get(PASSENGER_API)
          .toPromise()
          .then((response: Response) => response.json());
      }
    
      updatePassenger(passenger: Passenger): Promise<Passenger> {
        let headers = new Headers({
          'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
          headers: headers
        });
        return this.http
          .put(`${PASSENGER_API}/${passenger.id}`, passenger, options)
          .toPromise().then((response: Response) => response.json());
      }
    
      removePassenger(passenger: Passenger): Promise<Passenger> {
        return this.http
          .delete(`${PASSENGER_API}/${passenger.id}`)
          .toPromise().then((response: Response) => response.json());
      } 
    }
```

#### Template-Driven Forms with `ngForm` and `ngModel`, Inputs And Validation
- To use forms we must import Angular's `FormsModule` in our feature module and also add it to our `imports` array
- We bind the `form` element with templateRef `#form="ngForm"` and add `novalidate` as we will use Angular's validation.
 
 ```typescript
  import { FormsModule } from '@angular/forms';
```
 
- We now create a **form component** and pass in `detail` of type `Passenger` and decorate this an `@Input`. Meanwhile, in out template the `input` elements on our form are bound to `ngModel` using the safe-navigation operator (`?`) (e.g. `[ngModel]="detail?.fullname"`). Likewise, we bind `checkedIn` using a checkbox and bind a function with `ngModelChange` 
- For our `select` dropdown we again bind using `ngModel` and then use an `*ngFor` for creating our dropdown `option` elements from a collection. We also implement the logic for `selected` on the `option` element to see if a selection has already been made. We have implemented `selected` using `[selected]="item.key === detail?.baggage">` but we could instead replace `value` and `selected` with `[ngValue]="item.key"` which provides the same functionality.
- To perform **validation**, we can also add the `required` attribute and templateRefs to our inputs (`#fullname="ngModel"`) so that ngModel keeps track of validation states. The form has properties `form.valid` and `form.invalid` which are boolean values for validation. We can get the individual errors for element e.g. `fullname.errors` which will be an object or null. We can implement showing an error for a required input using `ngIf` and the `dirty` property which means the input value has been changed (`*ngIf="fullname.errors?.required && fullname.dirty"`). We could use `touch` instead of dirty. Another useful validation property is `minlength`.
- To prevent form submission if there are **validation errors** then we use `[disabled]="form.invalid"`
- To implement **form submission**, we bind an event using `ngSubmit` and we submit the `form.value` which is of type Passenger and we also pass `form.valid` so we can do one final check on validation errors. Because this a stateless component, we don't want to interact with an API but instead we set up an `@Output` with an `EventEmitter<Passenger>` called `update` so that our container gets notified of the upate.

```typescript
    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    import { Baggage } from '../../models/baggage.interface';
    
    @Component({
      selector: 'passenger-form',
      styleUrls: ['passenger-form.component.scss'],
      template: `
        <form (ngSubmit)="handleSubmit(form.value, form.valid)" #form="ngForm" novalidate>
          <div>
            Passenger name:
            <input type="text" name="fullname" required #fullname="ngModel"
              [ngModel]="detail?.fullname">
            <div *ngIf="fullname.errors?.required && fullname.dirty" class="error">
              Passenger name is required
            </div>
          </div>
          <div>
            Passenger ID:
            <input type="number" name="id" required #id="ngModel"
              [ngModel]="detail?.id">
            <div *ngIf="id.errors?.required && id.dirty" class="error">
              Passenger ID is required
            </div>
          </div>
          <div>
            <label>
              <input type="checkbox" name="checkedIn" [ngModel]="detail?.checkedIn"
                (ngModelChange)="toggleCheckIn($event)">
            </label>
          </div>
          <div *ngIf="form.value.checkedIn">
            Check in date:
            <input type="number" name="checkInDate" [ngModel]="detail?.checkInDate">
          </div>
          <div>
            Luggage:
            <select name="baggage" [ngModel]="detail?.baggage">
              <option *ngFor="let item of baggage"
                [value]="item.key" [selected]="item.key === detail?.baggage">
                {{ item.value }}
              </option>
            </select>
          </div>
          <button type="submit" [disabled]="form.invalid">Update passenger</button>
        </form>`
    })
    export class PassengerFormComponent {
      
      @Input()
      detail: Passenger;    
      
      @Output()
      update: EventEmitter<Passenger> = new EventEmitter<Passenger>();
      
      baggage: Baggage[] = [{...baggage data...}];
      
      toggleCheckIn(checkedIn: boolean) {
        if (checkedIn) {
          this.detail.checkInDate = Date.now();
        }
      }
      
      handleSubmit(passenger: Passenger, isValid: boolean) {
        if (isValid) {
          this.update.emit(passenger);
        }
      }
    }
```

- Instead of a checkbox for `checkedIn` we could use radio buttons and we need to add `[value]`:

```typescript
     <div>
        <label>
          <input type="radio" [value]="true" name="checkedIn" [ngModel]="detail?.checkedIn" (ngModelChange)="toggleCheckIn($event)">
          Yes
        </label>
        <label>
          <input type="radio" [value]="false" name="checkedIn" [ngModel]="detail?.checkedIn" (ngModelChange)="toggleCheckIn($event)">
          No
        </label>
      </div>
```
  
#### Component Routing

- In our `index.html` we must include the `<base>` element inside our `<header>`:
```html
   <!doctype html>
   <html>
   <head>
     <base href="/">
     <title>Ultimate Angular</title>
     <link rel="stylesheet" href="/css/app.css">
   </head>
   <body>
     <app-root></app-root>
   
     <script src="/vendor/vendor.js"></script>
     <script src="/build/app.js"></script>
   </body>
   </html>
 ```
  
- In the top level `app.module.ts` we must  import `RouterModule` and in our imports declare `RouterModule.forRoot(routes)`. (Note that in `forRoot` we can also supply an additional argument of `useHash: true` which uses an old-school [HashLocation Strategy](https://medium.com/@dao.houssene/angular-the-hash-trap-b2d415c2c241) for SPA)
- For routes, we declare our custom `HomeComponent` and our `NotFoundComponent` which is routed via a wildcard (`**`)
- In our routes, we could also replace our HomeComponent with a `redirectTo` e.g. (`redirectTo: passengers`) and this is how redirects are implemented

```typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { CommonModule } from '@angular/common';
    import { RouterModule, Routes } from '@angular/router';
    import { PassengerDashboardModule } from './passenger-dashboard/passenger-dashboard.module';
    import { HomeComponent } from './home.component';
    import { NotFoundComponent } from './not-found.component';
    import { AppComponent } from './app.component';
    
    const routes: Routes = [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ];
    
    @NgModule({
      declarations: [
        AppComponent,
        HomeComponent,
        NotFoundComponent
      ],
      imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot(routes),
        PassengerDashboardModule
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule {}
     
```  
  
- Our home component (`home.component.ts`) must have a template selector of `app-home`:
  
```typescript
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'app-home',
      template: `
        <div>
          Airline passenger app!
        </div>`
    })
    export class HomeComponent {}
```

- The `not-found` component also need to be defined: 

```typescript
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'not-found',
      template: `
        <div>
          Not found, <a routerLink="/">go home</a>?
        </div>`
    })
    export class NotFoundComponent {}
```  

- In the `app.component.ts`we specify `<router-outlet>` which is a directive via the router which acts as a placeholder for where our component will go. We also defined anchor tags with `routerLink` and to this add `routerLinkActiveOptions` to tell Angular to do an exact match and bind it to a property (so it only adds the styling if we are root and we ignore inherited roots.) We also create an interface `Nav` and use an `ngFor` to dynamically create our routes using bound properties:

```typescript
    import { Component } from '@angular/core';
    
    interface Nav {
      link: string,
      name: string,
      exact: boolean
    }
    
    @Component({
      selector: 'app-root',
      styleUrls: ['app.component.scss'],
      template: `
        <div class="app">
          <nav class="nav">
            <a *ngFor="let item of nav"
              [routerLink]="item.link"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact }">
              {{ item.name }}
            </a>
          </nav>
          <router-outlet></router-outlet>
        </div>
      `
    })
    export class AppComponent {
      nav: Nav[] = [
        {
          link: '/',
          name: 'Home',
          exact: true
        },
        {
          link: '/passengers',
          name: 'Passengers',
          exact: true
        },
        {
          link: '/oops',
          name: '404',
          exact: false
        }
      ];
```  

- We can style our links using Sass:

```css
    .nav {
      margin: 0 0 10px;
      padding: 0 0 20px;
      border-bottom: 1px solid #dce5f2;
      a {
        background: #3a4250;
        color: #fff;
        padding: 4px 10px;
        margin: 0 2px;
        border-radius: 2px;
        &.active {
          color: #b690f1;
          background: #363c48;
        }
      }
    }
```

- In our feature module we also define our routes and define an array called `children` containing the child routes. We use query parameters (`:id`) here:

```typescript
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { HttpModule } from '@angular/http';
    import { FormsModule } from '@angular/forms';
    import { RouterModule, Routes } from '@angular/router';
    
    // containers and components
    import { PassengerDashboardComponent } from './containers/passenger-dashboard/passenger-dashboard.component';
    import { PassengerViewerComponent } from './containers/passenger-viewer/passenger-viewer.component';
    import { PassengerCountComponent } from './components/passenger-count/passenger-count.component';
    import { PassengerDetailComponent } from './components/passenger-detail/passenger-detail.component';
    import { PassengerFormComponent } from './components/passenger-form/passenger-form.component';
    
    // service
    import { PassengerDashboardService } from './passenger-dashboard.service';
    
    const routes: Routes = [
      {
        path: 'passengers',
        children: [
         { path: '', component: PassengerDashboardComponent },
         { path: ':id', component: PassengerViewerComponent }
        ]
      }
    ];
    
    @NgModule({
      declarations: [
        PassengerDashboardComponent,
        PassengerViewerComponent,
        PassengerCountComponent,
        PassengerDetailComponent,
        PassengerFormComponent
      ],
      imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forChild(routes)
      ],
      providers: [
        PassengerDashboardService
      ]
    })
    export class PassengerDashboardModule {}
```

- Finally in our container component, we can inject the `Router` and the `ActivatedRoute` through the constructor (adding these to the imports). We can now get the route params (of type `Params`) via `route.params`  (so we could call `subscribe` on it) but instead we'll use RxJs' `switchMap` (which also needs to be imported) and which takes our subscription and returns an `Observable`

```typescript
     import { Component, OnInit } from '@angular/core';
     import { Router, ActivatedRoute, Params } from '@angular/router';
     import 'rxjs/add/operator/switchMap';
     import { PassengerDashboardService } from '../../passenger-dashboard.service';
     import { Passenger } from '../../models/passenger.interface';
     
     @Component({
       selector: 'passenger-viewer',
       styleUrls: ['passenger-viewer.component.scss'],
       template: `
         <div>
           <passenger-form
             [detail]="passenger"
             (update)="onUpdatePassenger($event)">
           </passenger-form>
         </div>
       `
     })
     export class PassengerViewerComponent implements OnInit {
       passenger: Passenger;
       constructor(
         private router: Router,
         private route: ActivatedRoute,
         private passengerService: PassengerDashboardService
       ) {}
       ngOnInit() {
         this.route.params
           .switchMap((data: Passenger) => this.passengerService.getPassenger(data.id))
           .subscribe((data: Passenger) => this.passenger = data);
       }
       onUpdatePassenger(event: Passenger) {
         this.passengerService
           .updatePassenger(event)
           .subscribe((data: Passenger) => {
             this.passenger = Object.assign({}, this.passenger, event);
           });
       }
     }
```

- In our stateless component we could implement **imperative routing** by adding a button and then implementing a function:

```html`
    <button (click)="goBack()">
```    

- ..and then implement our function calling `navigate` method on the `router`:

```typescript
     goBack(){
       this.router.navigate(['/passengers'])
     }
```

- Likewise, we use **imperative routing**, injecting the router into our stateless 

```typescript
    import { Component, OnInit } from '@angular/core';
    import { PassengerDashboardService } from '../../passenger-dashboard.service';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `<div>
          <passenger-count [items]="passengers"></passenger-count>
          <div *ngFor="let passenger of passengers;">
            {{ passenger.fullname }}
          </div>
          <passenger-detail *ngFor="let passenger of passengers;"
            [detail]="passenger"
            (edit)="handleEdit($event)"
            (remove)="handleRemove($event)">
          </passenger-detail>
        </div>`
    })
    export class PassengerDashboardComponent implements OnInit {
      passengers: Passenger[];
      constructor(private passengerService: PassengerDashboardService) {}
      ngOnInit() {
         this.passengerService
          .getPassengers()
          .subscribe((data: Passenger[]) => this.passengers = data);
      }
      handleEdit(event: Passenger) {
        this.passengerService
          .updatePassenger(event)
          .subscribe((data: Passenger) => {
            this.passengers = this.passengers.map((passenger: Passenger) => {
              if (passenger.id === event.id) {
                passenger = Object.assign({}, passenger, event);
              }
              return passenger;
            });
          });
      }
      handleRemove(event: Passenger) {
        this.passengerService
          .removePassenger(event)
          .subscribe((data: Passenger) => {
            this.passengers = this.passengers.filter((passenger: Passenger) => {
              return passenger.id !== event.id;
            });
          });
      }
    }
```
  
```typescript
      import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
      import { Passenger } from '../../models/passenger.interface';
      
      @Component({
        selector: 'passenger-detail',
        styleUrls: ['passenger-detail.component.scss'],
        template: `
          <div>
            <span class="status" [class.checked-in]="detail.checkedIn"></span>
            <div *ngIf="editing">
              <input type="text"  [value]="detail.fullname" (input)="onNameChange(name.value)" #name>
            </div>
            <div *ngIf="!editing">
              {{ detail.fullname }}
            </div>
            <div class="date">
              Check in date:  {{ detail.checkInDate ? (detail.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
            </div>
            <button (click)="toggleEdit()">{{ editing ? 'Done' : 'Edit' }}</button>
            <button (click)="onRemove()">Remove</button>
          </div>`
      })
      export class PassengerDetailComponent implements OnChanges {
      
        @Input()
        detail: Passenger;
        @Output()
        edit: EventEmitter<Passenger> = new EventEmitter<Passenger>();
        @Output()
        remove: EventEmitter<Passenger> = new EventEmitter<Passenger>();
        editing: boolean = false;
        constructor() {}
        ngOnChanges(changes) {
          if (changes.detail) {
            this.detail = Object.assign({}, changes.detail.currentValue);
          }
        }
        
        onNameChange(value: string) {
          this.detail.fullname = value;
        }
        toggleEdit() {
          if (this.editing) {
            this.edit.emit(this.detail);
          }
          this.editing = !this.editing;
        }
        onRemove() {
          this.remove.emit(this.detail);
        }
      }
```
