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

### Components: Pipes

- A pipe is a template mechanism for transforming date

| Pipe            | Example                                             | Description                                                                    |
|-----------------|-----------------------------------------------------|--------------------------------------------------------------------------------|
| Date Pipe       | `{{ startDate `&#124;` date: 'dd/MMM/yyyy' }}`      | Formats a javascript date given a specific format                              |
| String Pipe     | `{{ title `&#124;` titlecase }}`                    | Formats a string to titlecase                                                  |
| Number Pipe     | `{{ price `&#124;` number'3.3-5 }}`                 | Formats 3 min integer digits and min 3 fractional and max 5                    |
| Currency Pipe   | `{{ price `&#124;` currency: 'GBP' }}`              | Formats a number as currency (USD by default)                                  |
| Percentage Pipe | `{{ rate `&#124;` percent }}`                       | Formats as a percentage i.e. 0.67 = 67%                                        |
| Slice Pipe      | `*ngFor="let course of courses `&#124;` slice:0:2"` | Works like js slice function - here we slice first 2 elements of a collection  |
| JSON Pipe       | `{courses` &#124; `json }}`                         | Outputs an object as json (useful for debugging                                |
| Key value Pipe  | `*ngFor="let pair of course `&#124; `keyvalue"`     | Outputs key value pairs - we can refer to `pair.key` and `pair.value`          |

---

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
---
## Content Projection

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

---

## Angular Templates

### Content injection using `ng-template` and `TemplateRef`
- The `ng-template` directive allows content to be injected which is not displayable but which can be rendered based on logic. Perhaps the most use is in the else of `ngIf`:
```angular2html
    <img [src]="foo.icon" *ngIf="isImageAvailable(); else noImage">
```
- We can programmatically instantiate a template using `*ngTemplateOutlet`pass a `context` and we can give our template its own variable scope using the `let` keyword:
```angular2html
    <ng-template #blankTemplate let-courseName="description">
       <p>{{coursename}} has image is available </p>
    </ng-template> 
    
    <ng-container *ngTemplateOutlet="blankTemplate; context: {description: course.name}">
    </ng-container>
```
- The most common usage is to actually inject the template on to our component by declaring an input:

````typescript
  @Input()
  noImageTpl: TemplateRef<any>
  
````
- ..and we use the `*ngTemplateOutlet` to render the inputted template: 

```angular2html
    <ng-content select="course-image" *ngIf="course.iconUrl; else noImage"></ng-content>
    <ng-template #noImage>
        <ng-container *ngTemplateOutlet="noImageTpl; context: {description: course.name}"></ng-container>  //we are now using the template injected as an input
    </ng-template>
    
```    
---
## Angular Directives  

## Attribute Directives: Using `@HostBinding` to Bind to Dom Elements
- Commons structural directives are `*ngFor` and `*ngIf`. Attribute directives are attributes on an Angular element e.g. `disabled` or `required` (e.g. `<input name="email" required>`)
- We can create our own custom directives using the CLI: `ng g directive directives/highlighted` and notice the selector now refers to the element directive. 
- We can use the `@HostBinding` to bind to any **known DOM element** but note that we have to use a getter method (`get`) - if the DOM property is not known then Angular will throw an error.
- We create our directive which is binding to the host elment of `course-card`
```angular2html
    <course-card highlighted #highlighter="hl"  [isHighlighted]="true" (toggleHighlight)="onToggle($event)" (courseSelected)="onCourseSelected($event)" [course]="course">
```
- ..The selector in this case refers to the attribute `highlighted`:
```typescript
    import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
    
    @Directive({
        selector: '[highlighted]', //this is an attribute selector so it will be applied to any elemnt with this attribute
        exportAs: 'hl'
    })
    export class HighlightedDirective {
        constructor() {}
        
        @Input('highlighted')
        isHighlighted = false;
    
        @HostBinding('className')   //we are binding here to the className DOM property
        get cssClasses() {
            return this.isHighlighted;
        }
    
        @HostBinding('class.highlighted')   //provides a short hand for referring to CSS class names
        get cssClasses() {
            return true
        }

        @HostBinding('attr.disabled')   //provides a short hand for referring a DOM attribute
        get disabled() {
            return true
        }
    }
```

