# ANGULAR BASICS 

#### Angular Architecture Overview
- There are 5 basic building blocks to Angular
  - **Modules** are the main, high-level building block containing components, services and routes 
  - **Components** contains a template, data and logic (e.g. directives) and is part of a DOM tree and which contains subtree nodes
  - **Services** are generally the data layer and so make API requests
  - **Directives** are bound to an existing element (or inside a template) and attach behaviour, extend, or transform a particular element and its children 
  - **Routing** renders a component based on the URL state
  
#### Simple Component Example
- To make a component we import Component, we set the `styleUrls` property to our [Sass](https://sass-lang.com/) stylesheet, the template our HTML and finally we export our component
- In this example, we use the sugar syntax (`{}`) for **interpolation** to bind the title property/expression in the HTML template  
  <pre>
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'app-root',
      styleUrls: ['app.component.scss'],
      template: `
        &lt;div class="app"&gt;
          {{ title }}
        &lt;/div&gt;
      `
    })
    export class AppComponent {
      title: string;
      constructor() {
        this.title = 'Ultimate Angular';
      }
    }
  </pre> 
  
#### Root module with @NgModule
- Think of a module like import/export in ES5. (We don't need to add the `.ts` extension for our component.) The @NgModule is a special decorator.
- We include NgModule (these are Angular decorators), BrowserModule (for Broswer functionality) and CommonModule (for templating and directives) and add these to our `imports` section and then add our component to `declarations` and `bootstrap`. 
- Boostrap corresponds to the &lt;appRoot&gt; tag in our HTML.

  <pre>
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
  </pre>
  
#### Bootstrapping Angular
- We bootstrap Angular with our `main.ts` file. We import from Angular's `@angular/platform-browser-dynamic` which allows us to perform dependecy injection and then using the imported `platformBrowserDynamic()` function we tell it which module to bootsrap

  <pre>
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import { AppModule } from './app/app.module';
    
    platformBrowserDynamic().bootstrapModule(AppModule);
  </pre>


#### Property Binding And Event Binding
 - We use `square bracket` notation to indicate **one-way dataflow** for binding a property (instead of standard sugar syntax for interpolation which is curly brackets)
 
   <pre>
      &lt;h1 [innerHTML]="title"&gt;&lt;/h1&gt;      
      &lt;img [src]="logo"&gt;                     //we bind the expression 'logo' which might be 'img/logo.svc'   
   </pre>
      
- We can perform **event binding** using normal brackets `()`

   <pre>
     &lt;button (click)="handleClick()" &gt;
     &lt;input type="text" [value]="{{name}}" (input)="handleInput($event)" (blur)="handleBlur($event)"&gt;
   </pre>
   
- We add the event handler function to our component:

  <pre>
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
  </pre>
     
- To perform **two-way data-binding** we have to use Angular's Forms Module so `import { FormsModule } from '@angular/forms'` and add it to our imports array
- We use combination of normal and square brackets `[()]` to tell Angular we are using two-way data-binding
   <pre&gt;
     &lt;button (click)=@handleClick()" &gt;
     &lt;input type="text" [ngModel]="{{name}}" (ngModelChange)="handleChange($event)"&gt;
     
     //This uses two-way data-binding
     &lt;input type="text" &lt;input type="text" [(ngModel)]="{{name}}" (input)="handleChange($event)"&gt;ngModel)]="{{name}}""&gt;  
   </pre>

#### Template Refs (`#`)
- A template ref allows to set a reference to a DOM node using the # syntax. In this example, we give the input box a `#username` reference and pass the value of this node to the onClick function on our button: 

  <pre>
     &lt;button (click)=@handleClick(username.value)" &gt;
     &lt;input type="text" #username"&gt;
  </pre>   
  
#### Basic Angular Directives  
- `ngIf` is Angular's if expression. Here name references a javascript variable. (Note that the * in `*ngIf` refers to a [WebComponent](https://developer.mozilla.org/en-US/docs/Web/Web_Components) template element. Angular sits on top of the Web Platform so we can use things like [ShadowDom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) and so in reality Angular is using the directive to put the our HTML inside a template which is what the * really represents)

  <pre>
      &lt;input type="text" [value]="name" (input)="handleChange($event.target.value)"&gt;
      &lt;div *ngIf="name.length &gt; 2"&gt;
        Searching for... {{ name }}
      &lt;/div&gt;  
  </pre>

- `ngFor` is used to iterate over an iterable. Here we have an array of passenger objects which have a fullname property. Angular also exposes the index for us.

  <pre>
      &lt;li *ngFor="let passenger of passengers; let i = index;"&gt;
        {{i}} : {{ passenger.fullname }}
      &lt;/li&gt;
      
