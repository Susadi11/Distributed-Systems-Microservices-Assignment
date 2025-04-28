// utils/rabbitmq.js
const amqp = require('amqplib');

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }

    async connect() {
        if (this.channel) return this.channel;
        if (this.isConnecting) {
            return new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (this.channel) {
                        clearInterval(checkInterval);
                        resolve(this.channel);
                    }
                }, 100);
            });
        }

        this.isConnecting = true;
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();

            // Set up exchange (idempotent operation)
            await this.channel.assertExchange('order_events', 'topic', { durable: true });

            console.log('RabbitMQ connected successfully');
            this.isConnecting = false;
            return this.channel;
        } catch (error) {
            this.isConnecting = false;
            console.error('RabbitMQ connection error:', error);
            throw error;
        }
    }

    async getChannel() {
        if (!this.channel) {
            await this.connect();
        }
        return this.channel;
    }
}

// Singleton instance
const rabbitMQInstance = new RabbitMQConnection();

module.exports = rabbitMQInstance;