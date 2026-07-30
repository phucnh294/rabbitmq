//in rpc client consumer use to consume the return producer form the server
class Consumer{
    constructor(channel, queueName, eventEmitter){
        this.channel = channel;
        this.queueName = queueName;
        this.eventEmitter = eventEmitter;
    }

    async ConsumeMessage(){
        await this.channel.consume(
            this.queueName,
            (msg)=>{
                if(!msg) return;

                const correlationId = msg.properties.correlationId;
                const result = JSON.parse(msg.content.toString());

                this.eventEmitter.emit(correlationId, result);
                this.channel.ack(msg);
            },
            {noAck:false}
        );
    }
}

module.exports = Consumer;