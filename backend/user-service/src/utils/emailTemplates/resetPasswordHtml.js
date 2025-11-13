// src/utils/email/resetPassHtml.js

const resetPasswordHtml = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Request</title>
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Header */
        .header {
            padding: 24px;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            text-align: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }
        
        /* Content */
        .content {
            padding: 32px;
        }
        
        h2 {
            color: #111827;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 24px;
        }
        
        p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #4b5563;
        }
        
        /* Button */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #dc2626;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.2s ease;
        }
        
        .button:hover {
            background-color: #b91c1c;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        
        /* Footer */
        .footer {
            padding: 24px;
            text-align: center;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        
        .footer a {
            color: #dc2626;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .footer a:hover {
            color: #b91c1c;
            text-decoration: underline;
        }
        
        /* Responsive */
        @media only screen and (max-width: 480px) {
            .email-container {
                width: 100% !important;
                padding: 16px;
            }

            .header {
                padding: 16px;
            }

            .content {
                padding: 16px;
            }

            h2 {
                font-size: 20px;
                margin-bottom: 16px;
            }

            p {
                font-size: 14px;
            }

            .button {
                padding: 10px 20px;
                font-size: 14px;
            }

            .footer {
                font-size: 12px;
                padding: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <a href="http://localhost:5173" class="logo">QueueINDIA</a>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>You recently requested to reset your password for your QueueINDIA account. Click the button below to reset it:</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>This link will expire after 3 minutes. If you didn't request a password reset, please ignore this email.</p>
            <p>For security reasons, if you didn't initiate this request, please contact our support team immediately.</p>
            <p>Thanks,<br><strong>The QueueINDIA Team</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} QueueINDIA. All rights reserved.</p>
            <p>
                <a href="https://queueindia.com/privacy">Privacy Policy</a> | 
                <a href="https://queueindia.com/terms">Terms of Service</a> | 
                <a href="https://queueindia.com/contact">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

export default resetPasswordHtml;