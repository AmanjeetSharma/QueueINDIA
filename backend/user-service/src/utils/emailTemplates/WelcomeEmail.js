
const welcomeEmailHtml = (userName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to QueueINDIA</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 15px;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;letter-spacing:1px;">
                QUEUEINDIA
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 35px;text-align:center;">
              
              <h2 style="margin:0 0 15px 0;font-size:22px;color:#111827;font-weight:600;">
                Welcome, ${userName} 👋
              </h2>

              <p style="color:#4b5563;font-size:15px;line-height:1.7;margin-bottom:30px;">
                Thank you for creating an account with QueueINDIA.
                We’re excited to help you manage queues more efficiently and digitally.
              </p>

              <!-- CTA Button -->
              <a href="https://queue-india.vercel.app/login"
                 style="display:inline-block;background:#2563eb;color:#ffffff;
                 padding:14px 32px;border-radius:8px;text-decoration:none;
                 font-size:15px;font-weight:600;">
                 Login to Your Account
              </a>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #e5e7eb;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:25px 35px;text-align:center;font-size:13px;color:#6b7280;line-height:1.6;">
              
              <p style="margin:5px 0;">
                📞 +91 98765 43210 | ✉️ support@queue-india.vercel.app
              </p>

              <p style="margin:15px 0 5px 0;">
                <a href="https://queue-india.vercel.app/terms-of-service" style="color:#6b7280;text-decoration:none;margin:0 10px;">Terms & Services</a> |
                <a href="https://queue-india.vercel.app/privacy-policy" style="color:#6b7280;text-decoration:none;margin:0 10px;">Privacy-Policy</a>
              </p>

              <p style="margin-top:15px;">
                © 2026 QueueINDIA. All rights reserved.
              </p>

              <p style="font-size:11px;margin-top:10px;color:#9ca3af;">
                If you did not create this account, please ignore this email.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export default welcomeEmailHtml;