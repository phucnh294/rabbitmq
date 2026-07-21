const amqp = require('amqplib');

const config = require('./config');

const consumer2 = async()=>{
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2 create channel
        const channel = await connection.createChannel();
        //3. get channel name from config file
        const channelName = config.rabbitMQ.queue.channel;
        //4. assert queue
        await channel.assertQueue(channelName);
        //5. consume message from queue
        await channel.consume(channelName,(msg)=>{
            if(msg.content){
                console.log(`Message received from queue: ${channelName} : ${msg.content.toString()}`);
            }
        },{
            noAck:true
        }
    )

    }catch(error){
        console.log(error);
    }
}

consumer2();