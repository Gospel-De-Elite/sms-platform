const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.error("❌ SMTP connection failed:", error.message);
    } else {
        console.log("✅ SMTP server ready");
    }
});

const sendVerificationEmail = async (email, firstName, otp) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Verify your email address",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${firstName},</h2>
        <p>Your email verification code is:</p>
        <h1 style="letter-spacing: 8px; color: #3b82f6; font-size: 36px;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not create an account, ignore this email.</p>
      </div>
    `,
    });
};

const sendPasswordResetEmail = async (email, firstName, otp) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Reset your password",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${firstName},</h2>
        <p>Your password reset code is:</p>
        <h1 style="letter-spacing: 8px; color: #3b82f6; font-size: 36px;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request a password reset, ignore this email.</p>
      </div>
    `,
    });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };