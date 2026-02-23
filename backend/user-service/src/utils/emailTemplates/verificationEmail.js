export const verificationEmail = (token) => {
  const verifyUrl = `${process.env.BACKEND_URL}/users/verify-email/${token}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Verification · QueueINDIA</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0"
                 style="background:#ffffff;border-radius:12px;
                 overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

            <!-- Header -->
            <tr>
              <td style="background:#111827;padding:28px;text-align:center;">
                <div style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:1px;">
                  QUEUEINDIA
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 35px;">

                <h2 style="margin:0 0 20px 0;font-size:22px;color:#111827;font-weight:600;">
                  Verify your email address
                </h2>

                <p style="margin:0 0 15px 0;color:#374151;font-size:15px;line-height:1.7;">
                  Thank you for creating your QueueINDIA account.
                </p>

                <p style="margin:0 0 25px 0;color:#4b5563;font-size:15px;line-height:1.7;">
                  Please confirm your email address by clicking the button below.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="${verifyUrl}"
                     style="display:inline-block;
                            background:#2563eb;
                            color:#ffffff;
                            padding:14px 32px;
                            border-radius:8px;
                            text-decoration:none;
                            font-size:15px;
                            font-weight:600;">
                    Verify Email
                  </a>
                </div>

                <!-- Expiry Notice -->
                <div style="
                    background:#f3f4f6;
                    border-left:4px solid #2563eb;
                    padding:14px 16px;
                    border-radius:6px;
                    margin:25px 0;
                    font-size:14px;
                    color:#374151;
                    line-height:1.6;">
                  This verification link will expire in <strong>30 minutes</strong>.
                </div>

                <!-- Fallback Link -->
                <p style="margin:20px 0 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;font-size:13px;color:#2563eb;margin-top:8px;">
                  <a href="${verifyUrl}" style="color:#2563eb;text-decoration:none;">
                    ${verifyUrl}
                  </a>
                </p>

                <p style="margin:25px 0 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
                  If you did not create this account, you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="border-top:1px solid #e5e7eb;"></td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 35px;text-align:center;font-size:12px;color:#9ca3af;line-height:1.6;">
                © ${new Date().getFullYear()} QueueINDIA. All rights reserved.<br/>
                Jalandhar, Punjab, India<br/><br/>
                This is an automated email — please do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};