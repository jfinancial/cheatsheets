## Reactive Programming Using Project Reactor

#### Four IO Models:
1. **Blocking** - this is default in the old java world (e.g. I (thread) call a company (service) and wait for them to call me )
2. **Asynchronous** - the task is synchronous but there is still blocking (e.g. equivalent of me asking a friend to call company)
3. **Non-Blocking** - the OS notifies (e.g. equivalent of company taking my number and calling me back)
4. **Non-Blocking & Asynchronous** - this is hybrid and best but is extremely complex to implement so we need a library to take care of complexity (e.g. my friend is called back by company)


#### Reactive Programming Summary:

- Reactive programming frameworks can be thought of presenting "IO-As-A-Service". Reactive STreams are based on the Observer pattern which is based on Publishers and Subscribers. 
- Reactive frameworks also have a Processor which can act as a **Publisher** and a **Subscriber** and the relationship is established via a **Subscription** via the `onSubscribe()`. Generally, there `onNext()` methis is called to emit results and then `onComplete()` is called when no more items are available to emit. If an error is encountered then the  `onError()`is called. After `onComplete()` or `onError()` is called then no more events will be emitted
- Reactive programming can be thought of a special case of event-driven, asynchronous programming and often we are dealing with data flow of **data pipelinese**
- There are various synonyms for Publisher (e.g Source Observable, Upstream, Producer) and for Subscriber (e.g. Sink, Observer, Downstream, Consumer)
- Reactor's implementations of Publisher are `Mono` (for zero or 1) and `Flux` which can emit (0 or N items)
- You can multiple subscribers subcribing to a publisher i.e. a `Mono` or a `Flux`


## Mono

### `Mono.just()`

- Using `Mono.just()` is the easiest way to create a Mono. The Mono is a publisher is lazy so nothing will happen until `subscribe()` is called
```java
    Mono<String> m = Mono.just("ball")
    m.subscribe( item => System.out.println(item), 
                 err -> System.err.println(err.getMessage(), 
                 () -> System.out.println("Completed")))
```
- You can create a `Mono` from a `Callable`
```java
Supplier<String> stringSupplier = () -> getName();
Mono<String> mono = Mono.fromSupplier(stringSupplier);
mono.subscribe(Util.onNext());

Callable<String> stringCallable = () -> getName();
Mono.fromCallable(stringCallable)
        .subscribe(Util.onNext());
```
- You can also create a `Mono` from a Runnable although Runnable will not return any value - it will just execue the task
- Remember, no work happens in the pipeline until subscribe is called and you want to make sure everything in the pipeline is non-blocking where possible.

## Flux

- You can create a `Flux` from a list or array:
```java
Flux.fromIterable(Arrays.asList("a", "b", "c")).subscribe(Util.onNext());
Flux.fromArray({ 2, 5, 7, 8}).subscribe(Util.onNext());
```

- You can create a `FLux` from a range to simulate a for-loop - note also the use of `log()` to log operations:
```java
Flux.range(1, 10).map(i )Flux.range(3, 10)
        .log()
        .map(i -> Util.faker().name().fullName())
        .log()
        .subscribe(Util.onNext());
```

