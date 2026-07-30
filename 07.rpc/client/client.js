const amqp = require("amqplib");
const {EventEmitter} = require("events");
const config = require("./config");
const Producer = require("./producer");
const Consumer = require("./consumer");

(async () => {
    //1. create connection
    const connection = await amqp.connect(config.rabbitMQ.url);
    //2. create channel
    const channel = await connection.createChannel();
    //3. make sure the request queue exists even if the server hasn't started yet
    await channel.assertQueue(config.rabbitMQ.queues.rpcQueue, {durable:true});
    //4. exclusive, auto-named queue to receive this client's own replies
    const {queue: replyQueue} = await channel.assertQueue("", {exclusive:true});

    //5. wire consumer (receives replies) and producer (sends requests), correlated via correlationId events
    const eventEmitter = new EventEmitter();
    const consumer = new Consumer(channel, replyQueue, eventEmitter);
    await consumer.ConsumeMessage();

    const producer = new Producer(channel, replyQueue, eventEmitter);

    const n = Number(process.argv[2]) || 10;

    console.log(`Requesting fibonacci(${n}) from RPC server...`);
    const result = await producer.ProduceMessage({operation: "fibonacci", n});
    console.log(`Result: ${JSON.stringify(result)}`);

    await channel.close();
    await connection.close();
})();