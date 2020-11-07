const nodemailer = require('nodemailer');
const { signEmailJWToken } = require('../lib/token');

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
    text: ` _PLACEHOLDER TEXT_
      Click the link below or copy and paste this url into your brower's 
      address bar to confirm your email for your eBridge.club account.`,
    html: `Click the link below to confirm your email for your eBridge.club account. ${JWT}
      <a target='_blank' rel="noreferer" href='localhost:3000/verifyEmail/${JWT}>Verify Email</a>
    `,
  });
}

module.exports = { sendVerifyEmail };
