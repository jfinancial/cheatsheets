
### Books
- Effective Java by Joshua Bloch (really good principles for coding in Java in Koan-style)
- Clean Code by Robert C Martin aka Uncle Bob
- The Pragmatic Programmer by Andy Hunt and Dave Thomas
- Java Concurrency in Practice by Brian Goetz (everything you need to know about multithreading)
- Java Performance: The Definitive Guide (JVM internals and how to tweak for performance)
- Design patterns : elements of reusable object-oriented software by Gamma, Helm, Johnson and John Vlissides aka the Gang Of Four (GoF) (You will never actually read this impenetrable tome so just keep it on your desk to impress your colleagues and signal to your boss that you know what Design Patterns are all about )
- Java: Design Patterns: A Tutorial (old now but still the clearest, practical code examples of the GoF patterns)
- Refactoring: Improving the Design of Existing Code by Martin Fowler
- Patterns of Enterprise Application Architecture by Martin Fowler
- The Mythical Man-Month: Essays on Software Engineering (use this to explain to your boss why two women cannot have a baby in four-and-a-half months; if he/she still doesn't get it then probably best to look for another job)

### Videos
- [Coding With John](https://www.youtube.com/@CodingWithJohn)
- [Core Java Course](https://www.youtube.com/watch?v=bm0OyhwFDuY&list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5)
- [Google's Introduction to Data Structures  Algorithms](https://techdevguide.withgoogle.com/paths/data-structures-and-algorithms/)

### Core Java
- Primitive datatypes: byte, short, int, long, float, double, boolean, char
- Reference datatypes - https://www.javatpoint.com/reference-data-types-in-java
- Interview question: what's happens if you do System.out.println(Integer.MAX_VALUE + 1 ) ?
- Static vs non-static methods and variables - https://www.youtube.com/watch?v=-Y67pdWHr9Y
- Casting: Upcasting vs Downcasting - https://medium.com/@salvipriya97/rules-for-casting-an-object-in-java-dc61580008cb 
- Arithmetic operators (e.g +, -. %)
- The modulo operator (%) = https://www.baeldung.com/modulo-java
- Conversions and promotions and autoboxing - https://docs.oracle.com/javase/specs/jls/se7/html/jls-5.html 
- Logical operators, short-circuiting - https://www.tutorialsfreak.com/java-tutorial/java-logical-operators
- Incrementing and decrementing: i++ vs ++i; https://www.dummies.com/article/technology/programming-web-design/java/increment-and-decrement-operators-in-java-172144/
- Addition assignment operator = https://www.digitalocean.com/community/tutorials/addition-assignment-operator-in-java
- Flow control: while and for loops; switch statements; if/else vs ternary operator => can't return from an if
- Java 17: [Sealed classes and switch statements](https://medium.com/@oskarv/java-17-features-pattern-matching-for-switch-and-sealed-classes-f631bdd56f12)
- Constants vs enums - https://www.baeldung.com/cs/enums-vs-constants
- Java enums - https://www.baeldung.com/java-enum-values
- Exceptions: Unchecked/Runtime vs Checked Exceptions - https://rollbar.com/blog/how-to-handle-checked-unchecked-exceptions-in-java
- Exception Handling Basics: try, catch, finally - https://www.baeldung.com/java-exceptions
- Java exception propagation and the call stack - https://medium.com/@satyendra.jaiswal/demystifying-java-exception-propagation-a-journey-up-the-call-stack-0abfb628682a 
- Exceptions and try/catch vs try-with-resources - https://medium.com/geekculture/how-does-exception-handling-work-in-java-c71c45103e7d

### JVM Basics
- How the JVM works - https://hasithas.medium.com/understanding-how-java-virtual-machine-jvm-works-a1b07c0c399a
- Structure of the JVM - https://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html
- JVM vs JRE - https://www.educative.io/answers/what-is-the-difference-between-jvm-and-jre
- Classloading - https://www.baeldung.com/java-classloaders
- The heap vs the stack - https://www.baeldung.com/cs/memory-stack-vs-heap
- Interview question: "Memory leaks: how they occur and how to detect?"
- Garbage collection - algorithms (eg. CMS vs G1 vs Z) - https://www.baeldung.com/jvm-garbage-collectors
- Java Memory Model - https://jenkov.com/tutorials/java-concurrency/java-memory-model.html


### Java OO Basics
- OO Buzzwords:  Inheritance, Encapsulation, Abstraction and Polymorphism - https://www.nerd.vision/post/polymorphism-encapsulation-data-abstraction-and-inheritance-in-object-oriented-programming
- Interview question: what are benefits of encapsulation?
- Packages and visibility: public, package, protected vs private? (Why not make everything public??)
- What is the role of java.lang.Object?
- Constructors; multiple constructors, private constructors, no args/implicit constructors vs required args constructors
- Instances, keyword new and object references - https://java-programming.mooc.fi/part-5/4-objects-and-references
- Keyword final - consequences of immutability, record keyword in Java 17 - read Pat Helland's "Immutability Changes Everything" https://queue.acm.org/detail.cfm?id=2884038
- Interview question: why should you use final instance fields?
- Static initialisation blocks - https://blogs.oracle.com/javamagazine/post/java-instance-initializer-bloc
- Keyword null, nullability and Tony Hoare's Billion Dollar Mistake - https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/
- Lombok's @NonNull
- Objects.nonNull() vs != null
- Interfaces and the concept of "Duck typing" - https://www.geeksforgeeks.org/interfaces-and-polymorphism-in-java/
- What's a marker interface? (Examples: Serializable, Cloneable etc)
- Does Java have multiple inheritance? If not then why not? Can we get around this?
- Method overriding vs method overloading: what's the difference? @Overloaded annotation - https://www.baeldung.com/java-method-overload-override
- Type Safety vs Casting. Why is casting evil? What's type safety?
- Structural equality (equals()) vs reference equality (==)
- Interview question: what's the relationship between equals and hashcode()? - https://www.baeldung.com/java-equals-hashcode-contracts
- Interview question: what would be the consequence of just returning a constant (say 11) as the implementation of your hashcode() method?
- Mutators (setter methods) and accessors (getter methods)
- Objects vs the java bean spec - https://medium.com/@mgm06bm/understanding-java-beans-a-comprehensive-guide-for-beginners-684163011c82
- Strings in java: string pooling - why are strings immutable?" - https://www.youtube.com/watch?v=Bj9Mx_Lx3q4
- String concatentation: + vs StringBuilder vs StringBuffer?
- Interview question: "What's longest string you can hava in Java? https://www.baeldung.com/java-strings-maximum-length
- Unicode and charsets (ASCII vs UTF-8 vs UTF-16) - https://w3developers.medium.com/unicode-is-javas-native-character-set-249fdc1c39c3#:~:text=Unicode%20is%20Java's%20native%20character,scripts%20of%20Chinese%20and%20Japanese.
- Equals & Hashcode => shallow vs deep equality
- The finalise method
- The clone method and Java.lang.Cloneable
- Thread basics: wait/notify/notifyAll
- Java's floating point rounding problem https://arshadsuraj.medium.com/java-floating-point-numbers-rounding-problem-solution-a07e019b9dd5
- Double precision issue - https://www.baeldung.com/java-double-precision-issue
- Financial/scientific calculations - Big decimal vs double - https://www.baeldung.com/java-double-vs-bigdecimal 


### Data Structures
- Arrays & memory structure - https://medium.com/@f2015939p/array-memory-allocation-in-java-49b292122d18
- More on arrays in Java: Arrays.sort(), System.arraycopy(), Arrays.copyOf() and Arrays.copyOfRange()
- Multidimensional arrays - https://www.geeksforgeeks.org/multidimensional-arrays-in-java/
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
- How does a HashMap work? Hashing and collisions - what makes a good hashing algorithm? Bucketing... implementing a histogram via a HashMap?
- Concurrent collections: ConcurrentHashMap, CopyOnWriteArraySet, CopyOnWriteArrayList. ConcurrentSkipListSet, CopyOnWriteArraySet
- Collections.synchronizedMap vs. ConcurrentHashMap: https://www.baeldung.com/java-synchronizedmap-vs-concurrenthashmap
- ConcurrentHashMap Under The Hood - Region Locking: https://anmolsehgal.medium.com/concurrenthashmap-internal-working-in-java-b2a1a48c7289

### Generics
- What is type safety? https://www.baeldung.com/cs/type-safety-programming
- Type safety vs strong typing - https://dev.to/ayodejii/type-safety-and-strong-typing-what-are-these-terms-3io5
- Basics - https://www.baeldung.com/java-generics
- Type erasure: why you can't get type information at runtime - https://docs.oracle.com/javase/tutorial/java/generics/erasure.html
- Reified functions (Kotlin has them but Java doesn't which is a bummer) https://www.baeldung.com/kotlin/reified-functions
- Syntactic sugar (J1.7): The Diamond Operator - https://www.baeldung.com/java-diamond-operator

### Streams & Java Embraces (Some) Functional Programming
- Functional vs imperative styles
- What is FP? https://www.infoworld.com/article/3613715/what-is-functional-programming-a-practical-guide.html
- How is a stream different a collection?
- Parallel streams - https://www.baeldung.com/java-when-to-use-parallel-stream
- Lambda expressions - https://www.baeldung.com/java-8-lambda-expressions-tips and https://www.youtube.com/watch?v=tj5sLSFjVj4
- Functional interfaces - SAM (Single Abstract Method)  - https://dzone.com/articles/java-8-functional-interfaces-sam
- Stream terminal operations - https://www.codejava.net/java-core/collections/java-8-stream-terminal-operations-examples
- Functional programming (Consumer, Predicate, Supplier, and Function) - https://medium.com/javarevisited/java-8s-consumer-predicate-supplier-and-function-bbc609a29ff9
- Lambda limitations - https://dzone.com/articles/java-8-lambas-limitations-closures
- Are Java lambdas closures? - https://www.bruceeckel.com/2015/10/17/are-java-8-lambdas-closures/#:~:text=It%20turns%20out%20that%2C%20in,them%20that%20way%20or%20not.

### Algorithms, Space/Time complexity & Big-O Notation
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

### Concurrency
- Moore's Law and How Processors Went Multicore - https://medium.com/@arnabkar2003/why-multi-core-processing-is-the-future-ae7cba792f0b
- Multithreading, Java 5 (2004) and the rise of multicore processors - https://medium.com/@med.ali.bennour/enhancing-java-concurrency-processor-core-threads-fibers-0cac6000e5fb#:~:text=Efficient%20Resource%20Utilization%3A%20By%20leveraging,scientific%20computations%2C%20and%20server%20applications.
- Java 1/1.1 & Basic Concurrency Concepts: threads, wait/notify - https://www.baeldung.com/java-wait-notify
- Introduction to multithreading in Java - https://www.digitalocean.com/community/tutorials/multithreading-in-java
- The role of keyword volatile and the happens-before guarantee - https://www.baeldung.com/java-volatile
- The synchronized keyword  - https://www.baeldung.com/java-synchronized and https://jenkov.com/tutorials/java-concurrency/synchronized.html
- Why is static synchronized so dangerous? - https://www.baeldung.com/java-synchronization-bad-practices
- Deadlocks, livelock and starvation - https://www.baeldung.com/cs/deadlock-livelock-starvation
- ThreadLocal API: Storing data accessible only by a specific thread - https://www.baeldung.com/java-threadlocal
- Defining a thread-based task: Difference between callable vs Runnable - https://www.baeldung.com/java-runnable-callable
- Concurrent collections: ConcurrentHashMap, CopyOnWriteArraySet, CopyOnWriteArrayList. ConcurrentSkipListSet, CopyOnWriteArraySet
- Collections.synchronizedMap vs. ConcurrentHashMap: https://www.baeldung.com/java-synchronizedmap-vs-concurrenthashmap
- ConcurrentHashMap Under The Hood - Region Locking: https://anmolsehgal.medium.com/concurrenthashmap-internal-working-in-java-b2a1a48c7289
- Java 5's improved locking abstractions: ReentrantLock and Semaphore - https://www.baeldung.com/java-binary-semaphore-vs-reentrant-lock
- Out-of-the-box abstractions for multithreading/parallel processing: ExecutorService - https://www.baeldung.com/java-executor-service-tutorial
- Future and CompletableFuture - https://www.baeldung.com/java-future-completablefuture-rxjavas-observable
- What is the danger of calling get() to get the value of a Future?
- Thread pool models - https://www.baeldung.com/thread-pool-java-and-guava
- Virtual threads in java: https://www.infoworld.com/article/3678148/intro-to-virtual-threads-a-new-approach-to-java-concurrency.html
- Introduction to Atomic Variables - the solution to check-and-set problem https://www.baeldung.com/java-atomic-variables
- Keyword volatile vs atomic variables - https://www.baeldung.com/java-volatile-vs-atomic
