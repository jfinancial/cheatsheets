## Kafka Interview Questions

Q: What is maximum size for a message received?
- Default maximum is 1MB but can be changed in broker settings. Kafka optimized to handle messages of around 1KB or smaller

Q: What is "retention period" ?
- Messages sent to Kafka clusters get appended to one of the multiple partition logs and multiple partition logs even after being consumed, for a configurable period of time, or until a configurable size is reached. This configurable amount of time for which the message remains in the log is known as the **retention period**. The message will be available for the amount of time specified by the retention period which can be configured on a per-topic basis. The default is 7 days.

Q: What is the role of the Partitioning Key?
- Messages are sent to partitions associated with a topic using round-robin  If there is a requirement to send a message to a particular partition, then can use partition key instead which determines which partition that particular message will go to. All messages with the same key will go to the same partition. If a key is not specified for a message then producer will round-robin.

Q: When does QueueFullException occur?
- Producer sends messages to the broker faster than can be handled. A solution here is to add more brokers to handle the pace of messages coming in from the producer.

Q: Explain leader and follower
- Every partition in the Kafka server has one server that plays the role of a leader. The leader performs all the read and write data tasks for a partition. A partition can have no followers, one follower, or more than one follower. The job of the follower is to replicate the leader. If there is a failure in the leader, then one of the followers can take on the leader's load.

Q: What are replicas?
- Replicas are the backups for partitions in Kafka. They are never actually read or written; rather but are used to prevent data loss in case of failure. The partitions of a topic are published to several servers in an Apache cluster. There is one Kafka server that is considered to be the leader for that partition. The leader handles all reads and writes for a particular partition. There can be none or more followers in the cluster, where the partitions of the topics get replicated. In the event of a failure in the leader, the data is not lost because of the presence of replicas in other servers. In addition, one of the followers will take on the role of the new leader.

Q: What is the purpose of ISR in Apache Kafka?
- ISR (in-synch replica) refers to all replicated partitions that are completely synced up with the leader. A replica must be fully caught up with the leader within a configurable amount of time. Default is 10 seconds. After this, if a follower is not caught up with the leader, the leader will drop the follower from its ISR and writes will continue on the remaining replicas in the ISR. If follower comes back, it will first truncate its log to the last point, which was checked, and then catch up on all the messages after the last checkpoint from the leader. Only when the follower fully catches up will the leader add it back to the ISR.

Q: What is meant by partition offset in Apache Kafka?
- Every time message/record is assigned to a partition in Kafka, it is provided with an offset which denotes the position of the record in partition. A record can be uniquely identified within a partition using theis offset. The partition offset only carries meaning within that particular partition. Records are always added to the ends of partitions, and therefore, older records will have a lower offset.

Q: Explain fault tolerance in Apache Kafka
- In Kafka, partition data is copied to other brokers, which are known as replicas. If there's a point of failure in partition data in one node, then other nodes that will provide a backup and ensure that the data is still available. Replication provides fault tolerance by ensuring published messages are not permanently lost. Even if a node fails and they are lost on one node  then there is a replica present on another node that can be recovered.

Q: Explain topic replication factor
- Topic replication factor is the number of copies of the topic that are present over multiple brokers. Replication factor should be >1 for fault tolerance. In such cases, there'll' be a replica of data in another broker from where the data can be retrieved.

Q:  Differentiate between partitions and replicas in a Kafka cluster
- In Kafka, topics are divided into partitions. Partitions allow one or more consumers to read data from servers in parallel. Read and write responsibility for a particular partition is managed on one server by the leader for that partition. A cluster may have zero or more followers in which replicas of the data will be created. (Replicas are copies of the data in a particular partition.) Followers do not have to read or write the partitions separately; they just copy the leader.

