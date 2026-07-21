const amp = require('amqplib');

const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD } = process.env;
//read config from config.js
const config = require('./config');

const consumer = async () => {
    try {
        //1. Create a connection to RabbitMQ server
        const connection = await amp.connect(config.rabbitMQ.url);
        //2. Create a channel
        const channel = await connection.createChannel();
        //3. Define the queue name or the channel will be working on
        const queue = config.rabbitMQ.queue.channel;
        //4. Assert the queue
        await channel.assertQueue(queue, { durable: true });
        //5. Consume the message from the queue 
        await channel.consume(queue, (msg) => 
            {
                if(msg.content){
                    console.log(`Message received from queue: "${queue}": "${msg.content.toString()}"`);
                }
            },
            {
                noAck: true
            }
        );
    }catch(error) {
        console.error(error.message);
    }
}

consumer();