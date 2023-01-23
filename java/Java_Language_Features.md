## Java Language Features

#### Java 8

- **Lambdas** are a parenthesized set of parameters, an arrow, and then a body, which can either be a single expression or a block of Java code.
- **Streams** are created with an initial choice of sequential or parallel execution. A stream is *not* a data structure but takes input from collections, array or IO
- **Default** and static methods in interfaces
- **forEach** method in iterable interfsce
- **Java Time API** introduces `LocalDate` and `LocalDateTime` etc
- **Concurrency API** (which was introdced im Java 5) is improved. In Java 5, you can submit a `Callable` or `Runnable` tast to the `ExecutorService` which returns a `Future` and `invokeAll()` takes a collection of task. When performing async tasks then computation is scattered and we *actions are represented as callbacks* . Both `Future` and `CompletableFuture` implement `CompletionStage` which defines a contract for an asynchronous computation step.
  - [`CompletableFuture`](https://www.baeldung.com/java-completablefuture) can be used a simple `Future` but with additional completion logic - you can complete it with the `complete` method and we can spice off computation use the **Executor API** so `calculateAsync` returns a `Future` - call `get` and when ready **block** for the result
  - Executing async code? the static methods `runAsync` and `supplyAsync` allow us to create a `CompletableFuture` instance out of `Runnable` and `Supplier` functional types allowing us allows us to provide an instance of the `Supplier` as a lambda expression that does the calculation and returns the result
- `Optional` allows something to have a value or be empty

#### Java 9
- Collections now have static creation methods: `List.of()`, `Set.of()`  and `Map.of()`,
- Streams Collection added `takeWhile`, `dropWhile` and `iterate`
- Optionals add the `ifPresentOrElse` method
- Interfaces now allow private methods
- `Try-with-resources` and diamond operator extensions
- **JShell** allows simple commands to be executed
- Experimental `HttpClient` added (befoe you had to use Apache HttpClient)
- **Jigsaw** module system - a bit like OSGI - allows one jar to have different classes for different JVMs

#### Java 10
- Introduction of local variable with `var` keyword (only applies within method)
- GC improvements 


#### Java 11
- Improvements to String and Files -> String has `isBlank()`, `lines()` and `strip()`
- Local-Variable type inference for lambda params e.g. `(var firstname, var lastname) -> firstName + lastName`
- `HttpClient` finalised
- `FlightRecorder`, NoOp Garbage collection, Nashorn-Javascript-Engine deprecated


#### Java 13
- Unicode 12.1 support
- Preview of improved `switch` expression using lambda style syntax
- Multiline strings using `"""`


#### Java 14
- Standardized improved `switch` expression
- Preview of new `Record` classes - provides getters, setters, equals, hashcode and toString
- Better `NullPointerException` which informs what was null
- Preview of pattern matching - so you can drop the cast
- Packaging tool - package for platform specific (incubator)
- GC: CMS has been removed and Z GC added


#### Java 15
- Multiline strings now production-ready
- Preview of `sealed classes`
- Nashorn removed


#### Java 16
- Pattern matching for `instanceof`
- Unix-Domain Socket Channels => `socket.comnect(UnixDomainSocketAddress.of("/var/run/postgresql/.s.PGSQL.543))`
- Foreign linker API - replaces JNI