Q: What is the role of **consumer groups** in Kafka?
- A consumer group is a set of consumers that work together to consume messages from one or more Kafka topics. *Each message in a topic is processed by only one consumer within a consumer group, ensuring parallel processing a load-balancing.* Consumer-groups help achieve fault tolerance and scalability allowing multiple consumers to work together to process messages and ensuring that if one consumer fails then another can take over processing. This enables high availability and reliability in message consumption. You can add more consumers to a group to increase processing capacity (achieving horizontal scalability) but although you can add more consumers than partitions in a consumer group then in this case at least one of the consumers will be inactive. Consumer groups require unique group ids and each consumer group member maintains its own offset which represents the last consumed message in a partition (so consumers can continue where they left off in the event of failures or rebalancing.)

Q: Disadvantages of Apache Kafka.
- (1) Tweaking of messages in Kafka causes performance issues in Kafka. Kafka works well in cases where the message does not need to be changed; (2) no wildcard topic support; (3) suboptimal for large message size -  brokers and consumers reduce the performance of Kafka by compressing and decompressing the messages; (4) no point-to-point or client-request/reply

Q: What does Apache Kafka use to connect to client and services?
- Kafka uses a basic, high-performance language-agnostic TCP protocol. It's backwards compatible

Q: What is Kafka Streams API and Connector API?
- **Streams API** enables an application to work as a stream processor by efficiently changing input streams into output streams amd responsible for receiving input streams from one or more topics and sending output streams to one or more output topics
- **Connector API** Connects Kapfka topics to applications. The connector API enables the execution and building of reusable producers or consumers that link Kafka topics to pre-existing applications or data systems

Q: How do you tune Kafka?
- **Tuning Producers**: Data that the producers have to send to brokers is stored in a batch. When the batch is ready, the producer sends it to the broker. For latency and throughput, to tune the producers, two parameters must be taken care of: `batch size` and `linger time`. Batch size must be selected very carefully. If  producer is sending messages all the time, a larger batch size is preferable to maximize throughput. But if the batch size is very large, then it may never get full or take a long time to fill up and, in turn, affect the latency. (So batch size must take account of volume of messages and required latency.) The linger time creates a delay to wait for more records to fill the batch so larger records are sent. A longer linger time allows more messages to be sent in one batch, but could compromise latency. A shorter linger time will result in fewer messages getting sent faster - reduced latency but reduced throughput as well.
- **Tuning Brokers**: Each partition in a topic is associated with a leader, which will further have 0 or more followers. It is important that the leaders are balanced properly and ensure that some nodes are not overworked compared to others.
- **Tuning Kafka Consumers**: It is recommended that number of partitions for a topic is equal to number of consumers so that  consumers can keep up with the producers. In the same consumer group, the partitions are split up among the consumers.

Q: What is the optimal number of partitions for a topic?
- The optimal number of partitions a topic should be divided into must be equal to the number of consumers.

Q: Explain the scalability of Apache Kafka.
- In Kafka, the messages corresponding to a particular topic are divided into partitions. This allows the topic size to be scaled beyond the size that will fit on a single server. Allowing a topic to be divided into partitions ensures that Kafka can guarantee load balancing over multiple consumer processes. In addition, consumer groups also contributes to making it more scalable. In a consumer group, a particular partition is consumed by only one consumer in the group. This aids in the parallelism of consuming multiple messages on a topic.

Q: Can a consumer read more than one partition from a topic?
Yes, if the number of partitions is greater than the number of consumers in a consumer group, then a consumer will have to read more than one partition from a topic.

Q: Can Apache Kafka be considered to be a distributed streaming platform?
- Yes. A streaming platform can be called such if it has the following three capabilities:
    1. Be able to publish and subscribe to streams of data.
    2. Provide services similar to that of a message queue or scalable enterprise messaging system.
    3. Store streams of records in a durable and fault-tolerant manner.
    4. Since Kafka meets all three of these requirements, it can be considered to be a streaming platform.

Q: What is consumer lag in Apache Kafka?
- Consumer lag refers to the lag between the Kafka producers and consumers. Consumer groups will have a lag if the data production rate far exceeds the rate at which the data is getting consumed. Consumer lag is the difference between the latest offset and the consumer offset.

