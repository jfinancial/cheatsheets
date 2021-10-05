# RxJS: Reactive Javascript Extensions

### RxJS Overview

- RxJs is designed to handle complex interactions of asynchronous activity using "obervable streams" and building on the Observer and Iterator pattern. 
- Streams are expressed as Observables with callbacks and it uses a push-based approach. You can listen to or "observe" these streams supplying callbacks to be invoked when new values arrive. 
- The real power in RxJs, however, is in the operators (which are like real-time queries) which can be called on streams
- RxJs is often referred to as *"[Lodash](https://lodash.com/) for events"*
- To use RxJs add the `rxjs` dependency in `package.json` as shown below:

```json
{
  "name": "rxjs-starter",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "parcel-bundler": "^1.12.3",
    "rxjs": "^6.5.3"
  },
  "devDependencies": {},
  "scripts": {
    "start": "parcel index.html"
  },
}
```

Summary:

 - Observables are *push-based*
 - Observables are *cold-by-default* (i.e. nothing happens until you call subscribe) and each subscription creates its own execution path between the producer and the consumer (known as *unicasting*)
 - Observables can *emit zero or more values*
 - Observables can deliver values *synchronously* but more commonly *asynchronously* 
 - Observables can be *cancelled* (by unsubscribing)

#### Creating Observables
- You can create an Observable using `Observable.create()` or calling `new Observable()`. 
- You can also supply no argument to `subscribe()` but you should normally take this as a warning that you have moved logic upwards into other operators where you shouldn't have.

```typescript
    /*
     * Observers can register up to 3 callbacks
     * next is called 1:M times to push new values to observer
     * error is called at most 1 time should an error occur
     * complete is called at most 1 time on completion.
     */
    const observer = {
        next: value => console.log('next', value),
        error: error => console.log('error', error),
        complete: () => console.log('complete!')
    };
    
    const observable = new Observable(subscriber => {
        subscriber.next('Hello');
        subscriber.next('World');
        //Once complete is called, observable will be cleaned up and no future values delivered.
        subscriber.complete();
        // These values will not be logged as the observable has already completed.
        subscriber.next('Hello');
        subscriber.next('World');
    });

    // Subscribe hooks observer up to observable, beginning execution.
    // This creates a 1 to 1 relationship between the producer (observable) and the consumer (observer).
    observable.subscribe(observer);
```

You can supply any (`next`, `error` or `complete`) or none. So rather than supply an observer you can either create a **partial observer**  by only implementing certain arguments or via functions passed to `subscribe()` but these rely on order: 

```typescript
    observable.subscribe(
        value => console.log('next',value),
        null, //no error handler
        () => console.log('complete!)
    );
```

**Tip:** Generally, we supply function arguments if we are just going to implement `next` or use an Observer if we are going to implement more than one of the callbacks.

#### The Observable Contract
As seen above, Observable provide a contract for next, completion and error conditions and this called the "Observable Contract" in which errors and values are mutually exclusive so no further values will be emitted after an error occurred or after completing:
```typescript
  cont stream = fromEvent(document, 'click');
  stream.subscribe( 
        evt => console.log('next item ' + evt),
        err => console.log('error ' + err),
        () => console.log('completed')
  );
)
```
- The `subscribe()` returns a `Subscription` and on this subsciption we can also call `unsubscribe()`


### Avoiding multiple HTTP Requests using `shareReplay`
You generally want to use `shareReplay` when you have side-effects or taxing computations that you do not wish to be executed amongst multiple subscribers e.g making an HTTP call which we do not want to call multiple times
```typescript
    const http$ = createHttpObservable('/api/courses');
    const courses$: Observable<Course[]> = http$.pipe(
            map(res => Object.values(res["payload"]) ),
            shareReplay(),
            retryWhen(errors =>
                errors.pipe(
                delayWhen(() => timer(2000)
                )
            ) )
        );
    const beginnerCourses$: Observable<Course[]> = courses$.pipe(
            map(courses => courses
                .filter(course => course.category == 'BEGINNER'))
        );
    const advancedCourses$: Observable<Course[]> = courses$.pipe(
            map(courses => courses
                .filter(course => course.category == 'ADVANCED'))
        );
    }
```

