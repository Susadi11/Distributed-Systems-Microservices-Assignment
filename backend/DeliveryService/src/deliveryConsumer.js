// src/deliveryConsumer.js
import axios from 'axios';
import Delivery from './models/Delivery.js';
import { connectRabbit, getChannel } from './rabbit.js';

const AUTH_SVC_URL = process.env.AUTH_SVC_URL;      // e.g. http://localhost:5560
const ORDER_SVC_URL = process.env.ORDER_SVC_URL;    // to callback order-as-assigned

async function notifyDriver(driver, orderId) {
  // your real push/SMS/socket code here
  console.log(`🚀 Notifying driver ${driver._id} for order ${orderId}`);
}

export default async function startConsumer() {
  // 1) connect & assert queue
  await connectRabbit(process.env.RABBITMQ_URL);
  const channel = getChannel();
  await channel.assertQueue('order_queue', { durable: true });
  console.log('📥 DeliveryService listening on order_queue…');

  // 2) consume
  channel.consume('order_queue', async msg => {
    if (!msg) return;
    const { orderId, restaurantId, userId: customer } = JSON.parse(msg.content.toString());
    console.log(`➡️  Received order ${orderId}`);

    try {

        console.log('orderId:', orderId);
        console.log('restaurantId:', restaurantId);
        console.log('customer:', customer);
      // --- a) Fetch one available driver from AuthService ---
      const { data: drivers } = await axios.get(`http://localhost:8080/api/auth/auth/api/drivers?status=available`);
      if (!drivers.length) {
        console.warn('⚠️ No available drivers—dropping message');
        return channel.nack(msg, false, false);
      }
      const driver = drivers[0];

      // --- b) Mark that driver as assigned in AuthService ---
      await axios.patch(`http://localhost:8080/api/auth/api/drivers/${driver._id}`, {
        status: 'assigned',
        currentOrder: orderId
      });

      // --- c) Create the Delivery record locally ---
      await Delivery.create({
        orderId,
        driverId: driver._id,
        restaurantId,
        customer,
        status: 'assigned'
      });

      // --- d) Notify driver however you like ---
      await notifyDriver(driver, orderId);

      // --- e) (Optional) let OrderService know the driver assignment ---
      await axios.post(`http://localhost:8080/api/orders/orders/${orderId}/assign`, {
        driverId: driver._id
      });

      // --- f) Ack the message ---
      channel.ack(msg);
      console.log(`✔️  Driver ${driver._id} assigned, Delivery created`);
    } catch (err) {
      console.error('❌ Error in deliveryConsumer:', err);
      // retry later
      channel.nack(msg, false, true);
    }
  }, { noAck: false });
}