## Angular Directives: Interacting with Events using `@HostListener`
- In our directive we can listen to events using `@HostListener` - we can also emit events
```typescript
    import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
    
    @Directive({
        selector: '[highlighted]', //this is an attribute selector so it will be applied to any elemnt with this attribute
        exportAs: 'hl'
    })
    export class HighlightedDirective {
        constructor() {}
        
        @Output
        toggleHighlight = new EventEmitter()
            
        @HostListener('mouseover')   //we are binding here to the mouseover event
        get cssClasses() {
            this.isHighlighted = false;
            this.toggleHighlight.emit(isHighlighted)
        }

        @HostListener('mouseleave')   //we are binding here to the mouseleave event
        get cssClasses() {
            this.isHighlighted = false;
            this.toggleHighlight.emit(isHighlighted)
        }
    
    }
```

## Angular Directives: Get A Handle on Directives in Components Using `exportAs`

- We make a directive's functionality available to the template using `exportAs` of the directive decorator. In the above example, we export the directive as `hl` - in the template, we create a template reference and assign it to the name to export the directive `#highlighter="hl"` and then in the child we can call the `toggle()` method i.e. `(dblclick)="highlighter.toggle()"` 
```angular2html
     <div class="courses">
    <course-card highlighted #highlighter="hl" (toggleHighlight)="onToggle($event)" (courseSelected)="onCourseSelected($event)" [course]="course">
        <course-image [src]="course.iconUrl" *ngxUnless="!course.iconUrl"></course-image>
        <div class="course-description" (dblclick)="highlighter.toggle()" >{{ course.longDescription }}
        </div>
    </course-card>
```
- In the parent component we can also get a reference to the directive using:
```typescript
  @ViewChild(HighlightedDirective)
  highlighted: HighlightedDirective
```
- If the component had multiple uses of the same directive we can use `@ViewChild` on the component and `read` property to get a handle on the directive:
```typescript
  @ViewChild(CourseCardComponent, {read: HighlightedDirective})
  highlighted: HighlightedDirective
```

