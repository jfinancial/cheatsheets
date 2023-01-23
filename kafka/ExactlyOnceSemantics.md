### Kafka Delivery Semantics

Kafka supports three types of Message Delivery Guarantees.

- **At-most once**: Every message is persisted in Kafka at-most-once. Message loss is possible if the producer doesn’t retry on failures.
- **At-least-once**: Every message is guaranteed to be persisted in Kafka at-least-once. There is no chance of message loss but the message can be duplicated if the producer retries when the message is already persisted.
- **Exactly-once**: Every message is guaranteed to be persisted in Kafka exactly once without any duplicates and data loss even where there is a broker failure or producer retry.

#### Exactly-Once Processing

There are two possible behaviors of Exactly-Once Processing in Kafka.

- **Idempotent Guarantee**: This restricts Exactly-Once Processing on a single Topic-Partition and within a single producer session. Exactly-Once Processing is not guaranteed when the producer is restarted.
- **Transactional Guarantee**: This ensures Exactly-Once processing on multiple Topic-Partitions and also supports Exactly-Once Processing across multiple p


#### Terminologies

- **Producer ID (PID)**: A Unique Identifier assigned to the producer by the broker that is not exposed to users but is passed on every request to the broker.
  
  - If `transactional.id` is not specified, a fresh PID is generated every-time on producer initialization.
  - If `transactional.id` is specified,the broker stores mapping of Transactional ID to PID so that it can return the same PID on producer restart.


- **Transactional ID**: A Unique Client provided Identifier that is used to identify a producer across application restarts and hence guarantee Exactly-Once processing across multiple sessions. The broker stores a mapping of Transactional ID to PID so that it can identify the producer, given Transactional ID.


- **Epoch Number**: The epoch number is an integer that is used alongside PID to uniquely identify the latest active producer which is only relevant if `transactional.id` is set. PID along with Epoch number is used to ensure that there are no Split-brain scenarios and zombie producers are prevented from making progress.


- **Sequence Number**: To achieve Exactly-Once Processing, the producer maintains Sequence Number for every message per PID and Topic Partition combination. Sequence Number starts with 0 and monotonically increases for every message per PID and Topic Partition combination in the producer.  The broker also maintains the Sequence Number per PID and Topic Partition combination and rejects the request if it receives a message whose Sequence Number is not exactly one greater than what was stored in the broker.


- **Control Message** is a special type of marker message which is mainly used for internal communication between broker and clients and do not carry the actual message. The two types of Control Messages are `COMMIT` and `ABORT`.