Q: What guarantees does Kafka provide?
- Consumers can see the messages in the same sequence in which the producers published them. The messaging order is preserved.
- The replication factor determines the number of replicas. If the replication factor is n, then there is a fault tolerance for up to n-1 servers in the Kafka cluster.
- Kafka can guarantee **“at least one”** delivery semantics per partition. This means that for multiple attempts at delivering a partition, Kafka guarantees that it will be delivered to a consumer at least once.

Q: How can a cluster be expanded in Kafka?
- In order to add a server to a Kafka cluster, it just has to be assigned a unique broker id, and Kafka has to be started on this new server. A new server will not automatically be assigned any of the data partitions until a new topic is created so when a new machine is added to the cluster, it becomes necessary to migrate some existing data to these machines. The partition reassignment tool can be used to move some partitions to the new broker. Kafka will add the new server as a follower of the partition that it is migrating to and allow it to completely replicate the data on that particular partition. When this data is fully replicated, the new server can join the ISR; one of the existing replicas will delete the data that it has with respect to that particular partition.

Q: What are three types of Kafka Producer in the Producer API?
- Fire and Forget
- Synchronous producer
- Asynchronous producer

Q: Kafka and Java - What are various acknowledgement settings?
- A broker sends an ack or acknowledgment to the producer to verify the reception of the message. Ack level is a configuration parameter in the Producer that specifies how many acknowledgments the producer must receive from the leader before a request is considered successful. The following types of acknowledgment are available:
    - `acks=0` = the producer does not wait for the broker's acknowledgment. There is no way to know if the broker has received the record.
    - `acks=1` = the leader logs the record to its local log file and answers without waiting for all of its followers to acknowledge it. The message can only be lost in this instance if the leader fails shortly after accepting the record but before the followers have copied it; otherwise, the record would be lost.
    -  `acks=all` = leader in this situation waits for all in-sync replica sets to acknowledge the record. As long as one replica is alive, the record will not be lost, and the best possible guarantee will be provided. However, because a leader must wait for all followers to acknowledge before replying, the throughput is significantly lower.

  Q: How to perform in a FIFO manner?
    - Kafka organizes messages into topics, which are divided into partitions. A partition is an immutable list of ordered messages that is updated regularly. A message in the partition is uniquely recognized by the offset. FIFO behavior is possible only within the partitions. Following the methods below will help you achieve FIFO behavior:
    - Set `enable.auto.commit=false`
    - Don't call the `consumer.commitSync()` method after the messages have been processed.
    - Subscribe to the topic
    - Use Listener consumerRebalance and call a consumer inside a listener.
    - `seek(topicPartition, offset)` =  offset related to the message should be kept together with the processed message once it has been processed

Q: How is it possible for a Kafka producer to retain exactly one semantics?
- Kafka transactions assist Kafka brokers and clients in achieving precisely one semantics. You must specify the properties `enable.idempotence=true` and `transactional.id=<some unique id>` at the producer end. In order to prepare the producer for transactions, you must also call `initTransaction`. If the producer (identified by producer id>) delivers the same message to Kafka more than once with these properties set, the Kafka broker identifies and de-dupes it.

Q: Can a Kafka Consumer group have more than one consumer?
- Yes, a Kafka consumer group consists of one or more consumers. The additional Kafka consumers in the group become inactive if the number of consumers in the specific consumer group exceeds the number of partitions. So, you must always ensure that a Kafka consumer group consists of the optimum number of Kafka consumers

Q: What does it indicate if a replica stays out of ISR for a long time?
- A replica staying out of ISR for a long time indicates that the follower cannot fetch data at the same rate as data accumulated by the leader.

Q:  Describe how you can acquire precisely one messaging from Kafka during the data production process.
- To acquire exactly one messaging from Kafka during data production, you must prevent duplication both during data production and data consumption. Below are the two methods for obtaining a single semantic during data production:
    - Provide one writer per partition, and whenever a network error occurs, review the most recent message in that partition to determine if your latest write was successful.
    - Include a primary key (a UUID or similar identifier) in the message and de-duplicate it for the recipient.









