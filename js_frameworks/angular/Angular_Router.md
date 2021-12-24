# ANGULAR ROUTER

The source for these notes are the [Angular University's Angular Router](https://www.udemy.com/course/angular-router-course) course
The source code is contained [here](https://github.com/angular-university/angular-router-course

- Angular router is used so SPA and has performance benefits because it can lazily load

### Defining a Login using Routes
 
- We define a component which provides login functionality:

```typescript

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthStore} from '../services/auth.store';

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

  ngOnInit() { }

  login() {
    const val = this.form.value;
    this.auth.login(val.email, val.password).subscribe(
            () => {
                this.router.navigateByUrl('/courses');
            },
            err => {
                alert("Login failed!");
            }
        );
  }
}
```
- In the corresponding template, we use `routerLink` (or equivalent template syntax `[routerLink]`) to map to a particular route (using **relative paths** except top level components which should use **absolute paths**) and `routerLinkActive` to define a CSS class which will be applied to an active route
- We also include `router-outlet`

```angular2html
<mat-sidenav-container fullscreen>

  <mat-toolbar color="primary">
    <div class="toolbar-tools">
      <a class="menu-item" mat-button routerLink="/courses"
         routerLinkActive="menu-item-active"
         [routerLinkActiveOptions]="{exact:true}">
        <span>Courses</span>
      </a>
      <a class="menu-item" mat-button routerLink="/about"
         routerLinkActive="menu-item-active">
        <span>About</span>
      </a>
      <a mat-button class="menu-item" *ngIf="auth.isLoggedOut$ | async"
         routerLink="/login"
         routerLinkActive="menu-item-active">
        <mat-icon>account_circle</mat-icon>
        <span>Login</span>
      </a>
    </div>
    <a mat-button class="menu-item" *ngIf="auth.isLoggedIn$ | async"
        [routerLink]="[{outlets: {chat: ['helpdesk-chat']}}]">
      <mat-icon>help</mat-icon>
    </a>
    <a mat-button class="menu-item" (click)="logout()" *ngIf="auth.isLoggedIn$ | async">
      <mat-icon>exit_to_app</mat-icon>
      <span>Logout</span>
    </a>

    <div class="filler"></div>
    <ng-container *ngIf="(auth.user$ | async) as user">
      <img class="profile-picture" [src]="user.pictureUrl">
    </ng-container>
  </mat-toolbar>
  <messages></messages>
  <loading [detectRoutingOngoing]="true"></loading>
   <router-outlet></router-outlet>
   
</mat-sidenav-container>

<router-outlet name="chat"></router-outlet>

```

- In `AppRoutingModule` we define our `Routes` where we map a `path` to a component (e.g. `"login"` -> `LoginComponent`). Note how in the import we use `RouterModule.forRoot` and we use this method, passing our `routes`, to set up the routing information at the root level of our application and also to define guards etc. 
- The `forRoot` static method is the method that configures the root routing module for your app. When calling `RouterModule.forRoot(routes)` , Angular instantiates an instance of the `Router` class globally. (The `forChild` tells Angular there already a `Router` instance available in the app so just register all of these routes with that instance. Use `forChild` method to register routes throughout your app.)
- The `loadChildren` will asynchronously lazily load all modules for particular (using JS syntax import). In this examples, whenever any path containg `courses` then the modules gets loaded
- Some best practices:
  - Define an empty path `""` with an exact match (`pathMatch: "full"`) for the application root router with a `redirectTo` 
  - Define a wildcard path `**` for a fallback (i.e. PageNotFound) - this must go at *bottom* because router will check all other routes first
  
```typescript
const routes: Routes = [
    {
      path: "",
      redirectTo: "/courses",
        pathMatch: "full"
    },
    {
      path: "courses",
      loadChildren: () => import('./courses/courses.module')
                            .then(m => m.CoursesModule),
        // canLoad: [CanLoadAuthGuard]
       data: {
          preload: false
       }
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "about",
        component: AboutComponent
    },
    {
        path: 'helpdesk-chat',
        component: ChatComponent,
        outlet: 'chat'
    },
    {
        path: "**",
        component: PageNotFoundComponent
    }

];

@NgModule({
  imports: [
      RouterModule.forRoot(
          routes, {
              preloadingStrategy: CustomPreloadingStrategy,
              scrollPositionRestoration:'enabled',
              paramsInheritanceStrategy: 'always',
              relativeLinkResolution: 'corrected',
              malformedUriErrorHandler:
                  (error: URIError, urlSerializer: UrlSerializer, url:string) =>
                    urlSerializer.parse("/page-not-found")
          })
  ],
  exports: [RouterModule],
  providers: [
      CanLoadAuthGuard,
      CustomPreloadingStrategy
  ]
})

export class AppRoutingModule { }
```

- We can define a **module specific routing** which contain child routes and note how we now use `RouterModule.forChild()` to define child routes (e.g. mapping `courseUrl` to a `CourseComponent`)
- We map `resolve` to an implementation of `Resolver<T>` to resolve a dependency for the route and we must add this to `providers` 
- In the path to lessons we also include a parameter `lessonSeqNo` and in the template we could refer to this using `[routerLink]="['lessons', lesson.seqNo]`


```typescript
const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path:":courseUrl",
        component: CourseComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        canDeactivate: [ConfirmExitGuard],
        children: [
            {
              path: "",
              component: LessonsListComponent,
              resolve: {
                  lessons: LessonsResolver
              }
            },
            {
                path: "lessons/:lessonSeqNo",
                component: LessonDetailComponent,
                resolve: {
                    lesson: LessonDetailResolver
                }
            }
        ],
        resolve: {
            course: CourseResolver
        }
    }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
      CourseResolver,
      LessonsResolver,
      LessonDetailResolver,
      AuthGuard,
      ConfirmExitGuard
  ]
})
export class CoursesRoutingModule {

}
```

### Using RouterResolver<T> to resolve data for a Route

- We use a `RouterResolver` - in this case `CourseResolver` -  to resolve an `Observable<Course>` from a **route parameter**. Note that a resolver should resolve a single observable so if we are receiving a stream containing multiple values then we might want to pipe this call and `first()`:
```typescript
@Injectable()
export class CourseResolver implements Resolve<Course> {

    constructor(private courses: CoursesService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        const courseUrl = route.paramMap.get("courseUrl");
        return this.courses.loadCourseByUrl(courseUrl);
    }
} 
```
- In another example resolving the detail in the **Master-Detail** pattern we refer :
```typescript
@Injectable()
export class LessonsResolver implements Resolve<LessonSummary[]> {

    constructor(private courses: CoursesService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LessonSummary[]> {
        const courseUrl = route.paramMap.get("courseUrl");
        return this.courses.loadAllCourseLessonsSummary(courseUrl);
    }
}
```
- In our `CourseComponent` we use `ActivatedRoute` to get the course which has been resolved by our resolver:
```typescript
@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course:Course;
  couponCode:string;

  constructor(private route:ActivatedRoute) {}

  ngOnInit() {
      this.course = this.route.snapshot.data["course"];
      this.couponCode = this.route.snapshot.queryParamMap.get("couponCode");
  }

  confirmExit() {
      return confirm(`Are you sure you want to exit ${this.course.description}?`)
  }
}
```

- In the corresponding template for our course component we must include `<router-outlet>`:

``angular2html
<ng-container>
    <div class="course">
        <h2>{{course.description}}</h2>
        <h3 class="discount" *ngIf="couponCode">
            Use {{couponCode}} for a huge discount!
        </h3>
        <img class="course-thumbnail" [src]="course.iconUrl" *ngIf="course">
        <router-outlet></router-outlet>
    </div>
</ng-container>
``

- In our template for our courses summary, we must use `course.url` from the course object for our `routerLink` and define `queryParams` for the route :

```angular2html
<mat-card *ngFor="let course of courses" class="course-card mat-elevation-z10">

    <mat-card-header>
        <mat-card-title>{{course.description}}</mat-card-title>
    </mat-card-header>
    <img mat-card-image [src]="course.iconUrl">

    <mat-card-content>
        <p>{{course.longDescription}}</p>
    </mat-card-content>

    <mat-card-actions class="course-actions">
        <button mat-button class="mat-raised-button mat-primary"
            [routerLink]="[course.url]" [queryParams]="{couponCode: 'NEW_YEAR'}">
            VIEW COURSE</button>
        <button mat-button class="mat-raised-button mat-accent"
                (click)="editCourse(course)">EDIT</button>
    </mat-card-actions>

</mat-card>
```

- We can use our `LoadingComponent` to show a spinner (based on `detectRoutingOngoing` flag) if the router is performing lazy loading or other routing events. Note that we set our `detectRoutingOngoing` in the `loading` element of our template which outside any particular route: `<loading [detectRoutingOngoing]="true"></loading>`

```typescript
@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input()
  routing: boolean = false;

  @Input()
  detectRoutingOngoing = false;

  constructor(public loadingService: LoadingService, private router: Router) { }

  ngOnInit() {
      if (this.detectRoutingOngoing) {
          this.router.events
              .subscribe(
                  event => {
                      if (event instanceof NavigationStart
                       || event instanceof RouteConfigLoadStart) {
                        this.loadingService.loadingOn();
                      }
                      else if (
                          event instanceof NavigationEnd ||
                          event instanceof NavigationError ||
                            event instanceof NavigationCancel ||
                            event instanceof RouteConfigLoadEnd) {
                          this.loadingService.loadingOff();

                      }
                  }
              );
      }
  }
}
```

### Route observables vs Route snapshots 
- In our detail component, note the difference `route.data` and `route.snapshot.data` between (further explained [here](https://www.udemy.com/course/angular-router-course/learn/lecture/20397525#overview)). What is the difference? The `data` observable is going to emit all the **latest data** produced by the resolvers associated with the current route whereas `snapshot.data` is the state when the component was firs instantiated: 

```typescript
@Component({
  selector: 'lesson',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {

  lesson$: Observable<LessonDetail>;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
      //this.lesson$ = this.route.snapshot.data.pipe(map(data => data["lesson"])); - don't use the snapshot!
      this.lesson$ = this.route.data.pipe(map(data => data["lesson"]));
  }

  previous(lesson: LessonDetail) {
      this.router.navigate(['lessons', lesson.seqNo - 1], {relativeTo: this.route.parent});
  }
  
  next(lesson: LessonDetail) {
        this.router.navigate(['lessons', lesson.seqNo + 1], {relativeTo: this.route.parent});
  }
}
```
- ... and here is the associated detail template:

```angular2html
<a class="back" href="javascript:void(0)" [routerLink]="['../..']">Back To Course</a>

<div class="lesson-detail" *ngIf="(lesson$ | async) as lesson">

    <h3>{{lesson.description}}</h3>
    <h5>Duration: {{lesson.duration}}</h5>

  <div class="video-container">
    <mat-icon class="nav-button" *ngIf="!lesson.first" (click)="previous(lesson)">
      navigate_before
    </mat-icon>
    <iframe width="400" height="220"  frameborder="0" allowfullscreen
            [src]="('https://www.youtube.com/embed/' + lesson?.videoId) | safeUrl">
    </iframe>
    <mat-icon class="nav-button" *ngIf="!lesson.last" (click)="next(lesson)">
      navigate_next
    </mat-icon>
  </div>
</div>
```
### A Simple Implementation of AuthStore
- We use the pattern of private `BehaviourSubject` for the `User` and exposed it as a public `Observable<User>`
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
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
        const user = localStorage.getItem(AUTH_DATA);
        if (user) {
            this.subject.next(JSON.parse(user));
        }
    }

    login(email:string, password:string): Observable<User> {
        return this.http.post<User>("/api/login", {email, password}).pipe(
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

### Angular Router Guards: `CanActivate` and `CanActivateChild`

- Our  AuthGuard is an implementation of a **Router Guard** component implements `CanActivate` and `CanActivateChild.` These methods either return a boolean or a `UrlTree` for redirects:
- `CanActivateChild` needs to be implemented otherwise child routes can still be accessed:
- In our `Routes` configuration in our module we also need to add these guards

```typescript
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private auth:AuthStore, private router:Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>  {
        return this.checkIfAuthenticated();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean | UrlTree>   {
        return this.checkIfAuthenticated();
    }

    private checkIfAuthenticated() {
        return this.auth.isLoggedIn$.pipe(
                map(loggedIn =>
                    loggedIn? true: this.router.parseUrl('/login') )
            );
    }
}
```
### Angular Router Guards: `CanLoad` and `CanDeactivate`
- `CanDeactive` is used to prevent navigation away from page (e.g. might have unsaved data) - this example simply calls the `confirmExit()` on our component which opens a javascript pop up. We must implement `canDeactivate` returning `boolean`: 
```typescript
@Injectable()
export class ConfirmExitGuard implements CanDeactivate<CourseComponent> {

    canDeactivate(component: CourseComponent, currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean  {
        return component.confirmExit();
    }
 }
```
- `CanLoad` is used to prevent a module being loaded altogether - we must implement `canLoad` returning `Observable<boolean>`

```typescript
@Injectable()
export class CanLoadAuthGuard implements CanLoad {

    constructor(private auth: AuthStore, private router: Router) { }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>  {
        return this.auth.isLoggedIn$.pipe(
                first(),
                tap(loggedIn => {
                    if (!loggedIn) {
                        this.router.navigateByUrl('/login');
                    }
                })
            );
    }
}