import { broker } from './broker';

// SubscriberA 
broker.registerSubscriber('aChannel', 'subscriberA', (data) => {
    console.log('aChannel -> subscribedA', data);
});
broker.registerSubscriber('bChannel', 'subscriberA', (data) => {
    console.log('bChannel -> subscribedA', data);
});

// SubscriberB
broker.registerSubscriber('aChannel', 'subscriberB', (data) => {
    console.log('aChannel -> subscribedB', data);
});
broker.registerSubscriber('bChannel', 'subscriberB', (data) => {
    console.log('bChannel -> subscribedB', data);
});
broker.unsubscribe('subscriberA');
// Publisher
broker.publish('aChannel', "Hello World");
broker.publish('bChannel', 'Hello There');