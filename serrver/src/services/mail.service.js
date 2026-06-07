const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendVerificationEmail = async (email, firstName, otp) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Verify your email address",
        html: `
      <h2>Hello ${firstName},</h2>
      <p>Your email verification code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not create an account, ignore this email.</p>
    `,
    });
};

const sendPasswordResetEmail = async (email, firstName, otp) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Reset your password",
        html: `
      <h2>Hello ${firstName},</h2>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request a password reset, ignore this email.</p>
    `,
    });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };