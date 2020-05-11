interface ISubscriber {
    channel: string;
    id: string;
    callback: ICallback;
}

interface ICallback {
    (message: string): void;
}

class MessageBroker {
    private subscribers: ISubscriber[] = [];
    public registerSubscriber(channel: string, id: string, callback: ICallback): void {
        const subscriber: ISubscriber = {
            channel,
            id,
            callback
        }
        this.subscribers.push(subscriber);
    }

    public publish(channel: string, data: string): void {
        this.subscribers
            .filter((subscriber) => channel === subscriber.channel)
            .forEach((subscriber) => subscriber.callback(data));
    }

    public unsubscribe(id: string) {
        const indexes = this.subscribers
            .reduce((acc, subscriber, i) => (subscriber.id === id)? acc.concat(i) : acc, [] as number[]);
        indexes.forEach((index) => this.subscribers.splice(index, 1));
    }
}

export const broker = new MessageBroker();