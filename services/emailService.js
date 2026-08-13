const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendCertificateEmail(toEmail, studentName, courseName, certificateNumber, pdfBuffer) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyLink = `${baseUrl}/verify/${certificateNumber}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `🎓 Congratulations! Your Certificate for ${courseName}`,
    html: `
      <h2>Dear ${studentName},</h2>
      <p>Congratulations on successfully completing <strong>${courseName}</strong> at Up Skills Hub!</p>
      <p>Your official certificate is attached to this email.</p>
      <p>You can verify the authenticity of your certificate anytime using the link below:</p>
      <a href="${verifyLink}" target="_blank">${verifyLink}</a>
      <br><br>
      <p>Best regards,<br>Up Skills Hub</p>
    `,
    attachments: [
      {
        filename: `Certificate-${certificateNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
}

module.exports = { sendCertificateEmail };