export const verificationEmail = (token) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 0 20px;
        }
        .email-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background-color: #2563eb;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 32px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 16px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 16px;
          font-size: 12px;
          color: #666666;
          border-top: 1px solid #eeeeee;
        }
        .text-muted {
          color: #666666;
          font-size: 14px;
        }
        .verification-code {
          background-color: #f3f4f6;
          padding: 16px;
          border-radius: 6px;
          text-align: center;
          margin: 20px 0;
          font-family: monospace;
          font-size: 18px;
          color: #111827;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-card">
          <div class="header">
            <h1>Verify Your Email Address</h1>
          </div>
          
          <div class="content">
            <p>Thank you for signing up! To complete your email verification please click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${process.env.BACKEND_URL}/users/verify-email/${token}" class="button">
                Verify Email Address
              </a>
            </div>
            
            <p class="text-muted">This link will expire in 30 minutes. If you didn't create an account with us, please ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Work-in-Progress. All rights reserved.</p>
            <p>If you have any questions, please contact <a href="mailto:support@work-in-progress.com">support@work-in-progress.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};