### Custom Subscriber
- Here we implement a customer subscriber - note that after the subscriber has been cancelled then no more items are emitted:
```java
 AtomicReference<Subscription> atomicReference = new AtomicReference<>();
        Flux.range(1, 20).log().subscribeWith(new Subscriber<Integer>() {
                    @Override
                    public void onSubscribe(Subscription subscription) {
                        System.out.println("Received Sub : " + subscription);
                        atomicReference.set(subscription);
                    }

                    @Override
                    public void onNext(Integer integer) {
                        System.out.println("onNext : " + integer);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        System.out.println("onError : " + throwable.getMessage());
                    }

                    @Override
                    public void onComplete() {
                        System.out.println("onComplete");
                    }
                });

        Util.sleepSeconds(3);
        atomicReference.get().request(3);
        Util.sleepSeconds(5);
        atomicReference.get().request(3);
        Util.sleepSeconds(5);
        atomicReference.get().cancel();
        Util.sleepSeconds(3);
        atomicReference.get().request(4);
        Util.sleepSeconds(3);
```
### Flux Replacing List
- We can produce a publisher (i.e. Flux) in the same way we might create a List except it is performed asynchronously and non-blocking and **values are emitted as they are produced**:
```java
    public static List<String> getNames(int count){
        List<String> list = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
                list.add(getName());
        }
        return list;
    }

    public static Flux<String> getNames(int count){
       return Flux.range(0, count).map(i -> getName());
    }

    private static String getName(){
        return Util.faker().name().fullName();
    }
```
### Interval to Publish Event Periodically
- Note that when you use `Flux.interval()` it will internally use parallel threading model
```java
Flux.interval(Duration.ofSeconds(1)).subscribe(Util.onNext());
```
### Flux From A Mono
- You can create a Flux from any other publisher:
```java
Mono<String> mono = Mono.just("a");
Flux<String> flux = Flux.from(mono);
```
- Note that we can also get a Mono from a Flux by calling next - here we get any empty Mono because the first item is 1 and not greater than 3:
```java
Flux.range(1, 10).next() // 1.filter(i -> i > 3).subscribe(Util.onNext(), Util.onError(), Util.onComplete());
```
### Flux Create (from Sink)
```java
      Flux.create(fluxSink -> {
            String country;
            do{
                country = Util.faker().country().name();
                fluxSink.next(country);
            }while (!country.toLowerCase().equals("canada" && !fluxSink.isCancelled()));
            fluxSink.complete();
        })
        .subscribe(Util.subscriber());

```
- ...a cleaner version might be to implement `Consumer<FluxSink<T>>` - note that a `FluxSink` can be shared by multiple threads:
```java
public class NameProducer implements Consumer<FluxSink<String>> {

    public static void main(String[] args) {
        NameProducer nameProducer = new NameProducer();
        Flux.create(nameProducer).subscribe(Util.subscriber());
        Runnable runnable = nameProducer::produce;
        for (int i = 0; i < 10; i++) {
            new Thread(runnable).start();
        }
        Util.sleepSeconds(2);
    }
    
    private FluxSink<String> fluxSink;

    @Override
    public void accept(FluxSink<String> stringFluxSink) {
        this.fluxSink = stringFluxSink;
    }

    public void produce(){
        String name = Util.faker().name().fullName();
        String thread = Thread.currentThread().getName();
        this.fluxSink.next(thread + " : " + name);
    }

}
```
### Using `take(n)` to limit number of values
- We can use `take(n)` to just take the first n values - it will then cancel the subscription and send `onComplete`:
```java
 Flux.range(1, 10).take(3).subscribe(Util.subscriber());
```

### The `generate()` method and `SynchronousSink`
- When calling `Flux.generate(..)` we pass a `SynchronousSink` and this can only take one item via `next` - if you try to call `next` again then you get an error. We can implement our previous example using this method:
```java
Flux.generate(synchronousSink -> {
        String country = Util.faker().country().name();
        System.out.println("emitting " + country);
        synchronousSink.next(country);
        if(country.toLowerCase().equals("canada"))
        synchronousSink.complete();
        })
        .subscribe(Util.subscriber());

```

### Flux `generate()` With Counter 
- There is a overloaded generate method which takes an initial state and can be used for a counter:
```java
   Flux.generate(() -> 1,(counter, sink) -> {
                   String country = Util.faker().country().name();
                   sink.next(country);
                   if(counter >= 10 || country.toLowerCase().equals("canada") )
                       sink.complete();
                  return counter + 1;
                }
        ).take(4)
        .subscribe(Util.subscriber())

```

### Flux `push()` for single-threaded
- The `create()` method is threadsafe and internally uses `SynchronousSink` but `push()` is not threadsafe and so must only be used with single thread:
```java

        NameProducer nameProducer = new NameProducer();
        Flux.create(nameProducer).subscribe(Util.subscriber());
        Runnable runnable = nameProducer::produce;
        for (int i = 0; i < 10; i++) {
            new Thread(runnable).start();
        }
        Util.sleepSeconds(2);
```

-----

## Operators

### `handle()`
- Handle can be used like a filter/map combination:
```java
 Flux.range(1, 20).handle((integer, synchronousSink) -> {
     if(integer == 7)
         synchronousSink.complete();
     else
         synchronousSink.next(integer);
 }).subscribe(Util.subscriber());
```

### Handling Until Condition Met
- We can reimplement our previous example and call complete:
```java
 Flux.generate(synchronousSink -> synchronousSink.next(Util.faker().country().name()))
        .map(Object::toString)
        .handle((s, synchronousSink) -> {
             synchronousSink.next(s);
            if(s.toLowerCase().equals("canada"))
                synchronousSink.complete();
            })
        .subscribe(Util.subscriber());
```

