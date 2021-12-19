# REACTIVE ANGULAR DESIGN

The source for these notes are the [Angular University's Reactive Angular (with RxJs)](https://www.udemy.com/course/rxjs-reactive-angular-course) course 
 The source code is contained [here](https://github.com/angular-university/reactive-angular-course)

### Pattern #1: Stateless Observable-based Services (avoiding duplicate http requests using `shareReplay()`)

- We want avoid ["callback hell"](http://callbackhell.com/) which even when using Obseravbles and manually subscribing then this might occur in a bloated `subscribe()` method. 
- When we have services that have mutable state then when this state changes there is no way for the rest of the application to know this state was modified. Also we can't use optiimized change detection such as `onPush` which only looks at a component's inputs
- The solution is to refactor into stateless services and note how we use `shareReplay()`
```typescript
  import {Injectable} from '@angular/core';
  import {HttpClient} from '@angular/common/http';
  import {Course} from '../model/course';
  import {Observable} from 'rxjs';
  import {map, shareReplay} from 'rxjs/operators';
  import {Lesson} from '../model/lesson';
      
  @Injectable({providedIn:'root'})
  export class CoursesService {
  
      constructor(private http:HttpClient) {}
  
      loadCourseById(courseId:number) {
         return this.http.get<Course>(`/api/courses/${courseId}`).pipe(
                shareReplay()
              );
      }
  
      loadAllCourseLessons(courseId:number): Observable<Lesson[]> {
          return this.http.get<Lesson[]>('/api/lessons', {
              params: {
                  pageSize: "10000",
                  courseId: courseId.toString()
              }
          }).pipe(
                  map(res => res["payload"]),
                  shareReplay()
              );
      }
  
      loadAllCourses(): Observable<Course[]> {
          return this.http.get<Course[]>("/api/courses").pipe(
                  map(res => res["payload"]),
                  shareReplay()
              );
      }
  
  
      saveCourse(courseId:string, changes: Partial<Course>):Observable<any> {
          return this.http.put(`/api/courses/${courseId}`, changes).pipe(
                  shareReplay()
              );
      }
  
  
      searchLessons(search:string): Observable<Lesson[]> {
          return this.http.get<Lesson[]>('/api/lessons', {
              params: {
                  filter: search,
                  pageSize: "100"
              }
          }).pipe(
                  map(res => res["payload"]),
                  shareReplay()
              );
      }
      
  }
```
- We use Angular's `async` pipe to subscribe to the observables (and which will automatically handle unsubscribing):
```angular2html
   <div class="courses" *ngIf="courses$ | async as courses">
       <course-card *ngFor="let course of courses" [course]="course" (courseChanged)="save($event)">
   </div>
```


### Pattern #2: Smart vs Presentational Components
- **Presentational components** only handle encapsualates pure presentation logic display concerns
- **Smart components** generally delegate to services and then feed the data for presentational component
- Above we declared
- 
```typescript
  @Component({
      selector: 'course-dialog',
      templateUrl: './course-dialog.component.html',
      styleUrls: ['./course-dialog.component.css'],
      providers: [ LoadingService, MessagesService ]
  })
  export class CourseDialogComponent {
  
      form: FormGroup;
      course:Course;
  
      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<CourseDialogComponent>,
          @Inject(MAT_DIALOG_DATA) course:Course,
          private coursesService: CoursesService
          ) 
      {
          this.course = course;
          this.form = fb.group({
              description: [course.description, Validators.required],
              category: [course.category, Validators.required],
              releasedAt: [moment(), Validators.required],
              longDescription: [course.longDescription,Validators.required]
          });
      }
  
      save() {
        const changes = this.form.value;
        this.coursesService.saveChanges(this.course.id, changes).subscribe(
           val => { dialogRef.close(val); }
        );   
      }
  
      close() { this.dialogRef.close();}
  } 
```


### Pattern #3: Decoupled Communication Via A Shared Service (e.g Spinners & Loading Service, Error Messages Panel & Message Service) And Custom Observables
- Often we may have components at different levels in the component hierarchy tree that need interact and cannot use `@Input` because there is no parent-child relationship between these components. 
- An example of this situation is where we might want to use a **spinner** which might live at the application root level above the `<route-outlet>`
- We can use Materialize spinner as `loading-component.html`. The template checks the `loading$` Observable of the `LoadingService`

```angular2html
  <div class="spinner-container" *ngIf="loadingService.loading$ | async">
      <mat-spinner></mat-spinner>
  </div>
```

- We will put our `<loading>` spinner component in the `app.component.html`

```angular2html
  <mat-sidenav-container fullscreen>
  
    <mat-sidenav #start (click)="start.close()">
      <mat-nav-list>
        <a mat-list-item routerLink="about">
          <mat-icon>question_answer</mat-icon>
          <span>About</span>
        </a>
        <a mat-list-item>
          <mat-icon>person_add</mat-icon>
          <span>Register</span>
        </a>
      </mat-nav-list>
    </mat-sidenav>
  
    <mat-toolbar color="primary">
      <div class="toolbar-tools">
        <button mat-icon-button (click)="start.open('mouse')">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="filler"></div>
      </div>
  
    </mat-toolbar>
    <messages></messages>
    <loading></loading>
    <router-outlet></router-outlet>
  </mat-sidenav-container>
```

- We will define our `LoadingComponent` which takes the `LoadingService`:

```typescript
  import { Component, OnInit } from '@angular/core';
  import {Observable} from 'rxjs';
  
  @Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
  })
  export class LoadingComponent implements OnInit {
  
    constructor(public loadingService: LoadingService) {}  //make public to expose
  
    ngOnInit() {  }
  
  } 
```

- We also define our shared `LoadingService`. We will use a `BehaviorSubject` to define our custom `Observable` (i.e. `loading$`). We can them subscribe to the `Subject` and it can also emit values so we use the subject to define to when our `Observable` emits the values `true` or `false`. (We use `BehaviourSubject` as this typ e of subject remembers the last value emitted by the subject and it takes an initial value.) We don't expose our subject as this is private to the service. *The best way to expose custom observables is to use a private `BehaviourSubject`*
- In our implementation of `showLoaderUntilCompleted()` we create another initial/default observable using `of(null)` to create an *observable chain* which we will use to trigger our side-effect (i.e. the loading indicator) and this side-effect is called by `tap()`, we then use `concatMap()` to take the values from the source observable (`obs$`) and when this new observable either completes or errors then we calling our `loadingOff()` side-effect
```typescript
  import {Injectable} from '@angular/core';
  import {BehaviorSubject, Observable, Subject,of} from 'rxjs';
  import {concatMap, finalize, tap} from 'rxjs/operators';
  
  @Injectable()
  export class LoadingService {
  
      private loadingSubject = new BehaviorSubject<boolean>(false);
      
      //exposed as public but takes the values from our subject
      loading$: Observable<boolean> = this.loadingSubject.asObservable(); 
      
      showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
          return of(null)
              .pipe(
                  tap(() => this.loadingOn()),
                  concatMap(() => obs$), //concatenate with our source observable
                  finalize(() => this.loadingOff())  // gets called when completes or errors
              );
      }
  
      loadingOn() {
          this.loadingSubject.next(true);
      }
  
      loadingOff() {
          this.loadingSubject.next(false);
      }
  }
```
- Finally, in our `HomeComponent` we can use our `showLoaderUntilCompleted`
```typescript
  @Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
  })
  export class HomeComponent implements OnInit {
  
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;
  
    constructor(private coursesService: CoursesService, 
                private loadingService: LoadingService,
                private messagesService: NessagesService) {}
  
    ngOnInit() {
        this.reloadCourses();
    }
  
    reloadCourses() {
        const courses$ = this.coursesService.loadAllCourses().pipe(
            map(courses => courses.sort(sortCoursesBySeqNo)
            catch( error => {
                const msg = "Could not load courses";
                this.messagesService.showErrors(msg);
                console.log(message, error);
                return throwError(error);
            })
        );
        const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
        this.beginnerCourses$ = loadCourses$.pipe(
           map( courses => courses.filter(course => course.category == 'BEGINNER')) 
        )
        this.advancedCourses$ = loadCourses$.pipe(
           map( courses => courses.filter(course => course.category == 'ADVANCED')) 
        )
    } 
  }
```
- Note that our `LoaingService` is available any child component because it is specified in the `providers` of our `AppComponent`:
```typescript
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ LoadingService ]
  })
  export class AppComponent implements  OnInit {
  
      constructor() { }
  }
```
- ...but our `CourseDialogComponent` (which is a Materialize component) is not a child component of the application root component so we need to add to `providers` and note we can use our `showLoaderUntilCompleted` method in our `save()` method:

```typescript
  @Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,
        MessagesService
      ]
  })
  export class CourseDialogComponent {
  
      form: FormGroup;  
      course:Course;
  
      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<CourseDialogComponent>,
          @Inject(MAT_DIALOG_DATA) course:Course,
          private coursesService: CoursesService,
          private loadingService: LoadingService,
          private messagesService: MessagesService
      ) {
          this.course = course; 
          this.form = fb.group({
              description: [course.description, Validators.required],
              category: [course.category, Validators.required],
              releasedAt: [moment(), Validators.required],
              longDescription: [course.longDescription,Validators.required]
          });
      }
  
      save() {
        const changes = this.form.value;
        const saveCourses$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
         catch( error => {
                 const msg = "Could not save course";
                 this.messagesService.showErrors(msg);
                 console.log(message, error);
                 return throwError(error);
             })
        );
        this.loadingService.showLoaderUntilCompleted(saveCourses$).subscribe(
          val => this.dialogRef.close(val);
        );    
      }
  
      close() {
          this.dialogRef.close();
      }
  }
```
### Displaying Errors via a `MessagesComponent`
- We want a `MessagesComponent` to display errors. This will work with a `MessagesService` which gets called in a `catch` block.  We don't want a global singleton here. There might be a message service instance associated with different components. We can use our injectable `MessagesService` which is a `BehaviorSubject` wrapping a list of messages but when we transform this into our observable we also need to check for the initial value of empty array and filter this out:
```typescript
  import {Injectable} from '@angular/core';
  import {BehaviorSubject, Observable} from 'rxjs';
  import {filter} from 'rxjs/operators';
  
  @Injectable()
  export class MessagesService {
  
      private subject = new BehaviorSubject<string[]>([]);
  
      errors$: Observable<string[]> = this.subject.asObservable().pipe(
              filter(messages => messages && messages.length > 0)  //make sure it's not empty
          );
  
      showErrors(...errors: string[]) {   //public method we call to show error
          this.subject.next(errors);
      }
  } 
```
- We define our `MessagesComponent` which contains the errors
```typescript
  @Component({
   selector: 'messages',
   templateUrl: './messages.component.html',
   styleUrls: ['./messages.component.css']
  })
  export class MessagesComponent implements OnInit {
  
   showMessages = false; //boolean flag to determine if messages are shown
   errors$: Observable<string[]>;
  
   constructor(public messagesService: MessagesService) {}
  
   ngOnInit() {
       this.errors$ = this.messagesService.errors$.pipe(
           tap(() => this.showMessages = true)
       );
   }
  
   onClose() {
       this.showMessages = false;
   }
  }
```
- ..and the accompanying template:
```angular2html
  <ng-container *ngIf="(errors$ | async) as errors">
      <div class="messages-container" *ngIf="showMessages">
          <div class="message" *ngFor="let error of errors">
              {{error}}
          </div>
          <mat-icon class="close" (click)="onClose()">close</mat-icon>
      </div>
  </ng-container>
```

### Pattern #4: Stateful Components and State Management via a Basic Store
- One the problems with an entirely stateless approach is that we will constantly be reloading the same data even if the data is not modified which creates a lot of network overhead.
- Note how we use the `tap()` method to send the courses to the subject
- Note how the `save()` method is `optimistic` (i.e. it will update in memory before doing the Http put). It uses a `Partial` since not all the properties of the course may have changed when we save. Save returns `Observable<any>` because it can return an error.
```typescript
@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$ : Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http:HttpClient,
        private loading: LoadingService,
        private messages: MessagesService) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messages.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            );
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe();

    }

    saveCourse(courseId:string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id == courseId);
        const newCourse: Course = {
          ...courses[index],
          ...changes
        };
        const newCourses: Course[] = courses.slice(0);  //take a complete copy of the current array
        newCourses[index] = newCourse;                  //replace in memory with updates course
        this.subject.next(newCourses);                  //send update courses to subject before persisting
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "Could not save course";
                    console.log(message, err);
                    this.messages.showErrors(message);
                    return throwError(err);
                }),
                shareReplay()
            );
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo)
                )
            )
    }
} 
```
### Pattern #5: Authentication Store
- This pattern will keep the user profile in memory and therefore uses the store as a global singleton and hence `@Injectable`'s `providedIn` property is set to `root`
```typescript
const AUTH_DATA = "auth_data";
@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);
    user$ : Observable<User> = this.subject.asObservable();
    isLoggedIn$ : Observable<boolean>;
    isLoggedOut$ : Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user)); //double-negate
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
        const user = localStorage.getItem(AUTH_DATA);
        if (user) {
            this.subject.next(JSON.parse(user));  //if user exists in local storage then rehydrate
        }
    }

    login(email:string, password:string): Observable<User> {
        return this.http.post<User>("/api/login", {email, password})
            .pipe(
                tap(user => {
                    this.subject.next(user);
                    localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                }),
                shareReplay()
            );
    }

    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }
}
```
- We can now use the `AuthStore` in our `LoginComponent`
```typescript
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthStore) {
    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]]
    });
  }

  ngOnInit() {}

  login() {
    const val = this.form.value;
    this.auth.login(val.email, val.password)
        .subscribe(
            () =>  {  this.router.navigateByUrl("/courses")},
            err => { alert("Login failed!"); }
        );
  }
}
```
- In our `AppComponent` we now inject our `AuthStore` as a public variable
```typescript

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {

  constructor(public auth: AuthStore) {}

  ngOnInit() {}

  logout() { this.auth.logout(); }

}
```
- ...and in our template we can now use `auth.isLoggedOut$` in our `ngIf` to display the Login and Logout buttons:

```angular2html
<mat-sidenav-container fullscreen>

  <mat-sidenav #start (click)="start.close()">
    <mat-nav-list>
      <a mat-list-item routerLink="/">
        <mat-icon>library_books</mat-icon>
        <span>Courses</span>
      </a>
      <a mat-list-item routerLink="login" *ngIf="auth.isLoggedOut$ | async">
        <mat-icon>account_circle</mat-icon>
        <span>Login</span>
      </a>
      <a mat-list-item (click)="logout()" *ngIf="auth.isLoggedIn$ | async">
        <mat-icon>exit_to_app</mat-icon>
        <span>Logout</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-toolbar color="primary">
    <div class="toolbar-tools">
      <button mat-icon-button (click)="start.open('mouse')">
        <mat-icon>menu</mat-icon>
      </button>
      <div class="filler"></div>
    </div>  
  </mat-toolbar>
  
  <messages></messages>
  <loading></loading>
  <router-outlet></router-outlet>

</mat-sidenav-container>
```

### Pattern #6: Master-Detail Pattern
```typescript
@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {

  searchResults$ : Observable<Lesson[]>;

  activeLesson:Lesson;

  constructor(private coursesService: CoursesService) { }

  ngOnInit() { }

  onSearch(search:string) {
      this.searchResults$  = this.coursesService.searchLessons(search);
  }

  openLesson(lesson:Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = null; //hide the detail and go back to the list
  }
```
- ..and the accompanying template in which we have two `click` events to call `onSearch` or `onBackToSearch` and use an `*ngIf` to render either the master or the details (which is in an `ngTemplate` called `details`)
```angular2html
<div class="course">
  <h2>Search All Lessons</h2>
  <mat-form-field class="search-bar">
    <input matInput placeholder="Type your search" #searchInput autocomplete="off">
  </mat-form-field>

  <button class="search" mat-raised-button color="primary"
          (click)="onSearch(searchInput.value)" >
    <mat-icon>search</mat-icon>
    Search
  </button>

    <ng-container  *ngIf="!activeLesson; else detail">
        <ng-container *ngIf="(searchResults$ | async) as lessons">
            <table class="lessons-table mat-elevation-z7">
                <thead>
                <th>#</th>
                <th>Description</th>
                <th>Duration</th>
                </thead>
                <tr class="lesson-row" *ngFor="let lesson of lessons"
                    (click)="openLesson(lesson)">
                    <td class="seqno-cell">{{lesson.seqNo}}</td>
                    <td class="description-cell">{{lesson.description}}</td>
                    <td class="duration-cell">{{lesson.duration}}</td>
                </tr>
            </table>
        </ng-container>
    </ng-container>

    <ng-template #detail>
        <button mat-raised-button class="back-btn" (click)="onBackToSearch()">
            <mat-icon>arrow_back_ios</mat-icon>
            Back to Search
        </button>
        <lesson [lesson]="activeLesson"></lesson>
    </ng-template>
</div>
```
- Finally we have our `CoursesService` implementation:

```typescript
@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(private http:HttpClient) { }

    searchLessons(search:string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: "100"
            }
        }).pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }
}
```


### Pattern #7: The Single Data Observable Pattern (using `combineLatest` and `OnPush` for ChangeDetection)
- In this example, we define an interface (`CourseData`) to combine two related observables using `combineLatest` operator. The `combineLatest` operator means whenever any combined observable emits a value then that value will be included in the **combined observable**. By default `combineLatest` will wait for both values before emitting its first value therefore we must use `startWith` to set an initial value
- In our `CourseComponent`, we first get the `courseId` from the the URL via `ActivatedRoute`', using the route's `route.snapshot` to get the `paramMap` from which we get the `courseId`:
- We also use `OnPush` ChangeDetectionStrategy to tell Angular to rerender if data gets changed and this turns our application into a **Reactive* app since changes get automatically pushed to the front-end
```typescript
interface CourseData {
    course: Course;
    lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute, private coursesService: CoursesService) {}

  ngOnInit() {
        const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
        const course$ = this.coursesService.loadCourseById(courseId).pipe(
                startWith(null)
            );

        const lessons$ = this.coursesService.loadAllCourseLessons(courseId).pipe(
                startWith([])
            );

        this.data$ = combineLatest([course$, lessons$])
            .pipe(
                map(([course, lessons]) => {
                    return {
                        course,
                        lessons
                    }
                }),
                tap(console.log)
            );
  }
}
```
- In our template we now have **two related observables**: `data` and `lessons`. To render our template, we want a **Single Data Observable** so we defined our interface `CourseData` which combined both values.
- We use the template our `data` Observable - using an `*ngIf` to make sure it is not null - but to avoid nesting `ng-container` we use another `*ngIf` to check `data.lessons.length` to decide whether to render
```angular2html
<ng-container *ngIf="(data$ | async) as data">
    <div class="course">
        <h2>{{data.course?.description}}</h2>
        <img class="course-thumbnail" [src]="data.course?.iconUrl" *ngIf="data.course">
        <table class="lessons-table mat-elevation-z7" *ngIf="data.lessons.length">
            <thead>
            <th>#</th>
            <th>Description</th>
            <th>Duration</th>
            </thead>
            <tr class="lesson-row" *ngFor="let lesson of data.lessons">
                <td class="seqno-cell">{{lesson.seqNo}}</td>
                <td class="description-cell">{{lesson.description}}</td>
                <td class="duration-cell">{{lesson.duration}}</td>
            </tr>
        </table>
    </div>
</ng-container>
```

- Our service uses the `HttpClient` to return the observable and uses `shareReplay()` to avoid duplicate requests
```typescript
@Injectable({
    providedIn:'root'
})
export class CoursesService {

    constructor(private http:HttpClient) { }

    loadCourseById(courseId:number) {
       return this.http.get<Course>(`/api/courses/${courseId}`).pipe(
              shareReplay()
            );
    }
    
    loadAllCourseLessons(courseId:number): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: "10000",
                courseId: courseId.toString()
            }
        }).pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }
}
```


