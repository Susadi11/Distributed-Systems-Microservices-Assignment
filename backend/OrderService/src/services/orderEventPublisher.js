// services/orderEventPublisher.js
const rabbitMQ = require('../utils/rabbitmq');

const publishOrderEvent = async (eventType, orderData) => {
    try {
        const channel = await rabbitMQ.getChannel();

        const message = {
            event: eventType,
            data: orderData,
            timestamp: new Date()
        };

        const routingKey = `order.${eventType}`;

        channel.publish('order_events', routingKey, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });

        console.log(`Published ${eventType} event for order ${orderData.orderId}`);
    } catch (error) {
        console.error('Error publishing order event:', error);
        throw error;
    }
};

module.exports = {
    publishOrderCreated: (orderData) => publishOrderEvent('created', orderData),
    publishOrderUpdated: (orderData) => publishOrderEvent('updated', orderData),
    publishOrderCancelled: (orderData) => publishOrderEvent('cancelled', orderData)
};