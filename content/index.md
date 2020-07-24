# REDIMO

## The Redis API's simplicity over DynamoDB's complexity.

Web based services today tend to have customers all over the world, and a large number of them active at different times. To deal with the speed/slowness of light, we run our code and application servers at the edges of the internet, close to our users. And because our load graphs are almost never a straight line, we try to run serverless systems that automatically go from zero to millions of requests per second when required. 

But what about data? Do we want to keep hitting a single database or datastore in one blessed region to service requests from all around the world? And doesn't that negate all the progress we've made with distributing and automatically scaling application servers?

Out of the globally distributed datastore offerings on the market right now, one stands out: AWS DynamoDB, with Global Tables. DynamoDB has long been a foundational component of the AWS system, and helps run AWS itself, along with critical Amazon (retail) infrastructure. The Global Tables feature allows linking DynamoDB tables in regions across the world and automatically replicating their data with each other. And with the On-Demand pricing system, it's now possible to have a serverless system that scales down to zero running costs when no operations are happening, while being able to ramp up quickly to millions of requests per second. 

The downside of DynamoDB is that it requires a thorough understanding of an unfamiliar and difficult API if you want to use it. The upside is that it's possible to implement a simpler Redis-inspired API over DynamoDB. Whether you're running in a single region or globally distributed, it's much easier to write and reason about code that uses `GET`, `SET` and other clear and simple NoSQL operations. These operations can be automatically translated into their arcane DynamoDB counterparts, which is what REDIMO does for you.

REDIMO runs servers around the world that wrap DynamoDB and offer an intuitive Redis-like API. This API is available as a native RESP (the Redis protocol) server and a gRPC service. Using the RESP server allows you to continue using the Redis client libraries you have experience with, while the gRPC system gives you high-performance connection-pool-free client SDKs in many languages with native protocol buffer support. If you're running Global Tables, you can pass in the region-table combinations you're running, and REDIMO will automatically choose the nearest one. 

On both the RESP server and gRPC service, the following Redis-inspired operations are available:

`GET(key)` retrieves the value stored at the given key.

`SET(key, value)` sets the value at the given key.

`DEL(key)` deletes value at key.

`GETSET(key, value)` sets the given value at the key and returns the old value.

`SETX(key, value)` sets the value on key only if the key already exists.

`SETNX(key, value)` sets the value on key only if the key does **not** already exist.

`INCRBY(key, delta)` increments the number value at the key with the given delta.

`DECRBY(key, delta)` decrements the number value at the key with the given delta.

`EXISTS(key)` checks if the given key exists.

*Hashes* or *hash-maps* are supported, and can be used by adding a sub-key along with the key: commonly called a *field*. The following operations work the same as their counterparts above:

`HGET(key, field)` 

`HSET(key, field, value)` 

`HDEL(key, field)` 

`HGETSET(key, field, value)` 

`HSETX(key, field, value)` 

`HSETNX(key, field, value)` 

`HINCRBY(key, field, delta)` 

`HDECRBY(key, field, delta)` 

`HEXISTS(key, field)`

Key-Value operations are hash operations with constant field names under the hood: `SET(key, value)` is the same as `HSET(key, '/', value)` and `GET(key)` is the same as  `HGET(key, '/')`. 

Hashes have a few other useful operations:

`HGETALL(key)` returns all fields and values at the given key. This is useful as a cost effective way to get a large number of small items, because the underlying operation is charged based on data size instead of number of items.

`HKEYS(key)` returns the list of all fields in the hash at the given key. 

`HLEN(key)` counts the number of fields set on the hash at the given key.

Using the sub-keys or fields inside a hash-map without assigning any values gives us a *set* data structure—we can do operations like:

`SADD(key, member)` adds the member to the set at key. This is the same as `HSET` with no value.

`SREM(key, member)` removes the member from the set at key, same as `HDEL`.

`SISMEMBER(key, member)` checks if the member is present in the set at key, same as `HEXISTS`.

`SMEMBERS(key)` returns all the members of the set at the given key, same as `HKEYS`.

`SCARD(key)` counts the number of members in the set, and is the same as `HLEN(key)`.

DynamoDB sorts all the fields when storing them, which gives us the ability to do *sorted set* operations:

`ZRANGEBYLEX(key, start, end, limit, offset)` returns the items with member/field name between the *start* and *end* strings. This is useful for doing “starts-with” operations and from-to queries. *Limit* restricts the maximum number of items returned, while the *offset* number of items are skipped returning results.

`ZREVRANGEBYLEX(key, start, end, limit, offset)` works same as `ZRANGEBYLEX`, but in reverse sort order.

`ZLEXCOUNT(key, start, end)` counts the members/fields between the *start* and *end* strings.


