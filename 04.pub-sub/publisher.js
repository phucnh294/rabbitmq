const amqp= require('amqplib');
const config = require('./config');

const publisher = async (topic, message) => {
    try{
        //1. create connection
        const connection =await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangetype= config.rabbitMQ.queue.exchange_type;
        const exchangename= config.rabbitMQ.queue.exchange_name;

        await channel.assertExchange(exchangename, exchangetype, {durable: true});
        //4. publish message to exchange with routing key
        channel.publish(exchangename, topic, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to exchange: ${exchangename} with routing key: ${topic} , message : ${JSON.stringify(message)}` );

        //5. close channel and connection
        await channel.close();
        await connection.close();

    }catch(error){
        console.error(error);
    }
}

publisher(".NET", {message: "Message for .NET consumer"});
publisher("Java", {message: "Message for Java consumer"});
publisher("Java .NET", {message: "Message for all .net and Java consumer"});


