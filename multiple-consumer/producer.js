const amqp = require('amqplib');

//read config file
const  config = require('./config');

const producer = async(msg)=>{
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. get channel name from config file
        const channelName = config.rabbitMQ.queue.channel;
        //4. assert queue
        await channel.assertQueue(channelName);
        //5. send message to queue
        await channel.sendToQueue(channelName, Buffer.from(JSON.stringify(msg)));
        console.log(`Message sent to queue: ${channelName} : ${msg}`);

        //6. close channel and connection
        await channel.close();
        await connection.close();

    }catch(error){
        console.log(error);
    }
}

//send message to queue every 5 seconds
setInterval(()=>{
    const msg = {
        text: "Hello, RabbitMQ Consumer!",
        timestamp: new Date()
    };
    producer(msg);
}, 5000);