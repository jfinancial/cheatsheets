# ANGULAR CORE DEEP DIVE

The source for these notes are the [Angular University's Angular Core Deep Dive](https://www.udemy.com/course/angular-course) course 

## COMPONENTS

### Components: Template Refs, Property Bindings, `@Input` and `@Output`

| Syntax                                                                   | Description                                                                      |
|--------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| `{{planet.name == "Earth" ? "Home" : "Moon"}}`                           | Double braces `{}` wrap an Angular expression                                    |
| `<input [value]="data.title">`                                           | Square brackets `[]` are used for property binding                               | 
| `<input [value]="data.title" (keyUp)="onKeyUp()">`                       | Brackets `()`  bind an event handler to an `@Output()` or DOM event              |
| `<input [value]="data.title" (keyUp)="onKeyUp(tInput.value)" #tInput>`   | Template Reference (#) allows us to refer to an element in the template          |
| `@Input foo: Foo     `                                                   | Mark as an input to the component - use square brackets on parent to pass input  |
| `@Output selected = new EventEmitter<Foo>()`                             | Mark as an output of the component                                               |
| `@Output('fooSelected') selected = new EventEmitter<Foo>()`              | Mark as an output to a custom event (i.e. `(fooSelected)="onFooSelected($event)` |
| `<button (onClick)="onClick($event)">Click</button>`                     | Passing event from event (note custom events do not bubble up)                   |
|

### Components: `ngFor`, `ngSwitch`, `ngIf` and `ng-Container`

- `ngFor` => In the below example we iterate over the array `foos` - note that `ngFor` also provides an index and a `first` and `last` - the `[claas]` takes a boolean expresison

```angular2html
    <foo *ngFor="let foo of foos" 
         [foo]="foo;index as i; first as isFirst; " 
         [fooIndex]="i"
         [class.is-first]="isFirst"
         [class.is-Last]="isLast">
    </foo>
```

- `ngIf` => In the below example we use ngIf to determine if a value is defined, it can also call a function which returns a boolean

```angular2html
    <img *ngIf="foo.iconImg">
```
- We can use use `ngIf` with an `else` followed by a template reference to render a template if the boolean condition is not met

```angular2html
    <div *ngIf="foo"> 
      <img [src]="foo.icon" *ngIf="isImageAvailable(); else noImage">
      <ng-template #noImage>
         <p> No image is available </p>
      </ng-template> 
    </div>
```

- We can use use `ngSwitch` as a switch statement - note we use`*ngSwitchCase` and `*ngSwitchDefault` for individual cases and the default condition

```angular2html
    <div class="course-category" [ngSwitch]="course.category">
        <div class="category" *ngSwitchCase="'BEGINNER'">Beginner</div>
        <div class="category" *ngSwitchCase="'INTERMEDIATE'">Intermediate</div>
        <div class="category" *ngSwitchCase="'ADVANCED'">Advanced</div>
        <div class="category" *ngSwitchDefault>All Levels</div>
    </div>
```

- We can use `ng-Container` to create a container which does not add a `<div>` and can use an `ngIf` on the container:

```angular2html
  <ng-container *nfIg="course">
    ...
 </ng-container>
```

### Components: `ngClass` and `ngStyle`

- We can use `ngClass` to apply conditional CSS classes
```angular2html
    <div *ngIf="foo" [ngClass]="myClasses()"> 
```
```typescript
    myClasses(){
        if(this.course.category == 'BEGINNER') {
           return 'beginner'; 
        }
    }
```

- We can use `ngStyle` to apply certain an (additional) style directly to a component
```angular2html
    <div *ngIf="foo" [ngClass]="myClasses()" [ngStyle]="{'text-decoration' : 'underline'}"> 
```

### Pipes
- Pipe is a template mechanism for transforming date

| Pipe            | Example                                           | Description                                                                    |
|-----------------|---------------------------------------------------|--------------------------------------------------------------------------------|
| Date Pipe       | `{{ startDate `&#124;` date: 'dd/MMM/yyyy' }}`    | Formats a javascript date given a specific format                              |
| String Pipe     | `{{ title `&#124;` titlecase }}`                  | Formats a string to titlecase                                                  |
| Number Pipe     | `{{ price `&#124;` number'3.3-5 }}`               | Formats 3 min integer digits and min 3 fractional and max 5                    |
| Currency Pipe   | `{{ price `&#124;` currency: 'GBP' }}`            | Formats a number as currency (USD by default)                                  |
| Percentage Pipe | `{{ rate `&#124;` percent }}`                     | Formats as a percentage i.e. 0.67 = 67%                                        |
| Slice Pipe      | `*ngFor="let course of courses &#124;` slice:0:2` | Works like js slice function - here we slice first 2 elements of a collection  |
| JSON Pipe       | `{courses `&#124;` json }}`                       | Outputs an object as json (useful for debugging                                |
| Key value Pipe  | `*ngFor="let pair of course `&#124; `keyvalue"`   | Outputs key value pairs - we can refer to `pair.key` and `pair.value`          |


### Template Querying  using `@ViewChild` and `@ViewChildren` and the `AfterViewInit` LifecycleHook
- We can use a template query to get a reference in a component to an element in a child component - we can do this referring to the class...
```typescript
    @ViewChild(CourseCardComponent)
    card: CourseCardComponent
    
```
- ..or if we have multiple matching elements, we can use the **template reference**

```typescript
    @ViewChild('cardRef1')
    card1: CourseCardComponent;
    @ViewChild('cardRef2')
    card2: CourseCardComponent;
```
- We can also get **native DOM elements** using `ElementRef` - we can also get the plain HTML DOM element of our compoennt using options `read` property:
```typescript
    @ViewChild('container')
    containerDiv: ElementRef;
    @ViewChild('cardRef1', {read: ElementRef} )  
    card1: CourseCardComponent;
```
- We need know when we can get these references and so we need to implement the `AfterViewInit` lifecycle hook if we want to manipulate these elements on construction but this needs to be done *asynchronously* 
- Using `@ViewChild` the scope is limited to the template itself so we cannot get elements in subchildren  
- We can use `@ViewChildren` which returns a `QueryList` object which has properties `first`, `last`, `forEach`, `length`, `map` and we have the `changes` observable  
```typescript
    @ViewChild(CourseCardComponent)
    card: QueryList<Course>
```

### Content Projection using `<ng-Content>`, `@ContentChild`,  `@ContentChildren` and `AfterContentInit` Lifecycle hook
- Templates have fixed content but using content projection we can make this more configurable (e.g instead of display an image, we display a video)
- Here we have the parent template which contains the content to be projected
```angular2html P
    <course-card (courseSelected)="onCourseSelected($event)" [course]="course">
        <-- the content to be projected -->
        <img width="300" [src]="course.icon"
    </course-card>
```
- Here we have the child template which contains `ngContent` tag

```angular2html 
    <div class="course-card" *ngIf="course">
        <div class="coursetitle"> {{ cardIndex || ' ' + course.description }}</div>
        <ng-Content>/<ng-Content>
    </course-card>
```
- Note that we can also use the `select` propert to use CSS selection (e.g `<ng-Content select="img">/<ng-Content>` so here only the `<img>` get projected or `<ng-Content select=".course-img">/<ng-Content>` so here element marked with CSS class `course-img` get projected
- To get a reference to an element inside the content projection we need to user `@ContentChild` (the scope is restricted to what is inside the `ng-Content`)
- To get a reference to a collection of elements inside the content projection we need to user `@ContentChildren` (the scope is restricted to what is inside the `ng-Content`)
- We need to use the `AfterContentInit` lifecycle hook to get references to elements which are rendered via content projection


### Content injection using `ng-template` and `TemplateRef`
- The `ng-template` directive allows content to be injected which is not displayable but which can be rendered based on logic. Perhaps the most use is in the else of `ngIf`:
```html 
    <img [src]="foo.icon" *ngIf="isImageAvailable(); else noImage">
```
- We can programmatically instantiate a template using `*ngTemplateOutlet`pass a `context` and we can give our template its own variable scope using the `let` keyword:
```html 
    <ng-template #blankTemplate let-courseName="description">
       <p>{{coursename}} has image is available </p>
    </ng-template> 
    
    <div *ngTemplateOutlet="blankTemplate; context: {description: course.name}">
    </div>
```
- The most common usage is to actually inject the template on to our component by declaring an input:

````typescript
  @Input()
  noImgTemplate: TemplateRef<any>
  
````
