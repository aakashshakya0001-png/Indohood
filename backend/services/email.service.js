import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER || 'bhoomii.marketing@gmail.com';
const rawPass = process.env.EMAIL_PASS || 'twfdsvtkkavzpsyd';
const pass = rawPass.replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass
  }
});

/**
 * Send 6-Digit Email Verification OTP
 */
export async function sendVerificationOtpEmail(toEmail, otpCode) {
  const mailOptions = {
    from: `"IndoHood Verification" <${user}>`,
    to: toEmail,
    subject: `🌱 Your IndoHood Verification Code: ${otpCode}`,
    text: `Welcome to IndoHood! Your 6-digit email verification code is: ${otpCode}. This code will expire in 10 minutes. If you did not request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf8; margin: 0; padding: 20px; color: #1c1917; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
          .sublogo { font-size: 13px; opacity: 0.9; margin-top: 4px; }
          .body { padding: 32px 28px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #57534e; margin-bottom: 24px; }
          .code-box { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .code-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #166534; font-weight: 700; margin-bottom: 8px; }
          .code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #047857; font-family: 'Courier New', monospace; }
          .expiry { font-size: 12px; color: #65a30d; margin-top: 6px; font-weight: 600; }
          .footer { background: #fafaf9; padding: 20px 28px; text-align: center; border-top: 1px solid #f5f5f4; font-size: 11px; color: #a8a29e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 IndoHood</h1>
            <div class="sublogo">Decentralized Smart Waste & Clean Civic Ecosystem</div>
          </div>
          <div class="body">
            <h2 class="title">Verify Your Email Address</h2>
            <p class="text">Thank you for joining IndoHood. To complete your resident registration and activate your civic green account, enter the 6-digit verification code below:</p>
            <div class="code-box">
              <div class="code-label">Verification Code</div>
              <div class="code">${otpCode}</div>
              <div class="expiry">⏱️ Valid for 10 minutes</div>
            </div>
            <p class="text" style="font-size: 12px; margin-bottom: 0;">
              If you didn't create an IndoHood account, you can safely disregard this email. Never share your verification code with anyone.
            </p>
          </div>
          <div class="footer">
            © 2026 IndoHood Civic Initiative. Powered by Amazon Bedrock & AWS Cloud.
          </div>
        </div>
      </body>
      </html>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email Service] Sent verification OTP to ${toEmail}. Message ID: ${info.messageId}`);
  return info;
}

/**
 * Send Password Reset Link & Reset OTP
 */
export async function sendPasswordResetEmail(toEmail, resetToken, resetOtp) {
  const resetUrl = `https://main.d2amzlu3gcfulj.amplifyapp.com/?resetToken=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  const mailOptions = {
    from: `"IndoHood Security" <${user}>`,
    to: toEmail,
    subject: `🔐 Reset Your IndoHood Password`,
    text: `You requested a password reset for your IndoHood account. Click this link to reset your password: ${resetUrl} or enter this Reset Code: ${resetOtp}. This link is valid for 15 minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf8; margin: 0; padding: 20px; color: #1c1917; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
          .sublogo { font-size: 13px; opacity: 0.9; margin-top: 4px; }
          .body { padding: 32px 28px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #57534e; margin-bottom: 24px; }
          .button-wrap { text-align: center; margin: 28px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); }
          .code-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin-top: 20px; }
          .code-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
          .code { font-size: 24px; font-weight: 800; letter-spacing: 4px; color: #334155; font-family: monospace; }
          .footer { background: #fafaf9; padding: 20px 28px; text-align: center; border-top: 1px solid #f5f5f4; font-size: 11px; color: #a8a29e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 IndoHood</h1>
            <div class="sublogo">Account Security & Password Recovery</div>
          </div>
          <div class="body">
            <h2 class="title">Reset Your Password</h2>
            <p class="text">We received a request to reset the password for your IndoHood account. Click the button below to choose a new password:</p>
            <div class="button-wrap">
              <a href="${resetUrl}" class="button" target="_blank">Reset My Password</a>
            </div>
            <div class="code-box">
              <div class="code-label">Or Use Direct Reset Code</div>
              <div class="code">${resetOtp}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Valid for 15 minutes</div>
            </div>
            <p class="text" style="font-size: 12px; margin-top: 24px; margin-bottom: 0;">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
          <div class="footer">
            © 2026 IndoHood Civic Initiative. Powered by Amazon Bedrock & AWS Cloud.
          </div>
        </div>
      </body>
      </html>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email Service] Sent password reset email to ${toEmail}. Message ID: ${info.messageId}`);
  return info;
}

export default {
  sendVerificationOtpEmail,
  sendPasswordResetEmail,
  transporter
};