### Callbacks Using Do Hooks (e.g. `doOnNext',``doOnComplete`, `doOnError`)
```java
    Flux.create(fluxSink -> {
            System.out.println("inside create");
            for (int i = 0; i < 5; i++) {
                fluxSink.next(i);
            }
           // fluxSink.complete();
            fluxSink.error(new RuntimeException("oops"));
            System.out.println("--completed");
        })
        .doOnComplete(() -> System.out.println("doOnComplete"))
        .doFirst(() -> System.out.println("doFirst"))
        .doOnNext(o -> System.out.println("doOnNext : " + o))
        .doOnSubscribe(s -> System.out.println("doOnSubscribe" + s))
        .doOnRequest(l -> System.out.println("doOnRequest : " + l))
        .doOnError(err -> System.out.println("doOnError : " + err.getMessage()))
        .doOnTerminate(() -> System.out.println("doOnTerminate"))
        .doOnCancel(() -> System.out.println("doOnCancel"))
        .doFinally(signal -> System.out.println("doFinally 1 : " + signal))
        .doOnDiscard(Object.class, o -> System.out.println("doOnDiscard : " + o))
        .take(2)
        .doFinally(signal -> System.out.println("doFinally 2 : " + signal))
        .subscribe(Util.subscriber());
```
- The output of above is - note that if you want `doFinally()` to execue after complete then it must be placed after the `take()`:
```text
doFirst
doOnSubscribereactor.core.publisher.FluxPeekFuseable$PeekConditionalSubscriber@28c9cde9
doOnRequest : 9223372036854775807
inside create
doOnNext : 0
Received : 0
doOnNext : 1
Received : 1
doOnCancel
doFinally 1 : cancel
Completed
doFinally 2 : onComplete
doOnDiscard : 2
doOnDiscard : 3
doOnDiscard : 4
--completed
```

### Use `limitRate()` for Buffering
- The `limitRate()` operator can be used to buffer so it will request 75% and wait for items to be drained:
- Note that we uf `limitRate(100, 0)` then we wait for everything to be drained
```java
     Flux.range(1, 1000) // 175
        .log()
        .limitRate(100, 99) // Wait for 99% of the data to be consumed 
        .subscribe(Util.subscriber());
```

### Use `delayElements()` for Buffering
- We can delay emitting by a specified duration using `delayElements()`
````java
    System.setProperty("reactor.bufferSize.x", "9"); //otherwise this is by 32 by default
    Flux.range(1, 100)  
        .log()
        .delayElements(Duration.ofSeconds(1))
        .subscribe(Util.subscriber());
    Util.sleepSeconds(60);
````

### Use `onError()` to Handle Errors
- You can `onError()` to handle errors on `onErrorResume()` to perhaps provide a fallback value. Meanwhile `onErrorContinue` also supplies the object which caused the exception:
```java
    Flux.range(1, 10)
        .log()
        .map(i -> 10 / (5 - i))
        .onErrorContinue((err, obj) -> {
            //handle error here
        })
        .subscribe(Util.subscriber())
```
### Use `timeout()` to Wait For Maximum Duration
- In this exmple we wait for 2 seconds but our Producer only produces every 5 seconds so it fallsback to another producer:
```java
    public static void main(String[] args) {
        getOrderNumbers().timeout(Duration.ofSeconds(2), fallback())
                .subscribe(Util.subscriber());
        Util.sleepSeconds(60);
    }

    private static Flux<Integer> getOrderNumbers(){
        return Flux.range(1, 10).delayElements(Duration.ofSeconds(5));
    }

    private static Flux<Integer> fallback(){
        return Flux.range(100, 10).delayElements(Duration.ofMillis(200));
    }
```

### Use `defaultIfEmpty()` to Set A Default Value If None Is Produced
```java
 public static void main(String[] args) {

        getOrderNumbers().filter(i -> i > 10)
                .defaultIfEmpty(-100) // we provide a constant
                .subscribe(Util.subscriber());
    }

    private static Flux<Integer> getOrderNumbers(){
        return Flux.range(1, 12);
    }
```

### Use `switchIfEmpty()` to Fallback to Another Publisher
```java
   public static void main(String[] args) {
        getOrderNumbers()
        .filter(i -> i > 10)
        .switchIfEmpty(fallback())
        .subscribe(Util.subscriber());
    }

    private static Flux<Integer> getOrderNumbers(){
        return Flux.range(1, 10);
    }


    private static Flux<Integer> fallback(){
        return Flux.range(20, 5);
}
```

