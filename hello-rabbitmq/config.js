const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    rabbitMQ: {
        url: `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`,
        //define queue channel name
        queue:{
            channel:"hello",
        },
    },
};
