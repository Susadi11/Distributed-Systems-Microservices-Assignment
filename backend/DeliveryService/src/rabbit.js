// src/rabbit.js
import amqp from 'amqplib';

let channel = null;

export async function connectRabbit(url = process.env.RABBITMQ_URL || 'amqp://localhost') {
  const conn = await amqp.connect(url);
  channel = await conn.createChannel();
  return channel;
}

export function getChannel() {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
}
