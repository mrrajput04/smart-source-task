const nodemailer = require('nodemailer');
const generateRandomPassword = require('./services');

const transporter = nodemailer.createTransport({
    // Configure your email service
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const sendPasswordEmail = async (email, firstName, lastName, phoneNumber) => {
    // Generate random password
    const password = generateRandomPassword(firstName, lastName, phoneNumber, 10)
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for creating your account!',
      text: `Welcome! ${firstName} ${lastName}, email: ${email} phone no ${phoneNumber} Your password is: ${password}.`
    };
  
    await transporter.sendMail(mailOptions);
    return password;
  };
  
  module.exports = { sendPasswordEmail };