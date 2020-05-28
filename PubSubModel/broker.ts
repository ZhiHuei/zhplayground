interface ICallback {
    (message: string): void;
}

enum Status {
    Active = 'active',
    Pending = 'pending',
    Inactive = 'inactive'
}

interface ISubscriber {
    getChannel(): string;
    getId(): string;
    invokeCallback(data: string): void;
    getStatus(): string;
    ack(): void;
}

export class Subscriber implements ISubscriber {
    private channel: string;
    private id: string;
    private callback: ICallback;
    private status: Status;
    private counter = 0;

    constructor(channel: string, id: string, callback: ICallback) {
        this.channel = channel;
        this.id = id;
        this.callback = callback;
        this.status = Status.Active;
    }

    public getChannel(): string {
        return this.channel;
    }
    
    public getId(): string {
        return this.id;
    }

    public getStatus(): string {
        return this.status;
    }

    public ack(): void {
        this.status = Status.Active;
    }

    public invokeCallback(data: string): void {
        this.status = Status.Pending;
        this.callback(data);
        this.startReplayTimer(data);
    }

    private startReplayTimer(data: string): void {
        const handle = setTimeout(() => {
            if (this.replayIfPending(data) || ++this.counter === 3) {            
                clearTimeout(handle);
            } else {
                this.startReplayTimer(data);
            }
        }, 5000);
    }

    private replayIfPending(data: string): boolean {
        if (this.status === Status.Pending) {
            console.log('Replaying data to', this.id, 'at', this.channel, ' ........');
            this.callback(data);
            return false;
        }
        return true;
    }
}

class MessageBroker {
    private subscribers: ISubscriber[] = [];
    public registerSubscriber(subscriber: Subscriber): void {
        this.subscribers.push(subscriber);
    }

    public publish(channel: string, data: string): void {
        this.subscribers.filter((subscriber) => subscriber.getStatus() === Status.Active && subscriber.getChannel() === channel)
            .forEach((subscriber) => subscriber.invokeCallback(data));
    }

    public unsubscribe(id: string, channel?: string) {
        if (channel) {
            const index = this.subscribers.findIndex((subscriber) => subscriber.getId() === id && subscriber.getChannel() === channel); 
            this.subscribers.splice(index, 1);
        } else {
            const indexes = this.subscribers
                .reduce((acc, subscriber, i) => (subscriber.getId() === id)? acc.concat(i) : acc, [] as number[]);
            indexes.forEach((toRemove) => this.subscribers.splice(toRemove, 1));
        }
    }
}

export const broker = new MessageBroker();

// public replayPublish(data: string): void {
//     let x = 0;
//     const handle = setInterval(() => {
//         if (this.retryIfPending(data) || ++x === 10) {
//             clearInterval(handle);
//         }
//     }, 5000);
// }

// private retryIfPending(data: string): boolean {
//     for (const subscriber of this.subscribers) {
//         console.log(subscriber);
//         if (subscriber.getStatus() === Status.Pending) {
//             console.log('replaying publish to...', subscriber.getId());
//             subscriber.invokeCallback(data);
//             return false;
//         }
//     }
//     console.log('will it reach here?');
//     return true;   // all subscribers are active
// }

// public sendACK(id: string, channel: string): void {
//     const index = this.subscribers.findIndex((subscriber) => subscriber.getId() === id && subscriber.getChannel() === channel);
//     this.subscribers[index].setStatus(Status.Active);
// }