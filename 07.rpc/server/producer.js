//in rpc server producer sends the computed reply back to the client's reply queue
class Producer{
    constructor(channel){
        this.channel = channel;
    }

    ReplyMessage(replyTo, correlationId, result){
        this.channel.sendToQueue(
            replyTo,
            Buffer.from(JSON.stringify(result)),
            {correlationId}
        );
    }
}

module.exports = Producer;