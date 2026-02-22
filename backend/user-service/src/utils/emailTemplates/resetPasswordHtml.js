// src/utils/email/resetPassHtml.js

const resetPasswordHtml = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Password Reset Request · QueueINDIA</title>
    <style>
        /* Reset & Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Main Container */
        .email-wrapper {
            width: 100%;
            background-color: #f1f5f9;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15),
                        0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Header with Gradient */
        .header {
            padding: 32px 24px;
            background: linear-gradient(145deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
        }
        
        .header::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
            animation: shine 8s infinite;
        }
        
        .logo-wrapper {
            position: relative;
            z-index: 2;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: white;
            text-decoration: none;
            letter-spacing: -0.5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .logo-icon {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 10px;
            position: relative;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .logo-icon::after {
            content: '';
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            bottom: 8px;
            background: white;
            border-radius: 6px;
        }
        
        .logo span {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Security Badge */
        .security-badge {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 100px;
            color: white;
            font-size: 13px;
            font-weight: 500;
            margin-top: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            letter-spacing: 0.3px;
        }
        
        .security-badge::before {
            content: '🔐';
            margin-right: 6px;
            font-size: 12px;
        }
        
        /* Content Area */
        .content {
            padding: 40px 40px 32px;
        }
        
        h2 {
            color: #0f172a;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 12px;
            line-height: 1.3;
            letter-spacing: -0.02em;
        }
        
        .greeting {
            font-size: 16px;
            color: #475569;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .message {
            background: #f8fafc;
            padding: 24px;
            border-radius: 16px;
            margin: 24px 0;
            border-left: 4px solid #f59e0b;
        }
        
        p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #334155;
            line-height: 1.7;
        }
        
        p:last-child {
            margin-bottom: 0;
        }
        
        /* Expiry Info */
        .expiry-info {
            display: flex;
            align-items: center;
            gap: 16px;
            background: #f1f5f9;
            border-radius: 12px;
            padding: 16px 20px;
            margin: 24px 0;
            border: 1px solid #e2e8f0;
        }
        
        .expiry-icon {
            width: 40px;
            height: 40px;
            background: #f59e0b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .expiry-text {
            flex: 1;
        }
        
        .expiry-label {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .expiry-value {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }
        
        .expiry-value span {
            color: #f59e0b;
            background: #fef3c7;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 14px;
            margin-left: 8px;
        }
        
        /* Button Container */
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(145deg, #f59e0b, #d97706);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 20px -8px rgba(245, 158, 11, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }
        
        .button::after {
            content: '→';
            margin-left: 8px;
            transition: transform 0.2s ease;
            display: inline-block;
        }
        
        .button:hover {
            background: linear-gradient(145deg, #d97706, #b45309);
            transform: translateY(-2px);
            box-shadow: 0 15px 30px -10px rgba(245, 158, 11, 0.5);
        }
        
        .button:hover::after {
            transform: translateX(4px);
        }
        
        /* Alternative Link */
        .alt-link {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            margin: 24px 0;
            font-size: 13px;
            word-break: break-all;
        }
        
        .alt-link-label {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        
        .alt-link a {
            color: #f59e0b;
            text-decoration: none;
            font-family: 'SF Mono', 'Courier New', monospace;
            font-size: 13px;
        }
        
        .alt-link a:hover {
            text-decoration: underline;
            color: #d97706;
        }
        
        /* Security Note */
        .security-note {
            background: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0 0;
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }
        
        .note-icon {
            font-size: 24px;
            line-height: 1;
        }
        
        .note-content {
            flex: 1;
        }
        
        .note-content strong {
            color: #9a3412;
            display: block;
            margin-bottom: 4px;
            font-size: 15px;
        }
        
        .note-content p {
            font-size: 14px;
            color: #7b341e;
            margin: 0;
        }
        
        .note-content a {
            color: #f59e0b;
            font-weight: 600;
            text-decoration: none;
        }
        
        .note-content a:hover {
            text-decoration: underline;
        }
        
        /* Team Signature */
        .signature {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        
        .signature strong {
            color: #0f172a;
            font-size: 16px;
        }
        
        .signature img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 12px;
            vertical-align: middle;
        }
        
        /* Footer */
        .footer {
            padding: 32px 40px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        
        .footer-links a {
            color: #64748b;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        
        .footer-links a:hover {
            color: #f59e0b;
        }
        
        .footer-divider {
            color: #cbd5e1;
            font-size: 13px;
        }
        
        .footer p {
            font-size: 13px;
            color: #94a3b8;
            margin: 4px 0;
        }
        
        /* Animations */
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(45deg); }
            20% { transform: translateX(100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }
        
        /* Responsive */
        @media only screen and (max-width: 480px) {
            .email-wrapper {
                padding: 16px 8px;
            }
            
            .email-container {
                border-radius: 20px;
            }
            
            .header {
                padding: 24px 16px;
            }
            
            .logo {
                font-size: 24px;
            }
            
            .content {
                padding: 24px 20px;
            }
            
            h2 {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 15px;
                margin-bottom: 20px;
                padding-bottom: 20px;
            }
            
            .message {
                padding: 20px;
                margin: 20px 0;
            }
            
            p {
                font-size: 15px;
            }
            
            .expiry-info {
                flex-direction: column;
                text-align: center;
                gap: 12px;
            }
            
            .expiry-icon {
                margin: 0 auto;
            }
            
            .button {
                display: block;
                padding: 14px 24px;
                font-size: 15px;
            }
            
            .security-note {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
            
            .footer {
                padding: 24px 20px;
            }
            
            .footer-links {
                gap: 16px;
            }
            
            .footer-links a {
                font-size: 12px;
            }
        }
        
        /* Dark mode support for email clients */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0f172a;
            }
            
            .email-wrapper {
                background-color: #0f172a;
            }
            
            .email-container {
                background-color: #1e293b;
            }
            
            h2, .signature strong {
                color: #f1f5f9;
            }
            
            p, .greeting {
                color: #cbd5e1;
            }
            
            .message {
                background: #334155;
                border-left-color: #fbbf24;
            }
            
            .expiry-info {
                background: #334155;
                border-color: #475569;
            }
            
            .expiry-label {
                color: #94a3b8;
            }
            
            .expiry-value {
                color: #f1f5f9;
            }
            
            .alt-link {
                background: #334155;
                border-color: #475569;
            }
            
            .alt-link-label {
                color: #94a3b8;
            }
            
            .footer {
                background-color: #0f172a;
                border-top-color: #334155;
            }
            
            .footer p {
                color: #64748b;
            }
            
            .footer-divider {
                color: #475569;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header with Logo -->
            <div class="header">
                <div class="logo-wrapper">
                    <a href="#" class="logo">
                        <span class="logo-icon"></span>
                        Queue<span>INDIA</span>
                    </a>
                </div>
                <div class="security-badge">
                    Password Reset Request
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <h2>Reset your password</h2>
                
                <div class="greeting">
                    Hello there,
                </div>
                
                <p>We received a request to reset the password for your <strong>QueueINDIA account</strong>. To proceed with the password reset, simply click the secure button below:</p>
                
                <!-- Expiry Info Card -->
                <div class="expiry-info">
                    <div class="expiry-text">
                        <div class="expiry-label">Link expires in</div>
                        <div class="expiry-value">
                            3 minutes
                            <span>Single use only</span>
                        </div>
                    </div>
                </div>
                
                <!-- Call to Action Button -->
                <div class="button-container">
                    <a href="${resetUrl}" class="button">
                        Reset Password
                    </a>
                </div>
                
                <!-- Alternative Link (for email clients that block buttons) -->
                <div class="alt-link">
                    <div class="alt-link-label">📋 Alternative link (copy & paste)</div>
                    <a href="${resetUrl}">${resetUrl}</a>
                </div>
                
                <!-- Important Message -->
                <div class="message">
                    <p>🔒 This link is <strong>valid for 3 minutes only</strong> and can be used just once for security reasons. If you didn't request a password reset, please ignore this email.</p>
                </div>
                
                <!-- Security Note -->
                <div class="security-note">
                    <div class="note-icon">⚠️</div>
                    <div class="note-content">
                        <strong>Didn't request this?</strong>
                        <p>If you didn't initiate this request, someone else might be trying to access your account. Please contact our <a href="https://queue-india.vercel.app/contact">support team</a> immediately.</p>
                    </div>
                </div>
                
                <!-- Signature -->
                <div class="signature">
                    <p>
                        <strong>Best regards,</strong><br>
                        The QueueINDIA Security Team
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-links">
                    <a href="https://queue-india.vercel.app/privacy-policy">Privacy Policy</a>
                    <span class="footer-divider">•</span>
                    <a href="https://queue-india.vercel.app/terms-of-service">Terms of Service</a>
                    <span class="footer-divider">•</span>
                    <a href="https://queue-india.vercel.app/contact">Contact Support</a>
                </div>
                <p>© ${new Date().getFullYear()} QueueINDIA. All rights reserved.</p>
                <p style="font-size: 12px;">This is an automated security email, please do not reply.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

export default resetPasswordHtml;