## Angular Directives: Custom Structural Directives
- Structural directives use the `*` syntax and allow us to add or remove other elements from the page. We can build our own structural directives and by convention we prefix custom structural directives using `*ngx-` 
- Structural directives are always applied to templates so there is an implicit template (or `ng-template` if the syntax was de-sugared). In our custom structural directive we pass a `TemplateRef` in the constructor (which is our template) but we also need a `ViewContainerRef` so we can programatically render the template using the `createEmbeddedView(this.templateRef)` method
- We required a setter method (using method marked as `set`) which related to the condition in the template:
```typescript
import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ngxUnless]'
})
export class NgxUnlessDirective {

  visible = false;
  
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  @Input()
  set ngxUnless(condition:boolean) {
      if (!condition && !this.visible) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.visible = true;
      }
      else if (condition && this.visible) {
          this.viewContainer.clear();
          this.visible = false;
      }
  }
}
```
---
## Angular View Encapsulation: `:host, `::host-context` selector and `ng-deep`
- When defining a component we can specify a `styleUrls` which has styles which are specific in scope to this component. These styles are only available to the component and not to parent or child components.
```angular2html
@Component({
    selector: 'course-card',
    templateUrl: './course-card.component.html',
    styleUrls: ['./course-card.component.css']
})
```
- We can use the special selector `:host` is a special selector which targets the host element itself
- We can also use `::ng-deep` modifier is a way of bypassing view encapulation. The part before this selector is still specific but not after so in the case of `course-card ::ng-deep .course-description` the `course-description` styling is not specific to the component. Typically the use case for this is if we want to style elements which we have received via content projection.
- The `::host-context` allows us to style  a component depending on the presence of styles outside the component itself but the style will be only be applied to whatever is after the `::host-context` 
- The default encapulation of style is `ViewEncapulation.Emulated`. We can also choose `ShadowDom` which is similar to emulated but does it natively using the browser APIs which uses styles inside `#shadowRoot`
```angular2html
@Component({
selector: 'course-card',
templateUrl: './course-card.component.html',
styleUrls: ['./course-card.component.css'],
encapulation: ViewEncapulation.ShadowDom
})
```
---
## Angular Injectable Services
- We can use Angular's `httpClient` along with `HttpParams` to make an HTTP get call `http.get<T>('/api/courses', {params})` and this will return an `Observable` which we must subscribe to. 
- In the view we use the `async` pipe to implicitly subscribe to an Observable and Angular will also handle unsubscribing. We can put in an `*ngIf`
```angular2html
    <div class="courses>"*ngIf="courses$ | async as courses">
        <course-card *ngFor="let course of courses" [course]="course" (courseChanged)="save($event)">
    </div>
```
- It is preferred to encapsulate making HTTP calls using a custom service in a `services` folder. We use the `@Injectable({providedIn: 'root'})` annotation to perform dependency injection which injects the service as a singleton:
```typescript
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Course} from '../model/course';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class CoursesService {
    
  constructor(private http: HttpClient) {}

  loadCourses(): Observable<Course[]> {
      const params = new HttpParams().set("page", "1").set("pageSize", "10");
      return this.http.get<Course[]>('/api/courses', {params});
  }

  saveCourse(course:Course) {
      const headers = new HttpHeaders().set("X-Auth", "userId");
      return this.http.put(`/api/courses/${course.id}`,course,{headers});
  }

}
```
- To perform the save then in our course-card component we have an `EventEmitter` which will cause the `save` method to be called when it receives the `courseChanged` event:
```typescript
    @Output('courseChanged')
    courseEmitter = new EventEmitter<Course>();

    onSaveClicked(description: string) {
        this.courseEmitter.emit({...this.course, description}); //we use the spread and override the description
    }
```
and in the corresponding html template we have a button where the `onSaveClicked` is wired to a click event:
```angular2html
<div class="course-card" *ngIf="course" #container>
  <div class="course-title">
      {{ cardIndex || '' + ' ' + course.description }}
  </div>
  <ng-content select="course-image" *ngIf="course.iconUrl"></ng-content>
  <div class="course-description">
    Edit Title: <input #courseTitle [value]="course.description">
  </div>
  <div class="course-category">
    <div class="category" i18n>
        {
            course.category,
            select,
            BEGINNER {Beginner}
            INTERMEDIATE {Intermediate}
            ADVANCED {Advanced}
        }
    </div>
  </div>
  <button (click)="onSaveClicked(courseTitle.value)">Save Course</button>

</div>
```
- Note that in our application component we have the save method which must subscribe to the observable to take effect:
```typescript
    save(course: Course) {
        this.coursesService.saveCourse(course)
            .subscribe(
                () => console.log('Course Saved!')
            );
    }
```
---
## Angular Dependency Injection: Custom Providers, InjectionTokens and injecting Configuration
- By default, Angular will support class names as injection tokens (because class names are available at runtime) but not interfaces because interfaces don't exist at runtime only at compile time. When a component is instantiated it Angular will go through the providers for that component to see if there is a provider for that dependency and if there is not one then it will move on to its parents to see if there is a provider and if there is then it will take it from there (this is called **hierarchical dependency injection**). 
- Generally speaking, we want singletons when they are stateless but if a dependency is stateful then we might want to provider at a level of a component
- Angular dependency injection depends on `providers`. If a provider is not found then Angular will complain `NullInjectorError: No provider for FooService`. The provider is what creates the dependency and it provides Angular a factory function which can be called. The `@Injectable({providedIn: 'root'})` allow us to create a [Tree-shakeable provider](https://coryrylan.com/blog/tree-shakeable-providers-and-services-in-angular) but we can also define our factory function and associate with a unique key known as an **Injection Token**:
```typescript
 
    const COURSES_SERVICE = InjectionToken<CoursesService>('COURSES_SERVICE')
    
    function coursesServiceProvider(httpClient: HttpClient): CoursesService{
        return new CoursesService(httpClient);
    }
```
- We can now configure the dependency injection with our factory function and our injection token and we also need to supply dependencies for the factory using `deps`:
```typescript
    @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        {
            provide: COURSES_SERVICE, //If we just put the classname (CoursesService) then this would also work
            useFactory: coursesServiceProvider, 
            deps: [HttpClient]}
    ]
    })
```
- Now in our constructor we inject our service by using `@Inject` annotation taking the injection token:
``` typescript
    constructor(@Inject(COURSES_SERVICE) private coursesService: CoursesService) {
    }
```
- In our provider if we use `useClass: CoursesService` then Angular will use the class and can supply all dependencies - this could actually be simplified to `providers: [ CoursesService]`
- **Tree-shaking** is the concept of Angular 'shaking the dependency tree' to make sure dependencies are removed which are not used and which could bloat the application bundle (e.g a generic module which has services attached to it). Therefore, the purpose of tree-shaking is to remove dead/unused code.
- We can override our injectable settings to provide a tree-shakeable dependency - `providedIn` specifies the level at which the component is injected with `root` being available to the entire system. Now if our services is never passed in any constructor then it will not be included in the bundle
```typescript

@Injectable({
    providedIn: 'root',
    useFactory: (http) => new CoursesService(http), //factory function
    deps: [HttpClient]
})
export class CoursesService {

}    
```
- But we can replace factory function with `useClass: CoursesService` and remove dependencies specified in `deps` and since this is default behaviour so doesn't need to be specified we are just left with:
```typescript

@Injectable({providedIn: 'root'})
export class CoursesService {

}    
```
- Sometimes we want to an object (maybe containing application wide config)
```typescript
export interface AppConfig{
    apiUrl: string
}
export const APP_CONFIG: AppConfig = {
    apiUrl: 'http://localhost:9000'
}
export const CONFIG_TOKEN = new InjectionToken<AppConfig>('CONFIG_TOKEN');

```
- In our `app.component.ts` we can inject the `AppConfig` but because this is an interface and not a class we must specify the injection token using `@Inject(CONFIG_TOKEN)`:
```typescript
import {AppConfig, CONFIG_TOKEN} from './config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [{ provide: CONFIG_TOKEN, useValue: APP_CONFIG}]   //note this is not tree-shakeable
})
export class AppComponent implements OnInit {
    
    constructor(
        private coursesService: CoursesService,
        @Inject(CONFIG_TOKEN) private config: AppConfig,
        private injector: Injector) {
    }
}
```
- To make the above tree-shakeable we must change our `InjectionToken` and now we can remove providers in our `app.component.ts`:
```typescript
export const CONFIG_TOKEN = new InjectionToken<AppConfig>('CONFIG_TOKEN', { providedIn: 'root', factory: () => APP_CONFIG });
```
- There are additional **dependency injection decorators** 
 - We can mark a dependency as `@Optional()` but we need to guard about when it will not be defined
 - `@Self` (which might be used on a constructor dependency) overrides hiercharical dependency injection
 - `@SkipSelf` skips local providers and will always go to parent through hiercharical dependency injection
 - `@Host` ensures the provider comes from directly from the host/parent but not beyond it (i.e. any further up the hierarchy)

---
## Angular Change Detection: Default vs OnPush
- We can use change detection such as a `keyup` event to call a method `onTitleChanged()` passing our template reference. Angular's default change detection will *scan the entire component tree* after each event (because all javascript objects are mutable). Note that Ajax requests or a `setTimeout` or `setInterval` event will also trigger Angular's change detection. Angular's default change detection is therefore very safe but it is quite expensive because it has to compare the entire tree:

```angular2html
<div class="course-card" *ngIf="course" #container>
  <div class="course-title">
      {{ cardIndex || '' + ' ' + course.description }}
  </div>
  <ng-content select="course-image" *ngIf="course.iconUrl"></ng-content>
  <div class="course-description">
    Edit Title: <input #courseTitle [value]="course.description" (keyup)="onTitleChanged(courseTitle.value)">
  </div>
  <div class="course-category">
    <div class="category" i18n>
        {
            course.category,
            select,
            BEGINNER {Beginner}
            INTERMEDIATE {Intermediate}
            ADVANCED {Advanced}
        }
    </div>
  </div>
  <button (click)="onSaveClicked(courseTitle.value)">Save Course</button>
</div>
```
- Now in our component we can have which changes the model (i.e the course) and 
```typescript
    onTitleChanged(newTitle: string) {
        this.course.description = newTitle;
    }
```
- For performance reasons, we sometimes may want to override default change detection to avoid Angular comparing the entire tree and we can specify another change detection strategy for the component using `ChangeDetectionStrategy.OnPush` which means parts of the hierarchy does not get checked for changes. Angular is now not trying to detect changes in each expressions of the template but only on certain places and it does so by **object reference comparison** s(which is much faster) and the places where it tries to detect change are:
  - change in the component's inputs (i.e. marked with `@Input`) or 
  - chane in any `Observable` streams which are resgistered with the async pipe in the template
 
```typescript
@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class CourseCardComponent implements  OnInit { }
```
- Another performance optimisation is to use the attribute decorator, `@Attribute`. We can use this to avoid using an `@Input` for a value which we know will not change and therefore which does not need to be checked by Angular for changes ("one time binding"). So in our our child component (which is a course card) we use the constructor:
```typescript
    constructor(private coursesService: CoursesService, @Attribute('type') private type: string) { }
```
and in in our parent template we remove the square brackets from our `courses` attribute that would bind it to an `@Input`:
```angular2html
  <div class="courses">
    <course-card *ngFor="let course of  courses" (courseChanged)="save($event)" type="beginner" [course]="course">
      <course-image [src]="course.iconUrl"></course-image>
    </course-card>
  </div>
```
- We can also do custom change detection via any component's `ChangeDetectorRef`. Every components has it own instance of `ChangeDetectorRef` and we can use `markForDetect()`
```typescript
    constructor( private service: MyService, private changeDetector: ChangeDetectorRef){ 
    
   }
   
   ngOnInit(){
      this.service.loadItems().subscribe( items =>{
          this.items = items;
          this.changeDetector.markForCheck();
      }) 
   }
```
- As a last resort to address performance issues, we can also perform custom change detection via the lifecycle hook `DoCheck` and implementing `ngDoCheck()` which will get called every time change detection happens:

```typescript
    constructor( private service: MyService, private changeDetector: ChangeDetectorRef){}

    ngDoCheck(){
      this.changeDetector.markForCheck();
   }
```
---
## Angular Lifecycle Hooks
- `OnInit` => Only gets called once on creation of component after the constructor - note that with the constructor the component's inputs (marked as `@Input`) will still be undefined hence the need for `ngInit`. So constructors should never contain logic but only assignment to member variables. 
- `OnDestroy` => Only gets called once on destruction of component so is used to release resource and unsubscribe from observables (but should not be needed if we are using the async pipe)
- `OnChanges` => Will first get called after constructor but before `ngOnInit` but will then get changed whenever something changes in the component lifecycle. The `ngOnChanges` method takes the `changes` object and this may contain a simple change which will include before and after values. Note that `ngOnChanges` doesn't get triggered if an object properties changes but only if the object itself changes
- `AfterContentChecked` => Will first get called after constructor and after `ngOnInit` or whenever Angular finishes checking the content which is after every event Angular is handling (i.e. whenever there is change detection). It gets called a lot so any implementation we put in must be lightweight. If we try to change parts of the content part of the component in this method we may get `ExpressionChangedAfterItHasBeenCheckedError` - this is because the Angular's change detection mechanism should not itself change the state or we could get into an infinite loop
- `AfterViewChecked` => Will first get called after `ngAfterContentChecked`. We cannot use to change any view/template elements, but we can apply DOM operation to elements (e.g. scrolling, setting focus)
- The order of lifecycle hooks from construction is follows: constructor -> ngOnChanges -> ngOnInit -> ngDoCheck -> ngAfterContentInit -> ngAfterContentChecked -> ngAfterViewInit -> ngAfterViewChecked -> ngDoCheck -> ngAfterContentChecked -> ngAfterViewChecked
- The order of lifecycle hooks when editing (i.e. source has changed) is follows: ngOnChanges -> ngDoCheck -> ngAfterContentChecked -> ngAfterViewChecked -

---
## Angular Modules Deep Dive
- A module is an organisational unit where we can put together components, services and directives which are related and also defines
   - `declarations` contains all the components/pipes/directives which *belong* to the module
    - `imports` contains a list all other module dependencies which must be imported
    - `providers` defines providers so if we just use `@Injectable()` (i.e. not tree-shakeable) then we must define a provider here
    - `bootstrap` defines the root component(s) so we could have 2 bootstrap (e.g `<app-module></app-module> <other-module></other-module>`)
    - `exports` defines what is visible outside the module (i.e. not private to the module) - this is typically to fix the error `Can't bind to foo since it isn't a known property of bar`
- Here we define the AppModule:    
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {CoursesModule} from './courses/courses.module';
import {CourseTitleComponent} from './course-title/course-title.component';

@NgModule({
    declarations: [
        AppComponent,
        CourseTitleComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CoursesModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [CourseTitleComponent]
})
export class AppModule {
}
```
- We can generate a feature module (which we'll call Courses) using CLI with `ng generate module Courses` - we will need to include `CommonModule`

---
## Angular Pipes Deep Dive
- We can implement a simple pipe which has no side effect ("pure pipe"):
```typescript
@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategory implements PipeTransform { 
    
    transform(courses: Course[], category: string){
        return courses.filter(courses => courses.category == category)
    }
}
```
In the template we pass `category` after colon which will be second argument to pipe:
```angular2html
   <course-card *ngFor="let course of  (courses | filterByCategory: 'BEGINNER')" (courseChanged)="save($event)" 
             type="beginner"  [course]="course">
```
- Note that the change detection will only happen when the input value `courses` changes and then Angular knows the template needs to be re-rendered but mutating the input of the pipe directly will not cause the pipe to be retriggered - this is an Angular optimisation as pipes are pure by default. We can override the behaviour described and make the pipe impure as follows:
```typescript
@Pipe({
  name: 'filterByCategory',
  pure: false
})
```

---
## Angular Elements Deep Dive
- Sometimes we may want to generate our own content or a custom element which is outside of Angular (e.g. 3rd party widget). In this case the browser take care of it via the browser's [Custom Elements API](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) which is part of the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard. 
  Firstly, we need to add Angular elements:
  
```shell
  ng add @angular/elemeents --project-name=angular-course
``` 
Now in the `ngOnInit` method our `AppComponent` we call `createCustomElement` passing the component we want to turn into a custom element. We also pass the Angular injector to fetch dependencies and then we register with the browser using `customElements.define('course-title', htmlElement)` where `course-title'` is the tag we are defining as a custome element:
 ```typescript
 ngOnInit() {
        const htmlElement = createCustomElement(CourseTitleComponent, {injector:this.injector});
        customElements.define('course-title', htmlElement); 
    }
```
We now add our custom component under `entryComponents` of the module, to tell Angular this is a programmatically defined component and declaratively defined:

```typescript
@NgModule({
  bootstrap: [AppComponent],
  entryComponents: [CourseTitleComponent]
})
export class AppModule {

```
