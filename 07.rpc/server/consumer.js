//in rpc server consumer receives requests from clients, computes the reply, and hands it to the producer to send back
const config = require("./config");

function fibonacci(n){
    if(n < 2) return n;
    let prev = 0, curr = 1;
    for(let i = 2; i <= n; i++){
        [prev, curr] = [curr, prev + curr];
    }
    return curr;
}

class Consumer{
    constructor(channel, producer){
        this.channel = channel;
        this.producer = producer;
    }

    async ConsumeMessage(){
        await this.channel.assertQueue(config.rabbitMQ.queues.rpcQueue, {durable:true});
        await this.channel.prefetch(1);

        await this.channel.consume(
            config.rabbitMQ.queues.rpcQueue,
            (msg)=>{
                if(!msg) return;

                const {n} = JSON.parse(msg.content.toString());
                const operation = msg.properties.headers.function;

                console.log(`Received ${operation}(${n}) request, correlationId: ${msg.properties.correlationId}`);

                let result;
                if(operation === "fibonacci"){
                    result = {value: fibonacci(n)};
                }else{
                    result = {error: `Unknown operation: ${operation}`};
                }

                this.producer.ReplyMessage(msg.properties.replyTo, msg.properties.correlationId, result);
                this.channel.ack(msg);
            },
            {noAck:false}
        );
    }
}

module.exports = Consumer;