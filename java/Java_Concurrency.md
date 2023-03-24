## Java Concurrency

### Java 1 and 2

- Key word `volatile` is a weak form of synchronization, guarantees visibility but not blocking

### Java 5

- Java 5 introduced the `java.util.concurrent` package to make writing concurrent code easier

### Concurrent Collections
- `ConcurrentHashMap`: chieve thread-safety by dividing their data into segments. Uses lock-striping on segments- has a variable number of locks - so better than `synchronizedMap()` which requires lock on the entire map
- `CopyOnWriteArrayList`: makes a new copy of its elements for every write operation and its iterator holds a different copy (snapshot) so it enables sequential writes and concurrent reads: only one thread can execute write operation and multiple threads can execute read operations at the same time.
- ` BlockingQueue`:  Queue that additionally supports operations that wait for the queue to become non-empty when retrieving an element, and wait for space to become available in the queue when storing an element.

## Atomic Variables
- `AtomincInteger`
- `AtomincReference`

### ExecutorService and Executor API
- `ExecutorService` - the ES's `execute()` method returns a `Future` will block when you call get 

### Synchronizers
- `Latch` (e.g. `CountdownLatch`)
- `FutureTask` (e.g. `CountdownLatch`)
- `Semaphore` 
- `Barrier`

### Locks
- `ReadWriteLock`
- `ReentrantLock`


### Java 7
- `Fork/Join`
- Cancel a `Future` by addition of `cancel` method
- Automatic Resource Management (ARM)
- [NIO2](https://www.baeldung.com/java-nio-vs-nio-2) - use `Channel` to allows us to read and write to a buffer. A buffer is really just a block of memory. Use `selector` to manage multiple channels with a single thread

### Java 8
- `CompletableFuture`: . Along with the Future interface, it also implemented the CompletionStage interface which defines  contract for an asynchronous computation step that can be combined with other steps. Has behaviour for composing and combining
- `CompletableFuture` as a simple `Future` - use the `calculateAsync()` method on Executor API to returns a Future instance.
- **Async**: static methods `runAsync` and `supplyAsync` allow us to create a `CompletableFuture` instance out of `Runnable` and `Supplier` functional types correspondingly. 
