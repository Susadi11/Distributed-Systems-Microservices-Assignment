const rabbitMQ = require('../../OrderService/src/utils/rabbitmq.js');
require('dotenv').config();

async function startRestaurantConsumer() {
    try {
        const channel = await rabbitMQ.getChannel();

        const queue = 'restaurant_service_orders';
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, 'order_events', 'order.*');

        console.log('Restaurant consumer waiting for messages...');

        channel.consume(queue, (message) => {
            if (message !== null) {
                try {
                    const content = JSON.parse(message.content.toString());
                    console.log('\n=== Restaurant Service Received Order ===');
                    console.log('Event Type:', content.event);
                    console.log('Order ID:', content.data.orderId);
                    console.log('Restaurant ID:', content.data.restaurantId);
                    console.log('Items:', content.data.items.length);
                    console.log('Total Amount:', content.data.totalAmount);
                    console.log('===============================\n');

                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(message, false, false);
                }
            }
        });
    } catch (error) {
        console.error('Restaurant consumer error:', error);
        setTimeout(startRestaurantConsumer, 5000);
    }
}

startRestaurantConsumer();