### Use `transform()` to Build Custom Operators
- The `transform()` method takes a `Function<Flux<T>, Flux<T>>` - here we use it to filtering and changing case
```java
    public static void main(String[] args) {
        getPerson().transform(applyFilterMap())
            .subscribe(Util.subscriber());
    }

    public static Flux<Person> getPerson(){
        return Flux.range(1, 10).map(i -> new Person());
    }

    public static Function<Flux<Person>, Flux<Person>> applyFilterMap(){
        return flux -> flux.filter(p -> p.getAge() > 10)
                            .doOnNext(p -> p.setName(p.getName().toUpperCase()))
                            .doOnDiscard(Person.class, p -> System.out.println("Not allowing : " + p));
    }
```

### Use `switchOnFirst()` to test a condition on the publisher
-  We pass a signal (e.g. `onNext` )and the Flux and we look at the first emitted value to make some decision logic:
```java
public static void main(String[] args) {
        getPerson().switchOnFirst((signal, personFlux) -> {
                    System.out.println("inside switch-on-first");
                    return signal.isOnNext() && signal.get().getAge() > 10 ? personFlux : applyFilterMap().apply(personFlux);
                })
                .subscribe(Util.subscriber());
    }

    public static Flux<Person> getPerson(){
        return Flux.range(1, 10).map(i -> new Person());
    }

    public static Function<Flux<Person>, Flux<Person>> applyFilterMap(){
        return flux -> flux.filter(p -> p.getAge() > 10)
                .doOnNext(p -> p.setName(p.getName().toUpperCase()))
                .doOnDiscard(Person.class, p -> System.out.println("Not allowing : " + p));
    }
}
```

### Use `flapMap()` and `concatMap()` to flatten a Flux to a list of objects
- We use `flapMap()` to internally a flatten a Flux to objects by internally subscribing
- The  `concatMap()` is similar to `flapMap()` except it waits for an `onComplete()` 
- The two functions are very similar and the subtle difference is how the output is created ( after the mapping function is applied): `flatMap()` uses merge operator while `concatMap()` uses concat operator. The `concatMap()` output sequence is ordered - all of the items emitted by the first Observable being emitted before any of the items emitted by the second Observable, while `flatMap` output sequence is merged - the items emitted by the merged Observable may appear in any order, regardless of which source Observable they came from.
```java
    UserService.getUsers()
        .flatMap(user -> OrderService.getOrders(user.getUserId())) // mono / flux
        .filter(p -> p > 10)
        .subscribe(Util.subscriber());

    public static Flux<PurchaseOrder> getOrders(int userId){
        return Flux.create((FluxSink<PurchaseOrder> purchaseOrderFluxSink) -> {
        db.get(userId).forEach(purchaseOrderFluxSink::next);
        purchaseOrderFluxSink.complete();
        })
        .delayElements(Duration.ofSeconds(1));
    }

```

-----

## Hot and Cold Publishers
- A cold publisher does not emit data until subscribe is called but a hot publisher is where there is one data subscriber for all consumers and this is shared or broadcast.
- Note that when we call `publish()` it returns a `ConnectableFlux`

### Cold Publisher
- Here the two subscribers call subscribe at different times but both see all data:
```java
    public static void main(String[] args) {

        Flux<String> movieStream = Flux.fromStream(() -> getMovie())
                .delayElements(Duration.ofSeconds(2));
        movieStream.subscribe(Util.subscriber("sam"));
        Util.sleepSeconds(5);
        movieStream.subscribe(Util.subscriber("mike"));
        Util.sleepSeconds(60);
    }

    private static Stream<String> getMovie(){
        return Stream.of("Scene 1","Scene 2","Scene 3","Scene 4","Scene 5","Scene 6","Scene 7");
    }
```

### Hot Publisher
- By calling `share()` we turn a cold pubisher into a hot publisher - this is like terrestrial TV (where we might be late to a broadcast) vs on-demand (where we watch the programme when we like)

```java
   public static void main(String[] args) {
        Flux<String> movieStream = Flux.fromStream(() -> getMovie())
                .delayElements(Duration.ofSeconds(2))
                .share();
        movieStream.subscribe(Util.subscriber("sam"));
        Util.sleepSeconds(5);
        movieStream.subscribe(Util.subscriber("mike"));
        Util.sleepSeconds(60);
    }

    private static Stream<String> getMovie(){
        return Stream.of("Scene 1","Scene 2","Scene 3","Scene 4","Scene 5","Scene 6","Scene 7");
    }
```

