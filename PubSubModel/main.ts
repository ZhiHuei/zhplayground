import { broker, Subscriber } from './broker';

// SubscriberA
const callbackA_K = (data: string): void => {
    console.log('subcriberA: Message from ChannelK', data);
    subcriberA_K.ack();
};
const callbackA_J = (data: string): void => {
    console.log('subcriberA: Message from ChannelJ', data);
    subcriberA_J.ack();
};
const subcriberA_K = new Subscriber('ChannelK', 'subA', callbackA_K);
const subcriberA_J = new Subscriber('ChannelJ', 'subA', callbackA_J);

// SubscriberB
const callbackB_K = (data: string): void => {
    console.log('subcriberB: Message from ChannelK', data);
    subcriberB_K.ack();
};
const callbackB_J = (data: string): void => {
    console.log('subcriberB: Message from ChannelJ', data);
    // subcriberB_J.ack();
};
const subcriberB_K = new Subscriber('ChannelK', 'subB', callbackB_K);
const subcriberB_J = new Subscriber('ChannelJ', 'subB', callbackB_J);

broker.registerSubscriber(subcriberA_K);
broker.registerSubscriber(subcriberA_J);
broker.registerSubscriber(subcriberB_K);
broker.registerSubscriber(subcriberB_J);

// Publisher
broker.publish('ChannelK', "Message K");
broker.publish('ChannelJ', "Message J");

// broker.publish('aChannel', "Hello World222");
// broker.publish('bChannel', 'Hello There');
