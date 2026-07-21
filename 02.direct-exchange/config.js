const dotenv= require('dotenv');

//configure dotenv to read .env file
const path = require('path');
dotenv.config({path:path.resolve(__dirname,'../.env')});

module.exports = {
    rabbitMQ: {
         url: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`,
        //define queue channel name
        queue:{
            channel:"direct-exchange", 
            exchange_type:"direct", //define exchange type
        },
    }
}