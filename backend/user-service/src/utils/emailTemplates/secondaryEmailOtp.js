export const secondaryEmailOtpTemplate = (otp, userName = "there") => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f9fc;">
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; margin-bottom: 20px;">
      <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; padding: 24px; text-align: center;">
        <div style="font-weight: 700; font-size: 20px; margin-bottom: 8px;">QueueIndia</div>
        <h1 style="margin: 0; font-weight: 500;">Verify Your Secondary Email</h1>
      </div>
      
      <div style="padding: 24px;">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>To complete setting up your secondary email, please use the following one-time verification code:</p>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin: 20px 0; background-color: #f8f9fa; border-radius: 8px; padding: 16px; border: 1px solid #e9ecef;">
          <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; color: #2c3e50; font-family: 'Courier New', monospace;">${otp}</div>
        </div>
        
        <div style="background-color: #e8f4fd; border-left: 4px solid #4a6ee0; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0;">This code is valid for <span style="color: #e74c3c; font-weight: 600;">10 minutes</span>. Do not share this code with anyone.</p>
        </div>
        
        <p>If you didn't request this verification, you can safely ignore this email.</p>
        
        <div style="height: 1px; background: linear-gradient(to right, transparent, #e9ecef, transparent); margin: 24px 0;"></div>
        
      </div>
      
      <div style="font-size: 12px; color: #6c757d; text-align: center; padding: 16px; border-top: 1px solid #e9ecef; margin-top: 24px;">
        <p style="margin: 0;">© 2023 QueueIndia • Do not reply to this automated email</p>
        <p style="margin: 8px 0 0 0;">Jalandhar, Punjab, India</p>
      </div>
    </div>
  </div>
`;
