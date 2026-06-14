// // utils/mailer.js
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // e.g., "yourcollegeapp@gmail.com"
//     pass: process.env.EMAIL_PASS, // App password, not actual password
//   },
// });
// // console.log("Email User:", process.env.EMAIL_USER);
// // console.log("Email Pass:", process.env.EMAIL_PASS);


// const sendEmail = async (to, subject, html) => {
//   await transporter.sendMail({
//     from: `"College System" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;
// const nodemailer = require('nodemailer');

// const sendEmail = async (to, subject, html) => {
//     try {
//         // Create transporter
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//             port: process.env.EMAIL_PORT || 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//             tls: {
//                 rejectUnauthorized: false // For development only
//             }
//         });

//         // Send mail
//         const info = await transporter.sendMail({
//             from: `"CampusPro" <${process.env.EMAIL_USER}>`,
//             to: to,
//             subject: subject,
//             html: html
//         });

//         console.log('Email sent:', info.messageId);
//         return true;
//     } catch (error) {
//         console.error('Email error:', error);
//         // Don't throw error in production - just log it
//         return false;
//     }
// };

// module.exports = sendEmail;