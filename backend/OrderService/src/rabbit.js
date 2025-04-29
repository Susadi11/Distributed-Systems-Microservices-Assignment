const amqp = require('amqplib');

let channel = null;

async function connectRabbit(url = process.env.RABBITMQ_URL || 'amqp://localhost') {
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  return channel;
}

function getChannel() {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
}

module.exports = { connectRabbit, getChannel };
