const amqp= require('amqplib');
const config = require('./config');

async function subscriber(queuename, topic){
    try{
        //1. create connection
        var connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        var channel = await connection.createChannel();
        //3. assert exchange
        const exchangetype= config.rabbitMQ.queue.exchange_type;
        const exchangename= config.rabbitMQ.queue.exchange_name;
        await channel.assertExchange(exchangename, exchangetype, {durable: true});

        //4. assert queue
        const {queue} = await channel.assertQueue(queuename, {exclusive: true});
        //5. bind queue to exchange
        await channel.bindQueue(queue, exchangename, topic);
        console.log(`Waiting for messages in queue: ${queue} with topic: ${topic}`);

        //6. consume messages from queue
        channel.consume(queue,(msg)=>{
            if(msg.content){
                console.log(`Received message from queue: ${queue} with topic: ${topic} , message : ${msg.content.toString()}`);
            }
        },{noAck: true});

        
    
    }catch(error){
        console.error(error);
    }
}

subscriber("subscriber1-queue", "..NET");