const amqp= require('amqplib');
const config = require('./config');

async function topic_producer(topic, message){
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel  = await connection.createChannel();
        //3. assert exchange
        const exchangeType = config.rabbitMQ.queue.exchange_type;
        const exchangeName = config.rabbitMQ.queue.exchange_name;

        await channel.assertExchange(exchangeName, exchangeType, {durable: true});

        //4. assert channel and publish message to exchange with routing key
        channel.publish(exchangeName, topic, Buffer.from(JSON.stringify(message)));

        //log
        console.log(`Message sent to exchange: ${exchangeName} with routing key: ${topic} , message : ${JSON.stringify(message)}` );
    
        //5. close channel and connection
        await channel.close();
        await connection.close();


    }catch(error){
        console.error(error); 
    }

}

topic_producer("topic.C#.info", {message: "Test message for C# consumer"});
topic_producer("*.Java", {message: "Test message for Java consumer"});
topic_producer("everything.needed.else", {message: "this is everything else"});