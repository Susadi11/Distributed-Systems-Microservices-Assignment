import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export function sendWhatsAppMessage(to, message) {
    client.messages.create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${+94785937035}`
    })
    .then(message => console.log(`Message sent! SID: ${message.sid}`))
    .catch(error => console.error('Error sending WhatsApp message:', error));
}
