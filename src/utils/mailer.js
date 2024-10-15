const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send verification email
const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Password Reset Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
