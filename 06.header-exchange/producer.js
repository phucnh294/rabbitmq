const amqp =require('amqplib');
const config = require('./config');

async function header_producer(header, msg){
    try{
        //1. create connection
        const connection = await amqp.connect(config.rabbitMQ.url);
        //2. create channel
        const channel = await connection.createChannel();
        //3. assert exchange
        const exchangeType = config.rabbitMQ.queue.exchange_type;
        const exchangeName = config.rabbitMQ.queue.exchange_name;

        await channel.assertExchange(exchangeName, exchangeType, {durable :true});

        const headers= {
            gender:header,
            "country":"usa"
        }

        const options={headers};
        channel.publish(exchangeName, "", Buffer.from(msg),options )
        console.log(`sent message ${msg} to ${header}`)

        //4. close channel and connection
        await  channel.close();
        await connection.close();

    }catch(error){
        console.error(error);
    }
}

header_producer("male", "Martin");
header_producer("female", "Queenie");