### Use `refCount()` to Ensure Minimum Number of Subscribers
- By calling `refCount(1)` we ensure we don't emit data until we have at least one subscriber
- The `share()` method is an alias for `publish().refcount(1)`
```java
    Flux<String> movieStream = Flux.fromStream(() -> getMovie())
        .delayElements(Duration.ofSeconds(1))
        .publish()
        .refCount(1);
    movieStream.subscribe(Util.subscriber("sam"));
    Util.sleepSeconds(3);
    movieStream.subscribe(Util.subscriber("mike"));
    Util.sleepSeconds(60);
```
- Note that if we change the sleep to 10 seconds then the first subscriber ('sam') has consumed the stream so when the second subscriber ('mike') subscribes then it will start from the first element ('scene 1'):
```java
```java
    Flux<String> movieStream = Flux.fromStream(() -> getMovie())
        .delayElements(Duration.ofSeconds(1))
        .publish()
        .refCount(1);
    movieStream.subscribe(Util.subscriber("sam"));
    Util.sleepSeconds(10);
    movieStream.subscribe(Util.subscriber("mike"));
    Util.sleepSeconds(60);
```

### Use `autoConnect()` to Avoid Re-Emitting Data
- With `autoConnect()` we specify a minimum number of subscribers but in this case the first subscriber ('sam') has consumed the stream so when the second subscriber ('mike') subscribes nothing is emitted as it has already been consumed (i.e there is no resubscribe):
- Note that if set `autoConnect(0)` data will be start emitting data even before a subscriber joins
```java
   Flux<String> movieStream = Flux.fromStream(() -> getMovie())
                .delayElements(Duration.ofSeconds(1))
                .publish()
                .autoConnect(1);
    Util.sleepSeconds(3);
    movieStream.subscribe(Util.subscriber("sam"));
    Util.sleepSeconds(10);
    System.out.println("Mike is about to join");
    movieStream.subscribe(Util.subscriber("mike"));
    Util.sleepSeconds(60);
```

### Use `cache` to Cache Elements From A Stream
- By using `cache` we can keep n number of elements for late subscribers:
```java
    Flux<String> movieStream = Flux.fromStream(() -> getMovie())
                .delayElements(Duration.ofSeconds(1))
                .cache(2);
        Util.sleepSeconds(2);
        movieStream.subscribe(Util.subscriber("sam"));
        Util.sleepSeconds(10);
        System.out.println("Mike is about to join");
        movieStream.subscribe(Util.subscriber("mike"));
        Util.sleepSeconds(60);
```

-----

## Threading & Schedulers
 - By default everything happens in the main thread but Reactor provides a threadpool and schedulers for time-consuming operations:

| Schedulers method | Purpose                                                  |
|-------------------|----------------------------------------------------------|
| `boundedElastic`  | Network / time-consuming calls  ( 10 x number of core)   |
| `parallel`        | CPU intensive  (1 thread per core)                       |
| `single`          | Single, dedicated thread for one-off usage               |
| `immediate`       | Current thread                                           |

- There are two main operators:

| Operator         | Purpose                                    |
|------------------|--------------------------------------------|
| `subscribeOn`    | For upstream                               |
| `publishOn`      | For downstream                             |

### Example of `subscribeOn` to Choose Threading Model For Upstream (i.e Publisher)
- We use the Schedululers to pass the thread type and if we have multiple calls to `subscribeOn` then it will switch accordingly - if unsure use `boundedElastic()`
- When we use `parallel()` we might still execute using a single thread, it doesn't mean parallel execution. Operations are always sequential and data is processed on by one in the thread-pool for the subscriber. Instead `parallel()` is intended for CPU-intensive tasks.
```java
  public static void main(String[] args) {
        Flux<Object> flux = Flux.create(fluxSink -> {
            printThreadName("create");
            for (int i = 0; i < 4; i++) {
                fluxSink.next(i);
                Util.sleepSeconds(1);
            }
            fluxSink.complete();
        })
        .doOnNext(i -> printThreadName("next " + i));
       flux.subscribeOn(Schedulers.boundedElastic())
         .subscribe(v -> printThreadName("sub " + v));
        flux.subscribeOn(Schedulers.parallel())
            .subscribe(v -> printThreadName("sub " + v));
        Util.sleepSeconds(5);
    }

    private static void printThreadName(String msg){
        System.out.println(msg + "\t\t: Thread : " + Thread.currentThread().getName());
    }
```
- As a developer when we create a Publisher we should define the manner in which it gets executed asynchronously - it is not the job of the subscriber to decide scheduling:
```java
 public Flux<String> revenueStream(){
        return Flux.interval(Duration.ofSeconds(2))
                    .map(i -> db.toString())
                    .subscribeOn(Schedulers.boundedElastic());
    }
