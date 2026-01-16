const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Pass this if using Gmail, or use host/port for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Check if EMAIL configuration is present
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "⚠️  Email configuration missing (EMAIL_USER/EMAIL_PASS). Email not sent."
    );
    return;
  }

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || "Sentifi"} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
