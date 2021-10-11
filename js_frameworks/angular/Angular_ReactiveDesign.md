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


### Pattern #3: Decoupled Communication Via A Shared Service
- Often we may have components at different levels in the component hierarchy that need interact and cannot use `@Input` because there is no parent-child relationship between these components. An example of this situation is where we might want to use a spinner which might live at the application root level above the `<route-outlet>`