```
### Example of `publishOn` to Switch Threading Model For Downstream (i.e. subscriber) 
- Subscribe on is for upstream and publishOn is for upstream. If we call `subscribeOn` or `publishOn` multiple times then the one nearest to the source will take priority.
```java
  public static void main(String[] args) {

        Flux<Object> flux = Flux.create(fluxSink -> {
            for (int i = 0; i < 4; i++) {
                fluxSink.next(i);
            }
            fluxSink.complete();
        })
        .doOnNext(i -> printThreadName("next " + i));
        
        flux.publishOn(Schedulers.parallel())
        .doOnNext(i -> printThreadName("next " + i))
        .subscribeOn(Schedulers.boundedElastic())
        .subscribe(v -> printThreadName("sub " + v));
        Util.sleepSeconds(5);

        }
```
- The output from the above code shows that the initial work done by the subscriber in `subscribeOn`
```text
create		: Thread : boundedElastic-1
next 0		: Thread : boundedElastic-1
next 1		: Thread : boundedElastic-1
next 2		: Thread : boundedElastic-1
next 3		: Thread : boundedElastic-1
next 0		: Thread : parallel-1
sub 0		: Thread : parallel-1
next 1		: Thread : parallel-1
sub 1		: Thread : parallel-1
next 2		: Thread : parallel-1
sub 2		: Thread : parallel-1
next 3		: Thread : parallel-1
sub 3		: Thread : parallel-1
```

### Use `runOn(Schedulers.parallel())` and `parallel()` to Achieve Parallel Execution 
- We can use `runOn(Schedulers.parallel())` and `parallel()` to achieve parallel execution. Note that calling `parallel()` returns a `ParallelFlex` 
- The `sequential()` method turns this into a single publisher
- Be aware that `Flux.interval()`
```java
    public static void main(String[] args) {
        Flux.range(1, 10)
                .parallel(10)
                .runOn(Schedulers.boundedElastic())
                .doOnNext(i -> printThreadName("next " + i))
                //.sequential()
                .subscribe(v -> printThreadName("sub " + v));
        Util.sleepSeconds(5);
    }
```
---- 

## Backpressure and Overflow Strategy

- By default Reactor will buffer (`onBackpressureBuffer`)items in memory but this is not always optimal in certain situations because it could lead to an out of memory error
- The `onBackpressureBuffer` can take an argument which is the size of the queue. The size of the queue can also be set via the property  `System.setProperty("reactor.bufferSize.small", "16")` 
- The `onBackpressureBuffer` can take a second argument which is a consumer to handle items which are dropped
- If select `onBackpressureDrop` and the queue is small then when it gets 75% full later items get dropped
- `onBackpressureDrop` can take a consumer or a sink to take overflowing items


| Strategy                | Behaviour                                                            |
|-------------------------|----------------------------------------------------------------------|
| `onBackpressureBuffer`  | Buffer in memory (default behaviour but memory intensive)            |
| `onBackpressureDrop`    | Once the queue is full then drop items                               |
| `onBackpressureLatest`  | Once the queue is full then keep 1 latest item and drop other items  |
| `onBackpressureError`   | Once the queue is full then throw an error                           |

### Example of `onBackpressureError`
```java
    public static void main(String[] args) {
        System.setProperty("reactor.bufferSize.small", "16");// 75% 12
        Flux.create(fluxSink -> {
            for (int i = 1; i < 201 && !fluxSink.isCancelled(); i++) {
                fluxSink.next(i);
                System.out.println("Pushed : " + i);
                Util.sleepMillis(1);
            }
            fluxSink.complete();
        })
        .onBackpressureError()
        .publishOn(Schedulers.boundedElastic())
        .doOnNext(i -> { Util.sleepMillis(10); })
        .subscribe(Util.subscriber());
        Util.sleepSeconds(10);
    }
```
---- 

## Combining Publishers

| Strategy        | Behaviour                                                                                            |
|-----------------|------------------------------------------------------------------------------------------------------|
| `startWith`     | Specify another publisher to try first (e.g. cacheing) - doesn't wait for onComplete                 |
| `concat`        | Will emit values from all the concatenated publishers (lazily concatenating i.e. on onComplete)      |
| `merge`         | The publishers are internally merged - completes when all are completed                              |
| `zip`           | Like a factory line pipeline - one element from each are combined and emitting together              |
| `combineLatest` | Combines latest items from all publishers -  takes a bifunction on how to combine                    |


- Example of `startWith()`
```java
public class NameGenerator {

    private List<String> list = new ArrayList<>();

