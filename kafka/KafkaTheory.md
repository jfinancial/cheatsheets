## Kafka Theory

- **Cluster** is a collection of brokers. For normal production use we'd have at least 3 brokers in the cluster.


- **Broker** has a numeric id. As a client, when you are connected to an individual broker you are connected to the cluster.


- Each broker is also **Bootstrap Broker** a bootstrap broker which allows you to connect to the cluster. The brokers hold metadata about all the other brokers topics, partitions etc. in the cluster in metadata.
 

- **Producers**  write records into Kafka that can be read by one or more consumers and can be [configured](https://kafka.apache.org/documentation/#producerconfigs)

  - `delivery.timeout.ms` – set producer's timeout (default is 2 mins after which delivery fails and has to be handled error callback.) If timeout is set very high Kafka will keep retrying but problem is that messages may then arrive out of key-based order
  -  `max.inflight.requests.per.connection` – if this is set to 1 then we guarantee ordering – default is 5 – if this is set to >1 then we should consider using an Idempotent Producer which is better solution to guaranteed ordering 


- **Consumers** consume via the subscribe(topics) and poll methods and consumers are part of consumer group. Behind the scenes, consumers talk to *ConsumerGroupCoordinators* to see if rebalancing is required and checks `session.timeout.ms` (if greater than this value then its considered dead; default value is 10000); there's also `heartbeat.interval.ms` to check consumer is still alive (default is 3 seconds and this should be 1/3 of timeout) - this part of [configuration](https://kafka.apache.org/documentation/#consumerconfig)

  -  `fetch.min.bytes` (controls how much data you want on each request – default value is 1 – improve throughput and cost of latency)
  -  `max.poll.records` (controls how many records per poll; increase if messages very small and lots of RAM – default is 500 [if you're always getting 500 you might want to increase this?]
  -  `max.partitions.fetch.bytes` – this is max data returned from broker per partition - default is 1MB so if you're reading from 100 partitions you'll need 100B
  -  `fetch.max.bytes` – maximum data for each request (covering multiple partitions)
  -  `enable.auto.commi`t – this is the default and commits of offset is done automatically and this should be used for synchronous processing of batches; if you want process async offsets could be committed before processed so it should be off and you should call commitSync() on the consumer (explicit commit e.g if you are writing to db then after committing to db then you call this)
  -  `auto.commit.interval.ms` – this is the interval for autocommit


- Use `BulkRequest` and `BulkResponsez` to improve performance. Add to records to the BulkRequest and commit offsets afterwards


- Sometimes we want to **reset the offsets** for the consumer (e.g. (if consumer was down longer than retention period then offsets might be invalid or consumer hasn't read in a long time – might also want to look at broker `offset.retention.minutes` on the broker)
  -  `auto.offset.earliest=latest` / `auto.offset.earliest=earliest` (set on consumer)


- **Producer Batch & Compression**: Producers batch messages to send over the wire to increase throughput. These can also be compressed to reduce producer request size (this is not switched on by default) – options are gzip (high compression but more CPU), snappy/lz4 (less compression but less CPU). As batch size gets bigger then compression becomes more effective.
  - `linger.ms` = 5ms (increase chance of messages being sent together in batch; increase throughput)
  - `batch.size` = this is the max size (so if size gets to this before linger); default is 16kb (can be increased to 32/64Kb to increase throughput; if single message is bigger than batch size then it won't be batched)
  If producer produces much faster than broker can take then buffer can fill up and the producer's send method will start to block before throwing exception
  - `max.block.ms=60000` (60 seconds)
  - `buffer.memory=33554432` (32MB)

- **Acks** (acknowledgements) are configured for producer
  - `acks=0` can lose data (broker fails) so use for logging metrics; most performant
  - `acks=1` only leader acknowledges; no guarantee of replication so possible loss
  - `acks=all` no data loss; ISRs acknowledge but at cost of performance (the replicas acknowledge to the leader so this increases latency but increases safety)


- **Records** that cannot be deleted or modify once they are sent to Kafka by a producer (this is known as “*distributed commit log*”)


- **Topics** are what records are published to (so think of topic like a db table). Producers will auto create to the topic if autocreate is on (`auto.create.topics.enable=true`)


- The **Offset** is an incrementing, immutable integer that is used by Kafka to maintain the current position of a consumer. Offsets only have meaning in a partition and ordering is only maintained per partition (not across partitions). Consumer offsets are held in a topic __consumer_offsets so if consumer dies then it knows where it left off. (Offsets used to be held in Zookeeper in early versions of Kafka but no longer)


- **Delivery Semantics** (for offsets): 
  - ***at most once*** = committed as soon as message is received by consumer, if processing fails then message can be lost (usually not preferred because commit happens too early) = *It's acceptable to lose a message rather than delivering a message twice* in this semantic
  - ***at least once*** = committed only after message is processed (usually preferred option and is Kafka's default); messages could be read again so can lead to duplicates hence consumer processing must be **idempotent** => *It's acceptable to receive message more than once but no message should be lost* (Applications adopting at least once semantics may have moderate throughput and moderate latency. By setting `enable.auto.commit=false` you can manually commit after the messages are processed.)
  - ***exactly once*** = holy grail, can only be used use from Kafka to Kafka e.g workflows


- A topic has a **Replication Factor** – 2 means there are 2 copies (risky) vs 3 which is gold standard


- **Partitions**: a topic is divided into numbered partitions which are distributed across brokers. You need to specify the number of partitions when you create the topic.- 


- **Parition Leader** Each partition has one leader and that is elected by Zookeeper. In the event of a broker failure then a new leader is elected but if that broker is restored it will become leader again


- The **In-Sync Replica** (ISR) is a replicated partition (there are multiple ISRs for topic) – see `min.insyc.replicas` on producer config (this is usually set to 3 which allows for two replicating brokers to go down; if we set it to 1 and brokers goes down we'll get `NotEnoughReplicas` exception)


- A **Key** is optionally send with a record. If a key is null then broker round robins across partitions but if they key is the same then records are written to the same partition (key hashing). ***So long as the number of partitions remains constant for a topic (no new partitions) then the same key will always go to the same partition.*** Example: for monitoring trucks we'd use the truckId for the key and then we'd get data in order (but ordering is only per partition). Keys are hashed using murmur2 (provides good distribution) to derive the partition to be written to (so same key always go to same partition and why we can't change number of partitions later) and you can (but not advised) override the hashing by overriding DefaultPartitioner. The default is: `targetPartition = Utils.abs(Utils2.murmur2(record.key())) % numPartitions`


- **ConsumerGroup**: Each consumer within a group reads from exclusive partitions. (If more consumers than partitions then they'll be inactive – we might want this is backup but usually at least as many consumer). Consumers know how to coordinate reading from partitions. If we want a high number of consumers then we need a high number of partitions!


- **ConsumerCoordinator**: Kafka functionality to rebalance consumer groups and partitions. Appears in logging,


- **Client bidirectionality compatability** - Older client 1.1 can talk to newer broker 2.0; newer client 2.0 can talk to older broker 1.1; so we can always use


- **Idempotent Producer** is used to guarantee safe and stable pipeline. 
  - Fixes issue where producer sends request and sends back ack but the producer doesn't receive ack because of network error so producer retries so now Kafka receives a duplicate and commits second time.
  - To use idempotent producer then produce.props(“`enable.idempotence`”,true)
  -  Kafka 0.11 fix this with a produceRequestId so it can determine if something is a duplicate and Kafka can de-dupe. (This is a mechanism not something that needs be implemented.) By default with idempotent producer then retries=Integer.MAX_VALUE and you can use max.inflight.requests=5 (high throughput) but guarantee ordering – see Kafka issues KAFKA-5494
