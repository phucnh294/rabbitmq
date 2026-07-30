const dotenv = require("dotenv");
const path = require('path');

dotenv.config({path:path.resolve(__dirname,'../../.env')});

module.exports = {
  rabbitMQ: {
    url:  `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@localhost`,
    queues: {
      rpcQueue: "rpc_queue",
    },
  },
};