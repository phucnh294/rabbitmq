const amqp = require('amqplib');
const config = require('./config');

async function consumer1 (queueName){  
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangeType = config.rabbitMQ.queue.exchange_type;
        const exchangeName = config.rabbitMQ.queue.exchange_name;

        await channel.assertExchange( exchangeName,exchangeType,{durable:true});

        //4. assert queue to channel
        const {queue} = await channel.assertQueue(queueName,{exclusive:true});

        //5. bind queue to exchange with topic
        await channel.bindQueue(queue, exchangeName, "*.C#.*"); // wildcard for all topic have 'C#'

        console.log(`waiting message in ${queue} with topic pattern '*.C#.*' `);
        
        //6. consume message from queue
        channel.consume(queue, (msg)=>{
            if(msg.content){
                console.log(`Recieved message from queue : ${queue}  message : ${msg.content.toString()} "`)
            }
        })

    }catch(error){
        console.error(error);
    }

}

consumer1("net-topic")