#### Managing subscriptions

- You finish subscribing to an observable via the `unsubscribe()` method which cleans up any resources being used by the Observable. 
- Note that the `complete` will not be fired as *complete is only fired for complete notifications that happen within the Observable*

```typescript
    const subscription = observable.subscribe(observer);
    subscription.unsubscribe()
```

You can also add a subscription to another subscription and then unsubscribe is called it is called on both

```typescript
    const subscription = observable.subscribe(observer);
    const subscriptionTwo = observable.subscribe(observer);
    subscription.add(subscriptionTwo);
    setTimeout(() => { 
      subscription.unsubscribe();
    }, 3500);

```
### Operator Summary
| Type                                | Description                                                                    |
|-------------------------------------|--------------------------------------------------------------------------------|
| `of`, `from`, `range`, `fromEvent`  | Creation operators for creating observables from scratch                       |
| `pipe`                              | Creates a functional pipelines of operations to be performed on stream         |
| `map`                               | Maps an observable to another observable                                       |
| `concat` / `concatMap`              | Concatenates stream of observables *on each one completing* => **Use case**: we want to perform something sequentially/serially (e.g. saving where we dont want to do multiple HTTP puts at same time)  |
| `merge` / `mergeMap`                | Merge by *interleaving* stream of observables, completes when all complete  => **Use case**: we want to perform something in parallel (e.g. we want to do multiple HTTP gets at same time)  |
| `exhaustMap`                        | Map to inner observable, ignore other values until that observable completes => **Use case**: click event on save button where we ignore save event that happen after until we complete the operation    |
| `switchMap`                         | Maps each source value to an Observable which is merged in the output Observable, emitting values only from the most recently projected Observable => **Use case**: type ahead search where old http requests are cancelled|
| `debounceTime(delayInMs)`           | Will discard emitted values that take less than the specified time between output=> **Use case**: search head - will wait for value to to be 'stablele |
| `distinctUntilChanged`              | Filtering out duplicates|

### Creation Operators

- Usually we don't create Observables from scratch and we wrap something else (e.g event, request, timer, static data, combination of other sources)
- Creation operators (or functions) create an observable from a number of sources

 - `of()` create from stream e.g. `constsource$ = of(1,2,3,4,5)` (Note that not flattening takes place so if an array is used in the first arg `of([1],2,3,4,5)` then the array is emitted)
 - `from()` is more like intelligent of version `of()` in that it checks for type of values and will flatten an array so for a string it will be turned into a char array; from will also handle iterables 
  - `range()` create an observable from a range e.g.`range(1,5)`
 - `fromEvent()` from a DOM event e.g. `const clickSource$ = fromEvent(document, 'click)`
  - `interval(1000)`(emits every second) and `timer(2000,1000)` (starts emitting after 2 seconds and then every second) are time-based streams. (Note: `timer(2000)` emits a value after 2 seconds and then none)

```typescript
    const observer = {
      next: val => console.log('next', val),
    };
    const source$ = fromEvent(document, 'keyup');
    const subOne = source$.subscribe(observer);
```

### Introduction To Operators (`map`, `pluck`, `mapTo`, `filter`, `reduce`, `scan` and `tap`)
- Operators transform elements in the stream and are *pipeable* so the stream becomes like an assembly like e.g.

```typescript
    observable$.pipe(
         operatorOne(config), 
         operatorTwo(config)
    ).subscribe(observer)`
```

- `map()` works like map elements in an array

```typescript
    const keyup$ = fromEvent(document, 'keyup');
    const keycode$ = keyup$.pipe(
      map((event: any) => event.code)
    );
    keycode$.subscribe(console.log);
