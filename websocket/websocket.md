

See https://github.com/caligula95/spring-websocket-chat/blob/master/frontend/js/chat.js
and https://www.youtube.com/watch?v=-ao3pX-UhQc

1. Import relevant dependencies - if you are not intending to use Tomcat then exclude it

```xml
        <dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-messaging</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-websocket</artifactId>
			<exclusions>
				<exclusion>
					<groupId>org.springframework.boot</groupId>
					<artifactId>spring-boot-starter-tomcat</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
```

2. Introduce websocket configuration implementing `WebSocketMessageBrokerConfigurer` and setting up AllowedOrigins for CORS:

```kotlin
@Configuration
@EnableWebSocketMessageBroker
class WebSocketMessageBrokerConfig(val properties: WebSocketProperties) : WebSocketMessageBrokerConfigurer {

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        logger().info("Websocket topic prefix: ${properties.topicPrefix}")
        logger().info("Websocket application prefix: "+properties.applicationPrefix)
        registry.enableSimpleBroker(properties.topicPrefix)
        registry.setApplicationDestinationPrefixes(properties.applicationPrefix)
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        logger().info("Websocket endpoint = ${properties.endpoint}")
        logger().info("Websocket allowedOrigins = ${ properties.allowedOrigins.toList().joinToString()}")
        registry.addEndpoint(properties.endpoint).setAllowedOriginPatterns(*properties.allowedOrigins).withSockJS()
    }

}
```
We can also externalise the configuration using `@ConfigurationProperties`
```kotlin
@Component
@ConfigurationProperties(prefix = "app.websocket")
data class WebSocketProperties (
    /**
     * Prefix used for WebSocket destination mappings
     */
    var applicationPrefix: String = "/topic",

    /**
     * Prefix used by topics
     */
    var topicPrefix: String  = "/topic",

    /**
     * Endpoint that can be used to connect to
     */
    var endpoint: String  = "/live",

    /**
     * Allowed origins
     */
    var allowedOrigins: Array<String> = emptyArray()
)

```

2. Create a controller 
