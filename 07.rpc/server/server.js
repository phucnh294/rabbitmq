const amqp = require("amqplib");
const config = require("./config");
const Producer = require("./producer");
const Consumer = require("./consumer");

(async () => {
    //1. create connection
    const connection = await amqp.connect(config.rabbitMQ.url);
    //2. create channel
    const channel = await connection.createChannel();

    //3. wire producer (sends replies) and consumer (receives requests, computes, replies)
    const producer = new Producer(channel);
    const consumer = new Consumer(channel, producer);
    await consumer.ConsumeMessage();

    console.log(`RPC server waiting for requests on queue: ${config.rabbitMQ.queues.rpcQueue}`);
})();