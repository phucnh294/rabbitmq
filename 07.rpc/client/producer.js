//in rpc client produce use to send request to server , server consumer will handle the request
const{randomUUID} = require('crypto');
const config = require("../client/config");

class Producer{
    constructor(channel, queueName, eventEmitter){
        this.channel = channel;
        this.queueName = queueName;
        this.eventEmitter= eventEmitter;
    }

    ProduceMessage(msg){
        const correlationId = randomUUID();

        console.log(`correlation id is ${correlationId}`);

        this.channel.sendToQueue(
            config.rabbitMQ.queues.rpcQueue, Buffer.from(JSON.stringify(msg)),
            {
                replyTo: this.queueName,
                correlationId,
                expiration: "10000",
                headers:{
                    function: msg.operation
                }
            }
        )

        return new Promise((resolve, reject)=>{
            const timeout = setTimeout(()=>{
                this.eventEmitter.removeAllListeners(correlationId);
                reject(new Error(`RPC request timed out (correlationId: ${correlationId})`));
            }, 10000);

            this.eventEmitter.once(correlationId, (result)=>{
                clearTimeout(timeout);
                resolve(result);
            });
        });
    };

}

module.exports = Producer;