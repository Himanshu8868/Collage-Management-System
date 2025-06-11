// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., "yourcollegeapp@gmail.com"
    pass: process.env.EMAIL_PASS, // App password, not actual password
  },
});
// console.log("Email User:", process.env.EMAIL_USER);
// console.log("Email Pass:", process.env.EMAIL_PASS);


const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"College System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
