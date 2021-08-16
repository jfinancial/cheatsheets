## Spring Webflux (based on Project Reactor)


#### Building Reactive Microservices

- Spring Webflux is used to build reactive java webapps and was born out of Spring's adoption of the [Reactor Project](https://projectreactor.io/) as an implementation of Reactive Streams
- Webflux and reactive libraries can be used for building reactive microservices which are asynchronous and non-blocking so higher throughput can be achieved. This can be demonstrated using [Apache AB](http://httpd.apache.org/docs/2.4/programs/ab.html) which is a server benchmarking tool 
- The [Reactive Manifesto](https://www.reactivemanifesto.org/) defines 4 pillars: 
   - **Responsive** => returns in a timely manner and does work lazily (i.e only when required) and when user closes browser then work stops
   - **Resilient** => can handle failure; the whole system doesn't fail due to one individual failure and instead it stays responsive
   - **Elastic** => remains responsive despite the workload so the system should not have any bottlenecks so the system should use resources efficiently and be horizontally scalable
   - **Message-Driven** => components talk in an asynchronous manner by passing messages and use [backpressure](https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7) to handle emission rates
 

#### Traditional Servlet Containers vs Netty

- Traditional servlet engines such as Tomcat use a a single thread per request model. This is costly so even with a high thread pool the server can easily meet maximum throughput. (More explanation [here](https://dzone.com/articles/spring-webflux-eventloop-vs-thread-per-request-mod).)
- Netty uses a different [thread model](http://tutorials.jenkov.com/netty/overview.html) based on EventLoopGroup in which there is a Boss thread and Worker threads and the worker threads are continuously running but never blocked, therefore, we want to avoid blocking operations wherever possible

#### Quick Refresher On `@ControllerAdvice`
- The proper way to handle exceptions from a `@RestController` is to use Spring's `@ControllerAdvice` to handle specific exceptions and return a `ResponseEntity` with the appropriate HTTP error code (e.g 500:
````java
@ControllerAdvice
public class InputValidationHandler {

    @ExceptionHandler(InputValidationException.class)
    public ResponseEntity<InputFailedValidationResponse> handleException(InputValidationException ex){
        InputFailedValidationResponse response = new InputFailedValidationResponse();
        response.setErrorCode(ex.getErrorCode());
        response.setInput(ex.getInput());
        response.setMessage(ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

}
````

#### Reactive Services
- A Reactive service method returns a `Mono` for a single item or `FLux` for multiple items

```java
@Service
public class ReactiveMathService {

    public Mono<Response> findSquare(int input){
        return Mono.fromSupplier(() -> input * input).map(Response::new);
    }

    public Flux<Response> multiplicationTable(int input){
        return Flux.range(1, 10)
                    .delayElements(Duration.ofSeconds(1))
                    //.doOnNext(i -> SleepUtil.sleepSeconds(1))
                    .doOnNext(i -> System.out.println("reactive-math-service processing : " + i))
                    .map(i -> new Response(i * input));
    }

    public Mono<Response> multiply(Mono<MultiplyRequestDto> dtoMono){
        return dtoMono.map(dto -> dto.getFirst() * dto.getSecond())
                    .map(Response::new);
    }

}
```

#### Reactive Controller
- A class marked as a `@RequestController` can still be used to return Reactive types. Changing the MediaType to `TEXT_EVENT_STREAM_VALUE` means streaming is enable so this will be treated by the browser as a Reactive stream so the browser will consume elements from the stream as they are produced and if we quit the browser (i.e. the consumer cancels) then the server will stop producing elements
- If you do not have the MediaType set to stream then even though we are sending a Flux, all the results will be collected - in Spring this is done in the encode method of `AbstractJackson2Encoder` - so it will send a `Mono<List<Response>>`
- Note that in the Post mapping we actually take a reactive type in whereas for the path variable it has to remain a DTO. Using a reactive type as an input is useful where we have a huge request and we cant to consume it in a non-blocking manner
```java
@RestController
@RequestMapping("reactive-math")
public class ReactiveMathController {

  @Autowired
  private ReactiveMathService mathService;

  @GetMapping("square/{input}")
  public Mono<Response> findSquare(@PathVariable int input) {
    return this.mathService.findSquare(input);
  }

  @GetMapping("table/{input}")
  public Flux<Response> multiplicationTable(@PathVariable int input) {
    return this.mathService.multiplicationTable(input);
  }

  @GetMapping(value = "table/{input}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<Response> multiplicationTableStream(@PathVariable int input) {
    return this.mathService.multiplicationTable(input);
  }

  @PostMapping("multiply")
  public Mono<Response> multiply(@RequestBody Mono<MultiplyRequestDto> requestDtoMono, @RequestHeader Map<String, String> headers) {
    return this.mathService.multiply(requestDtoMono);
  }
}
```


#### Reactive Pipeline
- To make your code reactive you have to be *within* the reactive pipeline. The following code is not creative because the real work is done outside the pipeline:

```java
public class NonReactiveController {

  public List<Response> multiplicationTable(int input) {
    List<Int> list = IntStream.rangeClosed(1, 10)
            .peek(i -> SleepUtil.sleepSeconds(1))
            .peek(i -> System.out.println("math-service processing : " + i))
            .mapToObj(i -> new Response(i * input))
            .collect(Collectors.toList());
    return FLux.fromIterable(list);
  }
}

```

#### Emitting Errors Within The Reactive Pipeline
- We can emit an error within the using `the sink.error()
```java
@GetMapping("square/{input}/mono-error")
public class NonReactiveController {

  public Mono<Response> someError(@PathVariable int input) {
    return Mono.just(input)
            .handle((integer, sink) -> {
              if (integer >= 10 && integer <= 20)
                sink.next(integer);
              else
                sink.error(new InputValidationException(integer));
            })
            .cast(Integer.class)
            .flatMap(i -> this.mathService.findSquare(i));
  }
}
```
### Comparing Flux operations to RxJS

Here are the Flux equivalents to RxJS functions:


|    RxJs      |     Flux       | 
|--------------|----------------|
|  debounce    |   debounced    |
|  sampleFirst |  throttleFirst |
|  sample      |  throttleLast  |

----

#### Functional Endpoints
- Instead of using `@GetMapping` and `@PostMapping` we can create [Functional Endpoints](https://spring.getdocs.org/en-US/spring-framework-docs/docs/spring-web-reactive/webflux/webflux-fn.html) that are defined in DSL-style configuration. Note that you still can mix-and-match both approaches
- Not the difference between `body` and `bodyValue` methods:
  - `bodyValue()` takes the raw type 
  - `body()` take the publisher type (i.e. `Flux` or `Mono`)
- To hit the functional endpoint you go to the router url e.g. `http://localhost:8080/router/square/5`
- Note the use of `RequestPredicates` to map certain request parameters
```java
@Configuration
public class RouterConfig {

    @Autowired
    private RequestHandler requestHandler;

    @Bean
    public RouterFunction<ServerResponse> highLevelRouter(){
        return RouterFunctions.route()
                .path("router", this::serverResponseRouterFunction)
                .build();
    }
    
    private RouterFunction<ServerResponse> serverResponseRouterFunction(){
        return RouterFunctions.route()
                .GET("square/{input}", RequestPredicates.path("*/1?"), requestHandler::squareHandler)
                .GET("square/{input}", req -> ServerResponse.badRequest().bodyValue("only 10-19 allowed"))
                .GET("table/{input}", requestHandler::tableHandler)
                .GET("table/{input}/stream", requestHandler::tableStreamHandler)
                .POST("multiply", requestHandler::multiplyHandler)
                .GET("square/{input}/validation", requestHandler::squareHandlerWithValidation)
                .onError(InputValidationException.class, exceptionHandler())
                .build();
    }

    private BiFunction<Throwable, ServerRequest, Mono<ServerResponse>> exceptionHandler(){
        return (err, req) -> {
            InputValidationException ex = (InputValidationException) err;
            InputFailedValidationResponse response = new InputFailedValidationResponse();
            response.setInput(ex.getInput());
            response.setMessage(ex.getMessage());
            response.setErrorCode(ex.getErrorCode());
            return ServerResponse.badRequest().bodyValue(response);
        };
    }
    
}
```
- For the above we also need to implement a `ReqeustHandler`and to implement a reactive event stream then again we need to set the MediaType to `TEXT_EVENT_STREAM` as in the `tableStreamHandler` method below:
````java
@Service
public class RequestHandler {

    @Autowired
    private ReactiveMathService mathService;

    public Mono<ServerResponse> squareHandler(ServerRequest serverRequest){
        int input = Integer.parseInt(serverRequest.pathVariable("input"));
        Mono<Response> responseMono = this.mathService.findSquare(input);
        return ServerResponse.ok().body(responseMono, Response.class);
    }

    public Mono<ServerResponse> tableHandler(ServerRequest serverRequest){
        int input = Integer.parseInt(serverRequest.pathVariable("input"));
        Flux<Response> responseFlux = this.mathService.multiplicationTable(input);
        return ServerResponse.ok().body(responseFlux, Response.class);
    }

    public Mono<ServerResponse> tableStreamHandler(ServerRequest serverRequest){
        int input = Integer.parseInt(serverRequest.pathVariable("input"));
        Flux<Response> responseFlux = this.mathService.multiplicationTable(input);
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(responseFlux, Response.class);
    }

    public Mono<ServerResponse> multiplyHandler(ServerRequest serverRequest){
        Mono<MultiplyRequestDto> requestDtoMono = serverRequest.bodyToMono(MultiplyRequestDto.class);
        Mono<Response> responseMono = this.mathService.multiply(requestDtoMono);
        return ServerResponse.ok()
                .body(responseMono, Response.class);
    }
}
````

#### Functional Endpoint Error Handling
- Note how we can do **error handling** in the `RequestHandler` and this can still be handled by the `ControllerAdvice`:
````java
@Service
public class RequestHandler {

    @Autowired
    private ReactiveMathService mathService;

    public Mono<ServerResponse> squareHandlerWithValidation(ServerRequest serverRequest){
        int input = Integer.parseInt(serverRequest.pathVariable("input"));
        if(input < 10 || input > 20){
            return Mono.error(new InputValidationException(input));
        }
        Mono<Response> responseMono = this.mathService.findSquare(input);
        return ServerResponse.ok().body(responseMono, Response.class);
    }
}
````

----

### WebClient & Testing With StepVerifier

- WebClient replaces the RestTemplate as a reactive client for invoking rest services so that those calls are asynchronous and non-blocking. WebClient is threadsafe so it can be shared.
- `StepVerifier` is provided in [`reactor-test`](https://projectreactor.io/docs/test/release/api/) dependency:
- Here we are testing a service returning single item response returning as a `Mono` using GET:
````java
public class GetSingleResponseTest extends BaseTest {

    @Autowired
    private WebClient webClient;

    @Test
    public void blockTest(){
        Response response = this.webClient.get()
                .uri("reactive-math/square/{number}", 5)
                .retrieve()
                .bodyToMono(Response.class) // Mono<Response>
                .block();
        System.out.println(response);
    }

    @Test
    public void stepVerifierTest(){
        Mono<Response> responseMono = this.webClient.get()
                .uri("reactive-math/square/{number}", 5)
                .retrieve()
                .bodyToMono(Response.class); // Mono<Response>
        StepVerifier.create(responseMono)
                .expectNextMatches(r -> r.getOutput() == 25)
                .verifyComplete();
    }
}

````
- Here we test a service returning a `Flux` response type using GET:
```java
public class MultiResponseTest extends BaseTest {

    @Autowired
    private WebClient webClient;

    @Test
    public void fluxTest(){

        Flux<Response> responseFlux = this.webClient.get()
                .uri("reactive-math/table/{number}", 5)
                .retrieve()
                .bodyToFlux(Response.class)
                .doOnNext(System.out::println);

        StepVerifier.create(responseFlux)
                .expectNextCount(10)
                .verifyComplete();

    }

    @Test
    public void fluxStreamTest(){
        Flux<Response> responseFlux = this.webClient.get()
                .uri("reactive-math/table/{number}/stream", 5)
                .retrieve()
                .bodyToFlux(Response.class)
                .doOnNext(System.out::println);
        StepVerifier.create(responseFlux)
                .expectNextCount(100)
                .verifyComplete();

    }
```
- Here we do the same but testing a POST:
````java
public class PostRequestTest extends BaseTest {

    @Autowired
    private WebClient webClient;

    @Test
    public void postTest(){
        Mono<Response> responseMono = this.webClient.post()
                .uri("reactive-math/multiply")
                .bodyValue(buildRequestDto(5, 2))
                .retrieve()
                .bodyToMono(Response.class)
                .doOnNext(System.out::println);
        StepVerifier.create(responseMono)
                .expectNextCount(1)
                .verifyComplete();

    }

    private MultiplyRequestDto buildRequestDto(int a, int b){
        MultiplyRequestDto dto = new MultiplyRequestDto();
        dto.setFirst(a);
        dto.setSecond(b);
        return dto;
    }

}
````
#### Testing HTTP Headers

- We can also use WebClient to set headers:
````java
public class PostRequestWithHeadersTest extends BaseTest {

  @Autowired
  private WebClient webClient;

  @Test
  public void headersTest() {
    Mono<Response> responseMono = this.webClient.post()
            .uri("reactive-math/multiply")
            .bodyValue(buildRequestDto(5, 2))
            .headers(h -> h.set("someKey", "someVal"))
            .retrieve()
            .bodyToMono(Response.class)
            .doOnNext(System.out::println);
    StepVerifier.create(responseMono)
            .expectNextCount(1)
            .verifyComplete();
    StepVerifier.create(responseMono)
            .expectNextCount(1)
            .verifyComplete();

  }
}
````
#### Testing For BadRequests

- We can also test for bad requests:
````java
public class BadRequestTest extends BaseTest {

    @Autowired
    private WebClient webClient;

    @Test
    public void badRequestTest(){
        Mono<Response> responseMono = this.webClient.get()
                .uri("reactive-math/square/{number}/throw", 5)
                .retrieve()
                .bodyToMono(Response.class)
                .doOnNext(System.out::println)
                .doOnError(err -> System.out.println(err.getMessage()));
        StepVerifier.create(responseMono)
                .verifyError(WebClientResponseException.BadRequest.class);
    }

}
````
#### Using `exchage` for retrieveing more info forom the Response

- The `exchange` method is basically `retrieve` but also includes additional information such as status code:
```java
public class ExchangeTest extends BaseTest {

    @Autowired
    private WebClient webClient;

    @Test
    public void badRequestTest(){

        Mono<Object> responseMono = this.webClient.get()
                .uri("reactive-math/square/{number}/throw", 5)
                .exchangeToMono(this::exchange)
                .doOnNext(System.out::println)
                .doOnError(err -> System.out.println(err.getMessage()));
        StepVerifier.create(responseMono)
                .expectNextCount(1)
                .verifyComplete();
    }

    private Mono<Object> exchange(ClientResponse cr){
        if(cr.rawStatusCode() == 400)
            return cr.bodyToMono(InputFailedValidationResponse.class);
        else
            return cr.bodyToMono(Response.class);
    }

}
```
#### Sending Query Prams
- We can pass query params in the WebClient using the `UriComponentsBuiler` such as:
```java
    UriComponentsBuiler.fromString("http://localhost:8080/search?count={count}&page=${page})
        .build(10,20)
```
Or we can use `UriBuilder` and pass it to the `uri` method:
```java
public class QueryParamsTest extends BaseTest {

  @Autowired
  private WebClient webClient;

  String queryString = "http://localhost:8080/jobs/search?count={count}&page={page}";

  @Test
  public void queryParamsTest() {
    Map<String, Integer> map = Map.of("count", 10, "page", 20);
    Flux<Integer> integerFlux = this.webClient
            .get()
            .uri(b -> b.path("jobs/search").query("count={count}&page={page}").build(map))
            .retrieve()
            .bodyToFlux(Integer.class)
            .doOnNext(System.out::println);
    StepVerifier.create(integerFlux)
            .expectNextCount(2)
            .verifyComplete();
  }
}

```

#### Passing Auth Tokens via Basic Auth or OAuth (using Attributes)
- We can pass auth tokens such as JWT by creating a new Request from the original request and adding headers
```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8080")
                .filter(this::sessionToken)
                .build();
    }

    private Mono<ClientResponse> sessionToken(ClientRequest request, ExchangeFunction ex){
        //Here we check the attribute: auth --> basic or oauth
        ClientRequest clientRequest = request.attribute("auth") 
                .map(v -> v.equals("basic") ? withBasicAuth(request) : withOAuth(request))
                .orElse(request);
        return ex.exchange(clientRequest);
    }

    private ClientRequest withBasicAuth(ClientRequest request){
        return ClientRequest.from(request)
                    .headers(h -> h.setBasicAuth("username", "password"))
                    .build();
    }

    private ClientRequest withOAuth(ClientRequest request){
        return ClientRequest.from(request)
                .headers(h -> h.setBearerAuth("some-token"))
                .build();
    }
}

```
---- 

### Server Side Events (SSE)
- Server Side Events (SSE) allow updates to be sent to the browser/front-end and are similar to websocket except that websocket allows for 2-way communication whereas SSE is one way
- We implement this using Project Reactor [`Sink`](https://projectreactor.io/docs/core/release/reference/#processors) which acts like a subscriber and a publisher so mulitple threads can both publish and consume to the sink - when using sinks use `many()` for emitting many updates and `one()` for single updates. You can also use `limit()` when emitting multiple times
- We define the `Sink` and the broadcast `Flux` from the sink in some configuration 
```java
@Configuration
public class SinkConfig {

    @Bean
    public Sinks.Many<ProductDto> sink(){
        //replay will replay items to late subscribers
        return Sinks.many().replay().limit(1);
    }

    @Bean
    public Flux<ProductDto> productBroadcast(Sinks.Many<ProductDto> sink){
        return sink.asFlux();
    }

}
```
- We can now create a stream controller which takes the `FLux` from the sink we already configured:
```java
@RestController
@RequestMapping("product")
public class ProductStreamController {

    @Autowired
    private Flux<ProductDto> flux;

    @GetMapping(value = "stream/{maxPrice}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ProductDto> getProductUpdates(@PathVariable int maxPrice){
        return this.flux
                    .filter(dto -> dto.getPrice() <= maxPrice);
    }

}
```
- We now implement a `ProductService` which allows updates and therefore takes the `Sink`and we send the update to think using `doOnNext(this.sink::tryEmitNext)`:
```java
@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private Sinks.Many<ProductDto> sink;

    public Flux<ProductDto> getAll(){
        return this.repository.findAll()
                    .map(EntityDtoUtil::toDto);
    }

    public Flux<ProductDto> getProductByPriceRange(int min, int max){
        return this.repository.findByPriceBetween(Range.closed(min, max))
                .map(EntityDtoUtil::toDto);
    }

    public Mono<ProductDto> getProductById(String id){
        return this.repository.findById(id)
                             .map(EntityDtoUtil::toDto);
    }

    public Mono<ProductDto> insertProduct(Mono<ProductDto> productDtoMono){
        return productDtoMono
                .map(EntityDtoUtil::toEntity)
                .flatMap(this.repository::insert)
                .map(EntityDtoUtil::toDto)
                .doOnNext(this.sink::tryEmitNext);  //emit to sink here
    }

    public Mono<ProductDto> updateProduct(String id, Mono<ProductDto> productDtoMono){
       return this.repository.findById(id)
                            .flatMap(p -> productDtoMono
                                            .map(EntityDtoUtil::toEntity)
                                            .doOnNext(e -> e.setId(id)))
                            .flatMap(this.repository::save)
                            .map(EntityDtoUtil::toDto);
    }

    public Mono<Void> deleteProduct(String id){
        return this.repository.deleteById(id);
    }

}
```
### Reactvive Mongo Repository
- MongoDB can be used for reactive service and has a reactive library with `ReactiveMongoRepository`
```java
@Repository
public interface ProductRepository extends ReactiveMongoRepository<Product, String> {
    Flux<Product> findByPriceBetween(Range<Integer> range);
}

```
### R2DBC - Reactive DB libraries
- There are also reactive database drivers which implement the [R2DBC](https://r2dbc.io/) spec
- Using the R2DBC driver for our DB we can use the standard `JpaRepository`
```java
@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    List<PurchaseOrder> findByUserId(int userId);

}
```
- We can then create a flux from a stream created from the List returned by the repository
```java
@Service
public class OrderQueryService {

    @Autowired
    private PurchaseOrderRepository orderRepository;

    public Flux<PurchaseOrderResponseDto> getProductsByUserId(int userId){
        return Flux.fromStream(() -> this.orderRepository.findByUserId(userId).stream()) // blocking
                .map(EntityDtoUtil::getPurchaseOrderResponseDto)
                .subscribeOn(Schedulers.boundedElastic());
    }

}
```
