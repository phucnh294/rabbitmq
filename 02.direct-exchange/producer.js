const amqp= require('amqplib');
const config= require('./config');

const producer = async (topic, msg) => {
    try{

        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangeType= config.rabbitMQ.queue.exchange_type;
        const exchangeName= config.rabbitMQ.queue.exchange_name;
        await channel.assertExchange(exchangeName,exchangeType, {durable: true});

        //4. send message to exchange with routing key
        channel.publish(exchangeType, topic, Buffer.from(JSON.stringify(msg)));

        //log
        console.log(`Message sent to exchange: ${exchangeType} with routing key: ${topic} , message : ${JSON.stringify(msg)}` );

        //5. close channel and connection
        await channel.close();
        await connection.close();

    }catch(error){
        console.error(error);
    }
}

producer("test", {message: "Test message for test consumer"});
producer("dev", {message: "Development message for dev consumer"});
producer("ba", {message: "Backend message for ba consumer"});
producer("pm", {message: "Project management message for pm consumer"});