    public Flux<String> generateNames(){
        return Flux.generate(stringSynchronousSink -> {
            System.out.println("generated fresh");
            Util.sleepSeconds(1);
            String name = Util.faker().name().firstName();
            list.add(name);
            stringSynchronousSink.next(name);
        })
        .cast(String.class)
        .startWith(getFromCache());
    }

    private Flux<String> getFromCache(){
        return Flux.fromIterable(list);
    }

}
```
- Example of `concat()` in which we use `concatDelayError` to delay error until the end
```java
 public static void main(String[] args) {
        Flux<String> flux1 = Flux.just("a", "b");
        Flux<String> flux2 = Flux.error(new RuntimeException("oops"));
        Flux<String> flux3 = Flux.just("c", "d", "e");
        Flux<String> flux = Flux.concatDelayError(flux1, flux2, flux3);
        flux.subscribe(Util.subscriber());
    }
```
----   
## Buffering & Batching

### Buffering: Overlap vs Sampling
- There is `buffer(n)` to buffer n items to emit at a time and `bufferTimeout` so it will buffer n items or reach timeout (whatever comes first)
```java
    public static void main(String[] args) {
        eventStream().bufferTimeout(5, Duration.ofSeconds(2))
                .subscribe(Util.subscriber());
        Util.sleepSeconds(60);
    }


    private static Flux<String> eventStream(){
        return Flux.interval(Duration.ofMillis(800)).map(i -> "event"+i);
    }
```
- `buffer(maxSize, skip)` provides the ability for items to overlap (e.g. `buffer(3,2)` one item will be repeated from last set with 2 new items). Note that `buffer(3)` is the same as `buffer(3,3)`. If `buffer(3,5)` is the equivalent of saying for every 5 items only take 3 (i.e. sampling)

### Use `window` (to batch into another Flux)
- Using `window()` creates a new Flux - with the Flux (as opposed to a list), it doesn't have to wait for the items to arrive
- Note that `window()` can also take a Duration
```java
    private static AtomicInteger atomicInteger = new AtomicInteger(1);

    public static void main(String[] args) {
        eventStream().window(3)
                .flatMap(flux -> saveEvents(flux))
                .subscribe(Util.subscriber());
        Util.sleepSeconds(60);
    }

    private static Flux<String> eventStream(){
        return Flux.interval(Duration.ofMillis(500)).map(i -> "event"+i);
    }

    private static Mono<Integer> saveEvents(Flux<String> flux){
        return flux.doOnNext(e -> System.out.println("saving " + e))
                    .doOnComplete(() -> {
                        System.out.println("saved this batch");
                    })
                    .then(Mono.just(atomicInteger.getAndIncrement()));
    }
```

### Use `groupBy` to batch up
```java
    public static void main(String[] args) {
        Flux.range(1, 30).delayElements(Duration.ofSeconds(1))
                .groupBy(i -> i % 2)  // key 0, 1
                .subscribe(gf -> process(gf, gf.key())); //gf is grouped flux
        Util.sleepSeconds(60);
    }

    //this method is only called once for each group
    private static void process(Flux<Integer> flux , int key){
        flux.subscribe(i -> System.out.println("Key : " + key + ", Item : " + i));
    }
```

----   

## Repeat & Retry

| Strategy       | Behaviour                                                                                                           |
|----------------|---------------------------------------------------------------------------------------------------------------------|
| `repeat(n)`    | Will consume the items in the publisher  n times  (source might emit different values)  - will not work with error  |
| `repeat(b)`    | Will consume the items in the publisher  again if boolean supplier condition returns true                           |
| `retry(n)`     | Will retry n times if an error is encountered                                                                       |
| `retryWhen(n)` | Can take Retry.fixedDelay(...)                                                                                      |
| `retryWhen(s)` | Can take Retry.from(....) which takes a RetrySignal - implement doOnNext/handle
 
- Retry with spec example which illustrates when to retry and when to stop
```java
    public static void main(String[] args) {
        orderService(Util.faker().business().creditCardNumber())
                .retryWhen(Retry.from(
                     flux -> flux
                                .doOnNext(rs -> {
                                    System.out.println(rs.totalRetries());
                                    System.out.println(rs.failure());
                                })
                                .handle((rs, synchronousSink) -> {
                                    if(rs.failure().getMessage().equals("500"))
                                        synchronousSink.next(1);
                                    else
                                        synchronousSink.error(rs.failure());
                                })
                                .delayElements(Duration.ofSeconds(1))
                ))
                .subscribe(Util.subscriber());
        Util.sleepSeconds(60);
    }
    
    private static Mono<String> orderService(String ccNumber){
        return Mono.fromSupplier(() -> {
            processPayment(ccNumber);
            return Util.faker().idNumber().valid();
        });
    }
    
    private static void processPayment(String ccNumber){
        int random = Util.faker().random().nextInt(1, 10);
        if(random < 8)
            throw new RuntimeException("500");
        else if(random < 10)
            throw new RuntimeException("404");
    }
