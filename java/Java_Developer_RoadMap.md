
[Core Java Course](https://www.youtube.com/watch?v=bm0OyhwFDuY&list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5)
- Primitive datatypes: byte, short, int, long, float, double, boolean, char
- Reference datatypes:
- Casting and autoboxing
- Arithmetic operators (e.g +, -. %)
- The modulo operator (%) = https://www.baeldung.com/modulo-java
- Logical operators, short-circuiting - https://www.tutorialsfreak.com/java-tutorial/java-logical-operators
- Incrementing and decrementing: i++ vs ++i; https://www.dummies.com/article/technology/programming-web-design/java/increment-and-decrement-operators-in-java-172144/
- Addition assignment operator = https://www.digitalocean.com/community/tutorials/addition-assignment-operator-in-java
- Flow control: while and for loops; switch statements; if/else vs ternary operator => can't return from an if
- Java 17: [Sealed classes and switch statements](https://medium.com/@oskarv/java-17-features-pattern-matching-for-switch-and-sealed-classes-f631bdd56f12)

Java OO Basics: Objects & java.lang.Object
- OO Buzzwords:  Inheritance, Encapsulation, Abstraction and Polymorphism - https://www.nerd.vision/post/polymorphism-encapsulation-data-abstraction-and-inheritance-in-object-oriented-programming
- What is the role of java.lang.Object?
- Instances, keyword new and object references - https://java-programming.mooc.fi/part-5/4-objects-and-references
- Keyword null, nullability and Tony Hoare's Billion Dollar Mistake - https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/
- Lombok's @NonNull
- Objects.nonNull() vs != null
- Interfaces and the concept of "Duck typing" - https://www.geeksforgeeks.org/interfaces-and-polymorphism-in-java/
- What's a marker interface? (Examples: Serializable, Cloneable etc)
- Does Java have multiple inheritance? If not then why not? Can we get around this?
- Method overriding vs method overloading: what's the difference? @Overloaded annotation - https://www.baeldung.com/java-method-overload-override
- Type Safety vs Casting. Why is casting evil? What's type safety?
- Structural equality (equals()) vs reference equality (==)
- Immutability: keyword final - consequences of immutability, record keyword in Java 17 - read Pat Helland's "Immutability Changes Everything" https://queue.acm.org/detail.cfm?id=2884038
- Strings in java: string pooling - why are strings 
- Equals & Hashcode => shallow vs deep equality
- The finalise method
- The clone method and Java.lang.Cloneable
- Thread basics: wait/notify/notifyAll
- Heap vs stack, java memory model, Eden vs survivor space, garbage collection - https://dzone.com/articles/understanding-the-java-memory-model-and-the-garbag
- Memory leaks: how they occur and how to detect?
 
Data Structures
- Arrays & memory structure
- Collections & Iterators
- Implementations: what to use when?
- Lists: ArrayList vs LinkedList - ordering, insertion and performance considerations
- Sorting a list: comparable vs comparator
- Maps: HashMap vs LinkedHashMap vs TreeMap
- Is a HashMap threadsafe? What are the consequences?
- What's a WeakHashMap? What's the typical use case for it?
- Sets: HashSet, TreeSet, LinkedHashSet
- The SortedSet interface (ConcurrentSkipListSet, TreeSet)
- LIFO vs FIFO: Stacks and Queues - https://www.educative.io/blog/data-structures-stack-queue-java-tutorial
- Legacy implementations (jdk1.1): Hashtable, Vector
- Concurrent collections: ConcurrentHashMap, CopyOnWriteArraySet, CopyOnWriteArrayList. ConcurrentSkipListSet, CopyOnWriteArraySet
- Collections.synchronizedMap vs. ConcurrentHashMap: https://www.baeldung.com/java-synchronizedmap-vs-concurrenthashmap
- How does a HashMap work? Hashing and collisions - what makes a good hashing algorithm? Bucketing... implementing a histogram via a HashMap?
- ConcurrentHashMap Under The Hood - Region Locking: https://anmolsehgal.medium.com/concurrenthashmap-internal-working-in-java-b2a1a48c7289

Streams & Java Embraces (Some) Functional Programming
- Functional vs imperative styles
- What is FP? https://www.infoworld.com/article/3613715/what-is-functional-programming-a-practical-guide.html
- How is a stream different a collection?
- Parallel streams - https://www.baeldung.com/java-when-to-use-parallel-stream
- Lambda expressions - https://www.baeldung.com/java-8-lambda-expressions-tips 
- Functional interfaces - SAM (Single Abstract Method)  - https://dzone.com/articles/java-8-functional-interfaces-sam
- Stream terminal operations - https://www.codejava.net/java-core/collections/java-8-stream-terminal-operations-examples
- Functional programming (Consumer, Predicate, Supplier, and Function) - https://medium.com/javarevisited/java-8s-consumer-predicate-supplier-and-function-bbc609a29ff9
- Lambda limitations - https://dzone.com/articles/java-8-lambas-limitations-closures
- Are Java lambdas closures? - https://www.bruceeckel.com/2015/10/17/are-java-8-lambdas-closures/#:~:text=It%20turns%20out%20that%2C%20in,them%20that%20way%20or%20not.

Algorithms, Space/Time complexity & Big-O Notation
- Quicksort vs Mergesort - https://www.baeldung.com/java-quicksort
- Binary Search - https://www.baeldung.com/java-binary-search
- Recursion - https://www.baeldung.com/java-recursion
- Searching trees/graphs: Depth First Search (DFS) vs Breadth First Search (BFS) - https://medium.com/basecs/demystifying-depth-first-search-a7c14cccf056
- https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/
- Big O Notation - https://www.baeldung.com/cs/big-oh-asymptotic-complexity
  - Constant time - O(1): Reading from an array
  - Logarithmic time - O(log(n)):  
  - Linear Time Algorithms – O(n)
  - N Log N Time Algorithms – O(n log n)
  - Polynomial Time Algorithms – O(n^m)
  - Exponential Time Algorithms – O(k^n)
  - Factorial Time Algorithms – O(n!)
  - Asymptotic Functions

Concurrency
- Java 1/1.1 & Basic Concurrency: threads, wait/notify - https://www.baeldung.com/java-wait-notify
- Moore's Law and Processors Went Multicore - https://medium.com/@arnabkar2003/why-multi-core-processing-is-the-future-ae7cba792f0b
- Multithreading, Java 5 (2004) and the rise of multicore processors - https://medium.com/@med.ali.bennour/enhancing-java-concurrency-processor-core-threads-fibers-0cac6000e5fb#:~:text=Efficient%20Resource%20Utilization%3A%20By%20leveraging,scientific%20computations%2C%20and%20server%20applications.
- The role of keyword volatile and the happens-before guarantee - https://www.baeldung.com/java-volatile
- The synchronized keyword  - https://www.baeldung.com/java-synchronized and https://jenkov.com/tutorials/java-concurrency/synchronized.html
- Why is static synchronized so dangerous?
- ThreadLocal API: Storing data accessible only by a specific thread - https://www.baeldung.com/java-threadlocal
- Defining a thread-based task: Difference between callable vs Runnable
- Java 5's improved locking abstractions: ReentrantLock and Semaphore - https://www.baeldung.com/java-binary-semaphore-vs-reentrant-lock
- Out-of-the-box multithreading abstractions: ExecutorService - https://www.baeldung.com/java-executor-service-tutorial
- Future and CompletableFuture - https://www.baeldung.com/java-future-completablefuture-rxjavas-observable
- What is the danger of calling get() to get the value of a Future?
- Thread pool models - https://www.baeldung.com/thread-pool-java-and-guava
- Virtual threads in java: https://www.infoworld.com/article/3678148/intro-to-virtual-threads-a-new-approach-to-java-concurrency.html
