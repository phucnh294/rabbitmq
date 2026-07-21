const dotenv = require('dotenv');

const path = require('path');
//configure dotenv to read .env file
dotenv.config({path: path.resolve(__dirname, '../.env')});

module.exports = {
    rabbitMQ: {
        url: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`,
        //define queue channel name
        queue:{
            channel:"hello",
        },
    },
};