```

----

## Sinks
- Sinks is both a publisher and a subscriber and allows us to control values which we are emitting. A simple sink which emits a mono can be created using `Sinks.One<T> sink = Sinks.one()`:
- By default sinks are thread-safe

```java
    Sinks.One<Object> sink = Sinks.one();
    Mono<Object> mono = sink.asMono();
    mono.subscribe(Util.subscriber("sam"));
    mono.subscribe(Util.subscriber("mike"));
    sink.tryEmitValue("Hello");
```
- The `emitValue` internally calls `tryEmitValue` so the former take a value and retry handler:

```java
    Sinks.One<Object> sink = Sinks.one();
    Mono<Object> mono = sink.asMono();
    mono.subscribe(Util.subscriber("sam"));
    mono.subscribe(Util.subscriber("mike"));
    sink.emitValue("hi", (signalType, emitResult) -> {
        System.out.println(signalType.name());
        System.out.println(emitResult.name());
        return false;
    });
    sink.emitValue("hello", (signalType, emitResult) -> {
        System.out.println(signalType.name());
        System.out.println(emitResult.name());
        return false;
     });
```

| Type             | Behaviour  | Pub:Sub                                              |
|------------------|------------|------------------------------------------------------|
| one              | Mono       | 1:N                                                  |
| many - unicast   | Flux       | 1:1  (only 1 subscriber)                             |
| many - multicast | Flux       | 1:N  (n subscribers)                                 |
| many - replay    | Flux       | 1:N  (with replay of all values to late subscribers) |

- Example of unicast sink - in this example the second subscriber will receive an error `UnitcastProcessor allows only a single Subcriber` - to fix this then use `Sinks.many().multicast()` :

```java
    // handle through which we would push items
    Sinks.Many<Object> sink = Sinks.many().unicast().onBackpressureBuffer();
    // handle through which subscribers will receive items
    Flux<Object> flux = sink.asFlux();
    flux.subscribe(Util.subscriber("sam"));
    flux.subscribe(Util.subscriber("mike"));
    sink.tryEmitNext("hi");
    sink.tryEmitNext("how are you");
    sink.tryEmitNext("?");
```
- In this example, we use a retry handler because we are inserting into a non-threadsafe ArrayList :

```java
        // handle through which we would push items
        Sinks.Many<Object> sink = Sinks.many().unicast().onBackpressureBuffer();
        // handle through which subscribers will receive items
        Flux<Object> flux = sink.asFlux();
        List<Object> list = new ArrayList<>();
        flux.subscribe(list::add);
        for (int i = 0; i < 1000; i++) {
            final int j = i;
            CompletableFuture.runAsync(() -> {
                sink.emitNext(j, (s, e) -> true);
            });
        }
        Util.sleepSeconds(3);
        System.out.println(list.size());
```
 - You are some options with  we can use with mutlicast:
   - `directAllOrNothing` => prevents buffering behaviour for first subscriber - either everyone gets the results of noone gets them (so 1+ subscriber can slow others down)
   - `directBestEffort` => other slower subscribers do not impact performance 

```java
        System.setProperty("reactor.bufferSize.small", "16");
        Sinks.Many<Object> sink = Sinks.many().multicast().directBestEffort();  // handle through which we would push items
        Flux<Object> flux = sink.asFlux(); // handle through which subscribers will receive items
        flux.subscribe(Util.subscriber("sam"));
        flux.delayElements(Duration.ofMillis(200)).subscribe(Util.subscriber("mike")); //this subscriber is slower at processing
        for (int i = 0; i < 100; i++) {
            sink.tryEmitNext(i);
        }
        Util.sleepSeconds(10);
```     

- `replay()' provides more of a history/cacheing type strategy:

```java
        Sinks.Many<Object> sink = Sinks.many().replay().all();
        Flux<Object> flux = sink.asFlux();
        sink.tryEmitNext("hi");
        sink.tryEmitNext("how are you");
        flux.subscribe(Util.subscriber("sam"));
        flux.subscribe(Util.subscriber("mike"));
        sink.tryEmitNext("?");
        flux.subscribe(Util.subscriber("jake"));
        sink.tryEmitNext("new msg");
```
