const amqp = require('amqplib');
const config = require('./config');

const consumer = async (queuename) => {
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangeType = config.rabbitMQ.queue.exchange_type;
        const exchangeName = config.rabbitMQ.queue.exchange_name;
        await channel.assertExchange(exchangeName,exchangeType, {durable: true});
        //4. assert queue
        const {queue} = await channel.assertQueue(queuename, {exclusive: true});
        //5. bind queue to exchange with routing key
        await channel.bindQueue(queue, exchangeType, "dev");
        await channel.bindQueue(queue, exchangeType, "ba");
        await channel.bindQueue(queue, exchangeType, "pm");

        console.log(`Waiting for messages in queue: ${queue}}`);

        //6. consume messages from queue
        channel.consume(queue, (msg) => {
            if (msg.content) {
                console.log(`Received message from queue: ${queue} , message : ${msg.content.toString()}`);
            }
        }, {noAck: true});


    }catch(error){
        console.error(error);
    }
}


consumer("all-others-queue");