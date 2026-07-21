const amqp = require('amqplib');

//get data from config file
const config = require('./config');

const producer =async ({msg})=>{
    try{
        //1. Create a connection to RabbitMQ server
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. Create a channel
        const channel = await connection.createChannel();
        //3. Define the queue name
         const queue = config.rabbitMQ.queue.channel;
        //4. Assert the queue
        await channel.assertQueue(queue, {durable:true});
        //5. Send the message to the queue        
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(`Message sent to queue: "${queue}": "${msg}"`);
        //6. Close the channel and connection
        await channel.close();
        await connection.close();
    }catch(error){
        console.error(error.message);
    }
}

//send message to the queue
//producer({msg:"Hello World!"});

//if sned from command line, use the following code to send message to the queue
const message = process.argv[2] || "Hello World!";
producer({msg:message});
