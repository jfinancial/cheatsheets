# REACTIVE ANGULAR DESIGN

The source for these notes are the [Angular University's Reactive Angular (with RxJs)](https://www.udemy.com/course/rxjs-reactive-angular-course) course 
 The source code is contained [here](https://github.com/angular-university/reactive-angular-course)

### Pattern #1: Statless Observable-based Services

- We want avoid ["callback hell"](http://callbackhell.com/) which even when using Obseravbles and manually subscribing then this might occur in a bloated `subscribe()` method. 
- When we have services that have mutable state then when this state changes there is no way for the rest of the application to know this state was modified. Also we can't use optiimized change detection such as `onPush` which only looks at a component's inputs
- The solution is to refactor into stateless services
```typescript
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Lesson} from '../model/lesson';
    
@Injectable({
    providedIn:'root'
})
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
