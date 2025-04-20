const nodemailer = require('nodemailer');

// Configure your email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendRegistrationEmail = async ({ email, name, restaurantName }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Restaurant Registration',
      html: `
        <h1>Welcome to Our Platform, ${name}!</h1>
        <p>Thank you for registering your restaurant <strong>${restaurantName}</strong> with us.</p>
        <p>We're reviewing your application and will get back to you shortly.</p>
        <p>Best regards,</p>
        <p>The Restaurant Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Registration email sent to:', email);
  } catch (error) {
    console.error('Error sending registration email:', error);
    // Don't throw error as we don't want to fail the registration because email failed
  }
};