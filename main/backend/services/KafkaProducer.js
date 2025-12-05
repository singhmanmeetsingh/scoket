import Kafka from 'kafkajs';


const kafka = new Kafka({
    // clientId: 'movement-websocket',
    // brokers: [process.env.KAFKA_BROKERS]
    clientId: process.env.KAFKA_CLIENT_ID || 'movement-websocket',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});


const producer = kafka.producer();

const isConnected = false;




async function connectProducer() {
    try {
        await producer.connect();
        console.log('Producer connected');
    } catch (error) {
        console.error('Error connecting producer:', error);
    }
}




async function disconnectProducer() {
    try {
        await producer.disconnect();
        console.log('Producer disconnected');
    } catch (error) {
        console.error('Error disconnecting producer:', error);
    }
}



export async function sendMessage(topic, message) {
    try {

        if (isConnected == false) {
            await connectProducer();
        }
        await producer.send({
            topic: topic,
            messages: [{ value: message }]
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        await disconnectProducer();
    }
}


