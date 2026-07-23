const dotenv= require('dotenv');
//configure dotenv to read .env file
const path = require('path');
dotenv.config({path:path.resolve(__dirname,'../.env')});

module.exports = {
    rabbitMQ: {
         url: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`, 
         queue:{
            channel:"topic-exchange", 
            exchange_name:"topic-ex", //define exchange name, in rabbitMQ sample it called "logs" but we can name it anything, this is the name of exchange 
            exchange_type:"topic", //define exchange type this is type of exchange
        },
    }
}   