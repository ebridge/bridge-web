const nodemailer = require('nodemailer');
const {
  signVerifyEmailJWToken,
  signResetPasswordJWToken,
} = require('../lib/token');
const verifyEmail = require('../assets/emails/verifyEmail');
const resetPassword = require('../assets/emails/resetPassword');

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
  const JWT = signVerifyEmailJWToken(id);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'eBridge Club - Please verify your email.',
    text: '',
    html: verifyEmail(JWT),
  });
}

async function sendResetPasswordEmail(id, userEmail) {
  const JWT = signResetPasswordJWToken(id);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'eBridge Club - Reset your password.',
    text: '',
    html: resetPassword(JWT),
  });
}

module.exports = {
  sendVerifyEmail,
  sendResetPasswordEmail,
};
