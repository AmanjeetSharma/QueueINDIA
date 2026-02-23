export const secondaryEmailOtpTemplate = (otp, userName = "there") => `
  <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" 
                 style="background:#ffffff;border-radius:12px;overflow:hidden;
                 box-shadow:0 10px 30px rgba(0,0,0,0.05);">

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
                  Verify Your Secondary Email
                </h2>

                <p style="margin:0 0 15px 0;color:#374151;font-size:15px;line-height:1.7;">
                  Hi <strong>${userName}</strong>,
                </p>

                <p style="margin:0 0 25px 0;color:#4b5563;font-size:15px;line-height:1.7;">
                  Use the verification code below to complete setup of your secondary email address.
                </p>

                <!-- OTP Box -->
                <div style="text-align:center;margin:30px 0;">
                  <div style="
                      display:inline-block;
                      padding:18px 28px;
                      background:#f9fafb;
                      border:1px solid #e5e7eb;
                      border-radius:10px;
                      font-size:30px;
                      letter-spacing:8px;
                      font-weight:700;
                      color:#111827;
                      font-family: 'Courier New', monospace;">
                    ${otp}
                  </div>
                </div>

                <!-- Security Notice -->
                <div style="
                    background:#f3f4f6;
                    border-left:4px solid #2563eb;
                    padding:14px 16px;
                    border-radius:6px;
                    margin:25px 0;
                    font-size:14px;
                    color:#374151;
                    line-height:1.6;">
                  This code will expire in <strong>10 minutes</strong>. 
                  For your security, do not share this code with anyone.
                </div>

                <p style="margin:20px 0 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
                  If you didn’t request this verification, you can safely ignore this email.
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
                © 2026 QueueINDIA. All rights reserved.<br/>
                Jalandhar, Punjab, India<br/><br/>
                This is an automated message — please do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
`;