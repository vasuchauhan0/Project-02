const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Portfolio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email service error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send HTML email template
exports.sendHtmlEmail = async ({ to, subject, heading, content, buttonText, buttonUrl }) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px;
        }
        .content h2 {
          color: #667eea;
          margin-top: 0;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Portfolio</h1>
        </div>
        <div class="content">
          <h2>${heading}</h2>
          <p>${content}</p>
          ${buttonText && buttonUrl ? `
            <a href="${buttonUrl}" class="button">${buttonText}</a>
          ` : ''}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await this.sendEmail({
    to,
    subject,
    html: htmlTemplate
  });
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  return await this.sendHtmlEmail({
    to: user.email,
    subject: 'Welcome to Portfolio!',
    heading: `Welcome, ${user.name}!`,
    content: 'Thank you for registering with us. We\'re excited to have you on board!',
    buttonText: 'Visit Dashboard',
    buttonUrl: `${process.env.FRONTEND_URL}/dashboard`
  });
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetUrl) => {
  return await this.sendHtmlEmail({
    to: user.email,
    subject: 'Password Reset Request',
    heading: 'Reset Your Password',
    content: `You requested a password reset. Click the button below to reset your password. This link will expire in 1 hour. If you didn't request this, please ignore this email.`,
    buttonText: 'Reset Password',
    buttonUrl: resetUrl
  });
};
