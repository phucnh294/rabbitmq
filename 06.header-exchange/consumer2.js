const amqp= require('amqplib');
const config = require('./config')

async function headerconsumer(header_gender){
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);

        //2. create channel

        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangeType= config.rabbitMQ.queue.exchange_type;
        const exchangeName= config.rabbitMQ.queue.exchange_name;

        await channel.assertExchange(exchangeName, exchangeType, {durable:true});
        
        //4. create queu for each subscriber

        const queueName= `${header_gender}.queue`;

        await channel.assertQueue(queueName,{durable:true});

        //5. bind queue

        const bindArgs= {
            gender:header_gender,
            "x-match":"all"
        }

        channel.bindQueue(queueName, exchangeName,"", bindArgs);

        channel.consume(queueName, (msg)=>{
            const message = msg.content.toString();

            console.log(`recieved message queuename ${queueName}: ${message} from header ${JSON.stringify(msg.properties.headers)}`);
            channel.ack(msg);
        })

    }catch(error){
        console.error(error);
    }
}

headerconsumer("female");
