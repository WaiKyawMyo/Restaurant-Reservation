import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()
// .env file or environment variables recommended for secrets!
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App Password (not regular password)
  },
  tls: {
    rejectUnauthorized: false,  
  }
});

export const sendEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: 'mumurestaurant294@gmail.com', // Use your sending address
      to: email,
      subject: "Change password OTP code",
      text: ` Hi,

      Your One-Time Password (OTP) for MuMu Restaurant is: ${otp}

      Please enter this code on the password reset page to complete the process.
      This code is valid for 5 minutes.

      If you did not request this, you can ignore this email.

      MuMu Restaurant Team`,  
      html: `
          <div style="max-width: 480px; margin:40px auto; border:1px solid #eaeaea; border-radius:8px; padding:24px; font-family:Arial,Helvetica,sans-serif; background:#fafbfc;">
            <h2 style="color: #4B6CB7; text-align:center;">MuMu Restaurant</h2>
            <p>Hi,</p>
            <p>Your password reset OTP code is:</p>
            <p style="font-size: 2em; font-weight:bold; letter-spacing: 4px; color: #2753a7; text-align: center; background: #e3ebfd; border-radius: 6px; padding: 12px 0; margin: 24px 0;">
              ${otp}
            </p>
            <p>Please enter this code on the password reset page to complete the process.</p>
            <p style="color:#636363;">This code is valid for <b>5 minutes</b>.</p>
            <hr style="border:none; border-top:1px solid #ededed; margin:32px 0;">
            <div style="font-size:0.95em;color:#888;text-align: center;">
              If you did not request this, you can safely ignore this email.<br>
              <b>MuMu Restaurant Team</b>
            </div>
          </div>
      `,
    });
    return info;
  } catch (err) {
    console.error("Error while sending mail", err);
    throw err; // Rethrow so caller can know about the error
  }
};