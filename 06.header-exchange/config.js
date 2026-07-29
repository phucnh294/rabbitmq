const dotenv= require('dotenv');
const path = require('path');
dotenv.config({path:path.resolve(__dirname,'../.env')});

module.exports={
    rabbitMQ:{
        url:`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`,
        queue:{
            exchange_name:"header_exchange",
            exchange_type:"headers",
            queue1: "header_queue1",
            queue2: "header_queue2"
        }
    }
}
