const rabbitMQ = require('../../OrderService/src/utils/rabbitmq.js');
require('dotenv').config();

async function startDeliveryConsumer() {
    try {
        const channel = await rabbitMQ.getChannel();

        const queue = 'delivery_service_orders';
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, 'order_events', 'order.*');

        console.log('Delivery consumer waiting for messages...');

        channel.consume(queue, (message) => {
            if (message !== null) {
                try {
                    const content = JSON.parse(message.content.toString());
                    console.log('\n=== Delivery Service Received Order ===');
                    console.log('Event Type:', content.event);
                    console.log('Order ID:', content.data.orderId);
                    console.log('Delivery Address:', content.data.deliveryAddress.street);
                    console.log('Status:', content.data.status);
                    console.log('===============================\n');

                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(message, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Delivery consumer error:', error);
        setTimeout(startDeliveryConsumer, 5000);
    }
}

startDeliveryConsumer();