- `ngClass` is used to apply styling for CSS/SASS classes. In this example, when the boolean flag `checkedIn` the `checked-in` style is applied and then when checkedIn is false the `checked-out` class is applied

  <pre>
    &lt;ul&gt;
      &lt;li *ngFor="let passenger of passengers; let i = index;"&gt;
        &lt;span class="status" [ngClass]="{
              'checked-in': passenger.checkedIn,
              'checked-out': !passenger.checkedIn
            }"&gt;
        &lt;/span&gt;
        {{ i }}: {{ passenger.fullname }}
      &lt;/li&gt;
    &lt;/ul&gt;  
  </pre>

- `ngStyle` is another directive which allows CSS/SASS styling to be applied to elements

   <pre>
     &lt;li *ngFor="let passenger of passengers; let i = index;"&gt;
       &lt;span class="status" [ngStyle]="{ backgroundColor: (passenger.checkedIn ? '#2ecc71' : '#c0392b')}"&gt;
       &lt;/span&gt;
       {{ i }}: {{ passenger.fullname }}
     &lt;/li&gt;  
   </pre>

#### Pipes
_ [Pipes](https://angular.io/guide/pipes) are functions for data transformation and can be applied (and chained) using `|` syntax similar to piping unix commands.
- Examples of pipe are json (which turns a JS object into JSON), date (performs date formatting) and uppercase
  <pre>
    &lt;p&gt;{{ passenger | json }}&lt;/p&gt;
    &lt;div class="date"&gt;
      Check in date: 
      {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
    &lt;/div&gt;
  </pre>
  
#### Safe Navigation Operator (`?`)
- The safe navigation operator allows us to perform an implicit null check:
  <pre>
     &lt;div class="children"&gt;Children: {{ passenger.children?.length || 0 }}&lt;/div&gt;
  </pre>

#### Component Architecture and Presentational Components
- One important distinction with respect to components is container components and presentational components. These are sometimes often referred to as stateful and stateless components (or smart/dumb components). Smart/Container components may receive data from a service and then feed dumb/presentational components.
- Data is flowed by events (and **event emitters**). Container components talk to the back end and the child presentational components are re-rendered.
- To enforce separation of concerns we can divide up our application into **feature modules**. Here we create a feature module ([passenger-dashboard](https://github.com/UltimateAngular/angular-fundamentals-src/tree/master/16-container-component) module which lives in its own passenger-dashboard directory. We then import this module into our `app.ts` imports and the `imports` array. We also have to export it or it will not be available. It's a good idea to put container compents into a subdirectory called `containers`  
- Note that `app.css` in top level `css` directory applies global styles but we usually use encapsulated styles (i.e. scoped to the component) for each component (and in this example we use passenger-dashboard.component.scss))
  
  <pre>
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
  </pre>
 
- And we have a our component and create a `models` directory which contains our interfaces (which we should be exported!)

  <pre>
    import { Component } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        &lt;div&gt;
          &lt;h3&gt;Airline Passengers&lt;/h3&gt;
          &lt;ul&gt;
            &lt;li *ngFor="let passenger of passengers; let i = index;"&gt;
              &lt;span 
                class="status"
                [class.checked-in]="passenger.checkedIn"&gt;&lt;/span&gt;
              {{ i }}: {{ passenger.fullname }}
              &lt;div class="date"&gt;
                Check in date: 
                {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
              &lt;/div&gt;
              &lt;div class="children"&gt;
                Children: {{ passenger.children?.length || 0 }}
              &lt;/div&gt;
            &lt;/li&gt;
          &lt;/ul&gt;
        &lt;/div&gt;
      `
    })
    export class PassengerDashboardComponent {
      passengers: Passenger[] = [...passenger array...];
    }
  </pre>
   
#### Lifecyle Hooks (`@OnInit`)
- Lifecycle hooks allow Angular to perform certain actions on various lifecycle events. The `@OnInit` hook allows us to execute logic on initilisation of the component.
- To use OnInit we must import it from `'@angular/core` and declare thar our class `implements OnInit` and implement the `ngOnInit()` method: 
  <pre>
    import { Component, OnInit } from '@angular/core';
    import { Passenger } from '../../models/passenger.interface';
    
    @Component({
      selector: 'passenger-dashboard',
      styleUrls: ['passenger-dashboard.component.scss'],
      template: `
        &lt;div&gt;
          &lt;h3&gt;Airline Passengers&lt;/h3&gt;
          &lt;ul&gt;
            &lt;li *ngFor="let passenger of passengers; let i = index;"&gt;
              &lt;span 
                class="status"
                [class.checked-in]="passenger.checkedIn"&gt;&lt;/span&gt;
              {{ i }}: {{ passenger.fullname }}
              &lt;div class="date"&gt;
                Check in date: 
                {{ passenger.checkInDate ? (passenger.checkInDate | date: 'yMMMMd' | uppercase) : 'Not checked in' }}
              &lt;/div&gt;
              &lt;div class="children"&gt;
                Children: {{ passenger.children?.length || 0 }}
              &lt;/div&gt;
            &lt;/li&gt;
          &lt;/ul&gt;
        &lt;/div&gt;
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
  </pre>