```

- `pluck()` is used to take a property from an object so the code above (which maps the key code) could be written as:
```typescript
    const keyup$ = fromEvent(document, 'keyup');
    const keycode$ = keyup$.pipe(
      pluck('code')
    );
    keycode$.subscribe(console.log);
```

- `mapTo()` is used to emit a constant
- `filter()` allows you to filter out based on a condition
```typescript
    const keycode$ = keyup$.pipe(map((event: any) => event.code));
    const enter$ = keycode$.pipe(filter(code => code === 'Enter'));
    enter$.subscribe(console.log);
```

- `reduce()` applies a reducer function and when the observable completes the value is emitted. 
```typescript
    from([1, 2, 3, 4, 5])
      .pipe( reduce((accumulator, currentValue) => {
         return accumulator + currentValue;
        },0)
       .subscribe(console.log);
```

- `scan()` applies a reducer function on each emitted, joining new values emitted from the source to the new value (in contrast to `reduce()` which only emits on completion):
```typescript
    //scan is similar to reduce, except it emits each new acculumated value as it occurs.
    // This is great for managing state changes in your application over time.
     */
    from([1, 2, 3, 4, 5])
      .pipe(scan((accumulator, currentValue) => {
        return accumulator + currentValue;
       }, 0))
      .subscribe(console.log);
```
- ...we use `scan` to accumlulate state (like Redux or NgRx)
```typescript
    const user = [
      { name: 'Brian', loggedIn: false, token: null },
      { name: 'Brian', loggedIn: true, token: 'abc' },
      { name: 'Brian', loggedIn: true, token: '123' }
    ];
    
    // In this example we are building up an object 
    const state$ = from(user).pipe(scan((accumulator, currentValue) => {
        return { ...accumulator, ...currentValue }  //spread operator to update object
      }, {})
    );
```
- `tap()` lets you spy on the stream and perform side effect without mutating the values in the stream. Tap also accepts an observer object (if you wish to also receieve notifications on complete or error but you will use this less often)
```typescript
    from([1, 2, 3, 4, 5]).pipe(
        tap(value => console.log('before', value)),
        map(value => value * 10),
        tap({
          next: value => console.log('after', value),
          complete: () => console.log('done!'),
          error: error => {  console.log( error ) }
        })
      )
      .subscribe(value => {
        console.log('from subscribe', value);
      });
```

### Introduction to Filtering Operators (`take`, `first`, `takeWhile`, `takeUntil`, `distinctUntilChanged` and `distinctUntilKeyChanged`)
- `take(x)` emits the first x values from the source and then completes
```typescript
    // Take the first value that matches provided criteria before completing
    // We could use a combination of filter(condition) and take(1),here  use the first operator to do the same
    // Note: If you supply no values to first, it is equivalent to take(1).
    click$.pipe(
        map((event: any) => ({
          x: event.clientX,
          y: event.clientY
        })),
        first(({ y }) => y > 200)  //take the first which has y>200
      )
      .subscribe({
        next: console.log,
      });
```
- `takeWhile(p)` take a predicate and will take values while that predicate is met (has optional boolean to return last value)
```typescript
    const counter$ = interval(1000);
    counter$.pipe(
        mapTo(-1),
        scan((accumulator, current) => {
          return accumulator + current;
        }, 10),
         // takeWhile() will complete the observable and clean up the interval
        takeWhile(value => value >= 0)
      )
      .subscribe((value: any) => {
        countdown.innerHTML = value;
        if (!value) {
          message.innerHTML = 'Liftoff!';
        }
      });
```
- `takeUntil` is *heavily used operator* which take values until another Observable emits a value
```typescript
    //counts down until the mouse is clicked
    const counter$ = interval(1000);
    const clicks$ = fromEvent(document, 'click');
    counter$.pipe(
        takeUntil(click$)
    ).subscribe(console.log);

```
- `distinctUntilChanged()` emits unique values based on a === comparison (so has to be same type) to the last emitted value . It can take a comparison function to work out whether a value has changes
- `distinctUntilKeyChanged(n)` takes a string property name (n) and  
```typescript
const user = [
  { name: 'Brian', loggedIn: false, token: null },
  { name: 'Brian', loggedIn: true, token: 'abc' },
  { name: 'Brian', loggedIn: true, token: '123' }
];

const state$ = from(user).pipe(
  scan((accumulator, currentValue) => {
    return { ...accumulator, ...currentValue };
  }, {})
);

const name$ = state$.pipe(
  distinctUntilKeyChanged('name'),
  /*
   * If you need to use a custom comparer, you can pass distinctUntilChanged a comparer function.
   * e.g. distinctUntilChanged((prev, curr) => {
   *   return prev.name === curr.name;
   * })
   */
  map((state: any) => state.name)
);
name$.subscribe(console.log);
```

### Introduction to Rate Limiting Operators (`debounceTime`, `throttleTime`, `sampleTime` and `auditTime`)
- Rate limiting operators represent a subset of filtering operators which ignore values based on certain time windows. You can use time-based criteria to either do sampling or emitting after a pause
- `debounceTime(n)` allows you to emit a value after a certain time n (in ms) has passed (prime examples are saving from user input or making a request for data after a certain time like a search ahead) 
```typescript
    const input$ = fromEvent(inputBox, 'keyup');
    input$.pipe(
        debounceTime(200),
        pluck('target', 'value'), //// we could also use map here
        distinctUntilChanged()
      )
      .subscribe(console.log);
```
- `debounce(fn)` accepts fun which can set the interval so this is useful if you need to dynamically set the debounce time so we can mimic the debounceTime of 1000 by using `debounce( () => internal(1000))` 
- `throttleTime(n)` allows first value to be emitted and then all values are ignored for n milliseconds (so use for spammy events). It can take an *`aschyncScheduler`* which allows you set then the value should be emitted (i.e. *leading* or *trailing* edge of time window)
```typescript
    const input$ = fromEvent(inputBox, 'keyup');
    input$.pipe(
        throttleTime(3000),  
        pluck('target', 'value'),
        distinctUntilChanged()
      )
      .subscribe(console.log);
```
- `sampleTime(n)` emits the most recently emitted value on the source Observaable based on a sample time interval n and is then repeated (and unlike `debounce` and `throttle` the sample time *begins on subscription*). So this lets you sample from a stream based on a specified duration.
```typescript
    const click$ = fromEvent(document, 'click');
    const timer$ = interval(1000);
    click$.pipe(
        sampleTime(4000),
        map(({ clientX, clientY }) => ( { clientX, clientY }))
      ).subscribe(console.log);
```
- `sample(o)` allows you to sample from the source based on a notifier observable
```typescript
    const timer$ = interval(1000);
    const click$ = fromEvent(document, 'click');
    timer$.pipe(
      sample(click$)
    ).subscribe(console.log);
```
- `auditTIme(n)` ignores source values for the specified duration after an emitted value. After this window has passed, the last emitted value from the source observable is emitted. Note that `auditTime` differs from `sampleTime` as the silence windows is triggered by emitted values from the source rather than repeated after subscription and differs from 'throttleTime' as 'auditTime' emits a value on the trailing edge of the silence window rather than the value on the leading edge.
```typescript
const timer$ = interval(1000);
click$
  .pipe(
     // auditTime will begin window when the source emits. 
     // Once once the window passes, the last emitted value rom the source will be emitted. 
     // Here, if you click a 4s timer will be started and after, the last click event in
     // that window will be emitted by auditTime. 
    auditTime(4000),
    map(({clientX, clientY}) => ({clientX, clientY}))
  )
  .subscribe(console.log);
```

### Transformaton Operators (`mergeMap`, `switchMap`, `concatMap` and  `exhaustMap`)
- Among the most popular transformation operators are **flattening operators** which take an Observable that itself emits an Observable subscribing internally and emitting the results to the outer stream
- `mergeMap(o)` maps each value to an Observable and then flattens these observables (so when the inner Observable emits a value so does the outer Observable. What makes `mergeMap` unique is that it doesn't put a limit on subscriptions on inner observables but this also makes it dangerous and you can easily get memory leaks). Use `mergeMap` when you want fine-grained control of over the lifetime of any inner observable particularly when if this depends on output from another observable.
```typescript
    const interval$ = interval(1000);
    const click$ = fromEvent(document, 'click');
    const mousedown$ = fromEvent(document, 'mousedown');
    const mouseup$ = fromEvent(document, 'mouseup');

    mousedown$.pipe(
        mergeMap(() => interval$.pipe(
          takeUntil(mouseup$)    //has a finite lifetime based on another event
        ))
     ).subscribe(console.log);
```
- `mergeMap` is good for fire-and-forget (e.g. save request you do not want to be cancelled.) In this example, we are emulating a save of coordinates when the user clicks:
```typescript
    const coordinates$ = click$.pipe(
      map((event: any) => ({x: event.clientX,y: event.clientY}))
    );
    const coordinatesWithSave$ = coordinates$.pipe(
      mergeMap(coords => ajax.post('someUrl', coords))
    );
    coordinatesWithSave$.subscribe(console.log);

```
- `switchMap()` is safest default for flattening as it maps each value to an Observable and flattens that Observable but **only maintains one active inner subscription** so each time we map to a new Observable the previous is completed. In the example, If you click once a new interval observable will be subscribed to internally, with its values emitted. When you click again, that observable will be completed, and the next interval will be subscribed to, restarting the count. This will happen on each emission from the `click$` observable.
```typescript
    const interval$ = interval(1000);
    const click$ = fromEvent(document, 'click');
    click$.pipe(
      switchMap(() => interval$)
    ).subscribe(console.log);
```
- A typical use case of `switchMap` is for **type ahead** functionality such as this example where we fire GET requests at a search engine:
```typescript
    const input$ = fromEvent(inputBox, 'keyup');
    input$.pipe(
        debounceTime(200),
        pluck('target', 'value'),
        distinctUntilChanged(),
        /*
         * switchMap is perfect for GET requests, as you do not normally care about the previous request
         * to the URL if another has fired. If the user continues typing* and the previous request has
         * not returned, switchMap will go ahead and cancel it and only the current request will be 
         * considered whereas with mergeMap we might still get the old requests and requests come out of order.
         */
        switchMap(searchTerm => ajax.getJSON(`${BASE_URL}?by_name=${searchTerm}`))
      )
      .subscribe((response: any[]) => {
        typeaheadContainer.innerHTML = response.map(b => b.name).join('<br>'); //update the UI
      });
```
- `concatMap()` maps a value to an observable and flattens the result but unlike `mergeMap` or `switchMap` queues them until each completes. So it used when you need **maintain order of execution** and the **inner observables have finite life spans**. Think of it as first-come-first-served so you need it when you need to maintain order of request on the client rather than the server (e.g quiz answers)
```typescript
    const saveAnswer = answer => {
      return of(`Saved: ${answer}`).pipe(delay(1500));  // simulate delayed request
    };
    const radioButtons = document.querySelectorAll('.radio-option');
    const answerChange$ = fromEvent(radioButtons, 'click');
    answerChange$
      .pipe(
        // Order remains intact by not initiating the next request until the previous completes. 
        // Be careful though as long running inner observables could cause backups.
        concatMap((event: any) => saveAnswer(event.target.value))
      )
      .subscribe(console.log);
```

- `exhaustMap()` (like concatMap and switchMap) only maintains one inner subscription but the difference is how it manages new values being emitted when an inner subscription is already active. While switchMap switches to it and concatMap queues it, exhaustMap just ignores it (or throws it away). Use `exhaustMap` where yo want to ignore subsequent value (e.g. making a post for authentication - we wouldn't want to queue these or switch to a second post as we just want to wait until the first post returns)

### Error Handling With `catchErro()`

- `catchErro()` receives the error and the observable on which the error was caught (in case you wish to retry). In this example, we are catching the error on the ajax observable returned by our switchMap function, as we don't want the entire `input$` stream to be completed in the case of an error.
- **Warning:** Be careful when you please the catch as it if you place in the outer stream is will cause that stream to complete on an error!
- RxJS has special operator for *retrying*


```typescript
    const input$ = fromEvent(inputBox, 'keyup');
    input$.pipe(
        debounceTime(200),
        pluck('target', 'value'),
        distinctUntilChanged(),
        switchMap( searchTerm => ajax.getJSON(`${BASE_URL}?by_name=${searchTerm}` ).pipe(

            catchError((error, caught) => { 
              // We return an empty observable when there's an error - beehind the scenes empty() 
              // returns the EMPTY constant when a scheduler is not provided.
              return empty(); 
            })
          )
        )
      ).subscribe((response: any[]) => {
        // update ui
        typeaheadContainer.innerHTML = response.map(b => b.name).join('<br>');
      });
```

### Combination Operators (`startWith()`, `endWith()`, `merge()`, `combineLatest()` and `forkJoin()`)
- `startWith()` appends a specified value (or values) to the start of a stream (and `endWith()` appends values to the end of a stream):
```typescript
    const counter$ = interval(1000);
    const abort$ = fromEvent(abortButton, 'click');
    const COUNTDOWN_FROM = 10;
    
    counter$.pipe(
        mapTo(-1),
        scan((accumulator, current) => {
          return accumulator + current;
        }, COUNTDOWN_FROM),
        takeWhile(value => value >= 0),
        takeUntil(abort$),
        //With startWith, we can seed the stream with
        startWith(COUNTDOWN_FROM)
      )
      .subscribe((value: any) => {
        countdown.innerHTML = value;
        if (!value) {
          message.innerHTML = 'Liftoff!';
        }
      });
```
- `concat()` lets you create an observable from a variable number of other variables. On subscription, `concat()` will **subscribe to the inner observables in order** ( so it effectively **queues** the other observables) and it will only take values from the other inner observables when each has completed. Therefore, the primary use case of concat is where you wish to *maintain order* of observables
- You can use `concat()` as a creation operator and a pipe operator
```typescript
    const delayed$ = empty().pipe(delay(1000));
    delayed$.pipe(
        concat(
          delayed$.pipe(startWith('3...')),
          delayed$.pipe(startWith('2...')),
          delayed$.pipe(startWith('1...')),
          delayed$.pipe(startWith('Go!'))
        ),
        startWith('Get Ready!')
      )
      .subscribe(console.log);
```
- `merge()` lets you create an observable from a variable number of other variables and on subscription `merge()` subscribes to **all these observables** at once, **emitting any values as they occur**
```typescript
    const counter$ = interval(1000);
    const pauseClick$ = fromEvent(pauseButton, 'click');
    const startClick$ = fromEvent(startButton, 'click');
    const COUNTDOWN_FROM = 10;
    
    merge(
      startClick$.pipe(mapTo(true)),  //merge start and pause streams
      pauseClick$.pipe(mapTo(false))
    ).pipe(
      // Depending on whether start or pause was clicked, we'll either switch
      // to the interval observable, or to an empty observable which will act as a pause.
      switchMap(shouldStart => {
        return shouldStart ? counter$ : empty();
      }),
      mapTo(-1),
      scan((accumulator, current) => {
        return accumulator + current;
      }, COUNTDOWN_FROM),
      takeWhile(value => value >= 0),
      startWith(COUNTDOWN_FROM)
    )
    .subscribe(value => {
      countdown.innerHTML = value;
      if (!value) {
        message.innerHTML = 'Liftoff!';
      }
    });
```
- `combineLatest()` will combine a number of observables and **after each observable has emitted at least one value** then `combineLatest()` will emit an array containing the **latest emitted values from each** inner observables . The use case for combine latest `combineLatest()` is when you want to do an update based on the status of two thing or more things
```typescript
    const first = document.getElementById('first');
    const second = document.getElementById('second');
    const keyup$ = fromEvent(document, 'keyup');
    const click$ = fromEvent(document, 'click');
    
    const keyupAsValue = elem => {   // helper function
      return fromEvent(elem, 'keyup').pipe(
        map((event: any) => event.target.valueAsNumber)
      );
    };
    
    combineLatest(
      keyupAsValue(first), 
      keyupAsValue(second)
    ).pipe(
      filter(([first, second]) => {
        return !isNaN(first) && !isNaN(second);
      }),
      map(([first, second]) => first + second)
    ).subscribe(console.log);
```

- `forkJoin()` will combine a number of observables and on subscription will subscribe to all inner observables but only after **all inner observables have completed** will the **last emitted values from each** inner observable be emitted as an array. So The use cases for forkJoin are generally similar to Promise.all
```typescript
    const GITHUB_API_BASE = 'https://api.github.com';
    forkJoin({
      user: ajax.getJSON(`${GITHUB_API_BASE}/users/reactivex`),
      repo: ajax.getJSON(`${GITHUB_API_BASE}/users/reactivex/repos`)
    }).subscribe(console.log);
```

### RxJS's `Subject`
- An `Observable` is by default unicast. (*Unicasting* means that each subscribed observer owns an independent, individual execution path of the Observable.) RxJs's `Subject` is still an Observable (and it also an Observer so it has next, error and complete method) allows for sharing an execution of **multicasting** so it can broadcast changes to other observables which are subscribed to the Subject. We use `Subject` to share state amongst multiple components. Subjects comes in various flavours:
  - `BehaviourSubject` is used to share execution and deliver an initial value and the most common use case is late subscribers
  - `ReplaySubject` is used to replay values to late subscribers
  - `AsyncSubject` is ued to emitting the last values to subscribers before completion
- **Warning:** Generally we do not want to expose a Subject directly as anything which has the subject can then send values. (In Angular we might want to hide the subject behind a service.) But we may want to expose the subject as an observable to the other consumers/subscribers and `Subject` has a `toObservable()` method    
```typescript
    const observer = {
      next: val => console.log('next', val),
      error: err => console.log('error', err),
      complete: () => console.log('complete')
    };
    const subject = new Subject();
    subject.next('Hello');
    const subscription = subject.subscribe(observer);
    const secondSubscription = subject.subscribe(observer);
    subject.next('World');
```    

### Sharing state using `multicast` and `share()`      
- Most common use case for Subject is converting from unicast to multicast and sometimes we wan to share state amongst observables. The `share()` operator which internally uses a subject to multicast any value it receives to other subscribers
- In this example, the multicast returns a `ConnectableObservable` so we have to connect and unsubscribe from this ConnectedObservable:
```typescript
    const interval$ = interval(2000).pipe(
      tap(i => console.log('new interval', i))
    );
    const multicastedInterval$ = interval$.pipe(
       //The multicast operator will subscribe the Subject you return to the underlying observable when connect() is called.
       //This can be any flavor of Subject, for instance you can also multicast with a Behavior or ReplaySubject
       multicast(() => new Subject())
    );
    const connectedSub = multicastedInterval$.connect(); //need to call connect here
    const subOne = multicastedInterval$.subscribe(observer);
    const subTwo = multicastedInterval$.subscribe(observer);
    setTimeout(() => {
      connectedSub.unsubscribe();
    }, 3000);
```

Rather than call `unsubscribe()` on the ConnectedObservable, the `refCount()` operator can do this:

```typescript
    const interval$ = interval(2000).pipe(
      tap(i => console.log('new interval', i))
    );
    const multicastedInterval$ = interval$.pipe(
      multicast(() => new Subject())
      refCount()
    );

    const subOne = multicastedInterval$.subscribe(observer);
    const subTwo = multicastedInterval$.subscribe(observer);

    setTimeout(() => {
        subOne.unsubscribe();
        subTwo.unsubscribe();
    }, 3000);
```

This process of calling multicast with a refcount is so common RxJs provides `share()` which use `multicast()` and `refCount()` behind the scenes: 

```typescript
    const observer = {
      next: val => console.log('next', val),
      error: err => console.log('error', err),
      complete: () => console.log('complete')
    };
    
    const multicastedInterval$ = interval$.pipe(
      // We can actually optimize this example even further. Because multicasting with a refCount is so common, RxJS offers 
      // an operator that does both of these things for us, the share operator. This let's us replace multicast and refCount with share for the same behavior.
      share()
    );
    const subOne = multicastedInterval$.subscribe(observer);
    const subTwo = multicastedInterval$.subscribe(observer);
    
    setTimeout(() => {
      subOne.unsubscribe();
      subTwo.unsubscribe();
    }, 3000);
    ```
### `BehaviourSubject`
- If you late subscribers want to receive the last submitted value (or a seed value) then you want `BehaviourSubject` so use this when the delivery of current state to late subscribers is important

  ```typescript
    const observer = {
      next: val => console.log('next', val),
      error: err => console.log('error', err),
      complete: () => console.log('complete')
    };
    
    // BehaviorSubject's accept an argument, the initial seed value.
    // This value will be emitted to subscribers until .next is called
     
    const subject = new BehaviorSubject('Hello');
    const subscription = subject.subscribe(observer);
    subject.next('World');
        
      //Contrary to the normal Subject, BehaviorSubject will deliver the last emitted value to late subscribers.
    const secondSubscription = subject.subscribe(observer);
    subject.next('Goodbye!');
    
    //You can also access the current value of the BehaviorSubject synchronously by calling getValue(), 
    //although this is generally not advised.
    console.log('getValue()', subject.getValue());
  ```

### Implementing an ObservableStore using Subjects

```typescript
    export class ObservableStore {
      
      private _store: BehaviorSubject<any>;
      private _stateUpdate = new Subject();
    
      constructor(initialState) {
        this._store = new BehaviorSubject(initialState);
        this._stateUpdate.pipe(
          //Accumulate state over time using scan.
          scan((current, updated) => {
            return { ...current, ...updated }
          }, initialState)
        ).subscribe(this._store);
      }
    
      selectState(key: string) {
        return this._store.pipe(
          distinctUntilKeyChanged(key),
          map(state => state[key])
        );
      }
    
      updateState(newState: object) {
        this._stateUpdate.next(newState);
      }
    
      stateChanges() {
        return this._store.asObservable();
      }
    }

    //Test the Observable store
    const store = new ObservableStore({user: 'joe', isAuthenticated: true});
    store.selectState('user').subscribe(console.log);
    store.updateState({user: 'bob'});
    store.updateState({isAuthenticated: true});
    store.updateState({isAuthenticated: false});

```

### `ReplaySubject`
- `ReplaySubject` is used to emit old values to new subscribers and are typically used when late subscribers are required to receive more than the last emitted value (or seed) or need to reply all values. The typical use case is where you need a late subscriber to receeive all previously emitted values. `ReplaySubject` also takes an integer argument specifyng the number of values to be replayed if you don't want the entire history. 
- Unlike `BehaviourSubject`, `ReplaySubject` does not accept an initial seed value. If you have an initial state and only want o  want to receive updated state then use `BehaviourSubject`
```typescript
    const observer = {
      next: val => console.log('next', val),
      error: err => console.log('error', err),
      complete: () => console.log('complete')
    };
    
    const subject = new ReplaySubject(2);
    subject.next('Hello');
    const subscription = subject.subscribe(observer);
    subject.next('World');
    
    const secondSubscription = subject.subscribe(observer);
    subject.next('Goodbye!');
    subject.next('World!');
    const thirdSubscription = subject.subscribe(observer);
```
