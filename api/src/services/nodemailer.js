const nodemailer = require('nodemailer');
const { signEmailJWToken } = require('../lib/token');
const verifyEmail = require('../assets/emails/verifyEmail');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerifyEmail(id, userEmail) {
  const JWT = signEmailJWToken(id);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'eBridge Club - Please verify your email.',
    text: '',
    html: verifyEmail(JWT),
  });
}

module.exports = { sendVerifyEmail };
