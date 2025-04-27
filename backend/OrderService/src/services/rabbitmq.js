const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

class RabbitMQ {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queues = {
            ORDER_CREATED: 'order_created',
            PAYMENT_PROCESS: 'payment_process',
            DELIVERY_ASSIGN: 'delivery_assign',
            RESTAURANT_NOTIFY: 'restaurant_notify'
        };
        this.exchanges = {
            ORDER_EVENTS: 'order_events'
        };
        this.routingKeys = {
            ORDER_CREATED: 'order.created',
            PAYMENT_REQUIRED: 'payment.required',
            DELIVERY_ASSIGNED: 'delivery.assigned',
            RESTAURANT_NOTIFIED: 'restaurant.notified'
        };
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
            this.channel = await this.connection.createChannel();

            // Assert exchange
            await this.channel.assertExchange(this.exchanges.ORDER_EVENTS, 'topic', {
                durable: true
            });

            // Assert queues with additional options
            await Promise.all([
                this.channel.assertQueue(this.queues.ORDER_CREATED, {
                    durable: true,
                    deadLetterExchange: 'dlx',
                    deadLetterRoutingKey: 'order.dead'
                }),
                this.channel.assertQueue(this.queues.PAYMENT_PROCESS, {
                    durable: true
                }),
                this.channel.assertQueue(this.queues.DELIVERY_ASSIGN, {
                    durable: true
                }),
                this.channel.assertQueue(this.queues.RESTAURANT_NOTIFY, {
                    durable: true
                })
            ]);

            // Bind queues to exchange
            await Promise.all([
                this.channel.bindQueue(this.queues.ORDER_CREATED, this.exchanges.ORDER_EVENTS, this.routingKeys.ORDER_CREATED),
                this.channel.bindQueue(this.queues.PAYMENT_PROCESS, this.exchanges.ORDER_EVENTS, this.routingKeys.PAYMENT_REQUIRED),
                this.channel.bindQueue(this.queues.DELIVERY_ASSIGN, this.exchanges.ORDER_EVENTS, this.routingKeys.DELIVERY_ASSIGNED),
                this.channel.bindQueue(this.queues.RESTAURANT_NOTIFY, this.exchanges.ORDER_EVENTS, this.routingKeys.RESTAURANT_NOTIFIED)
            ]);

            console.log('RabbitMQ connected and configured');
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
            throw error;
        }
    }

    async publishToExchange(exchange, routingKey, message, options = {}) {
        if (!this.channel) {
            await this.connect();
        }

        try {
            const messageId = uuidv4();
            const timestamp = new Date().toISOString();

            await this.channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                {
                    persistent: true,
                    messageId,
                    timestamp,
                    ...options
                }
            );

            console.log(`Message published to ${exchange} with routing key ${routingKey}`);
            return messageId;
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async publishOrderEvent(order) {
        try {
            const baseEvent = {
                eventId: uuidv4(),
                timestamp: new Date().toISOString(),
                orderId: order._id,
                userId: order.user,
                restaurantId: order.restaurant || order.items[0]?.restaurant,
                amount: order.total
            };

            // Publish to all relevant queues
            await Promise.all([
                this.publishToExchange(
                    this.exchanges.ORDER_EVENTS,
                    this.routingKeys.ORDER_CREATED,
                    {
                        ...baseEvent,
                        eventType: 'ORDER_CREATED',
                        orderDetails: {
                            items: order.items,
                            deliveryAddress: order.deliveryAddress,
                            estimatedDeliveryTime: order.estimatedDeliveryTime
                        }
                    }
                ),
                this.publishToExchange(
                    this.exchanges.ORDER_EVENTS,
                    this.routingKeys.PAYMENT_REQUIRED,
                    {
                        ...baseEvent,
                        eventType: 'PAYMENT_REQUIRED',
                        paymentDetails: {
                            method: order.paymentMethod,
                            amount: order.total,
                            currency: 'LKR'
                        }
                    }
                ),
                this.publishToExchange(
                    this.exchanges.ORDER_EVENTS,
                    this.routingKeys.DELIVERY_ASSIGNED,
                    {
                        ...baseEvent,
                        eventType: 'DELIVERY_ASSIGNMENT',
                        deliveryDetails: {
                            address: order.deliveryAddress,
                            instructions: order.deliveryInstructions,
                            option: order.deliveryOption
                        }
                    }
                ),
                this.publishToExchange(
                    this.exchanges.ORDER_EVENTS,
                    this.routingKeys.RESTAURANT_NOTIFIED,
                    {
                        ...baseEvent,
                        eventType: 'RESTAURANT_NOTIFICATION',
                        restaurantDetails: {
                            items: order.items,
                            preparationTime: 20 // Default prep time
                        }
                    }
                )
            ]);

            return true;
        } catch (error) {
            console.error('Error publishing order event:', error);
            return false;
        }
    }

    async consume(queue, callback, options = { noAck: false }) {
        if (!this.channel) {
            await this.connect();
        }

        try {
            await this.channel.consume(queue, async (message) => {
                try {
                    const content = JSON.parse(message.content.toString());
                    console.log(`Received message from ${queue}:`, content);

                    await callback(content);

                    if (!options.noAck) {
                        this.channel.ack(message);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                    if (!options.noAck) {
                        this.channel.nack(message, false, false); // Don't requeue
                    }
                }
            }, options);

            console.log(`Consumer started for queue ${queue}`);
        } catch (error) {
            console.error('Error starting consumer:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('RabbitMQ connection closed');
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
}

module.exports = new RabbitMQ();