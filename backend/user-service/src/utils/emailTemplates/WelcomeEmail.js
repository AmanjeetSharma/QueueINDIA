// src/utils/email/welcomeEmailHtml.js

const welcomeEmailHtml = (userName) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Queue India</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7fb;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .content-wrapper {
            background-color: #ffffff;
            margin: 8px;
            border-radius: 20px;
            overflow: hidden;
        }

        /* Header with Indian theme */
        .header {
            background: linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);
            padding: 40px 30px 30px;
            text-align: center;
            position: relative;
            border-bottom: 4px solid #000080;
        }

        .header h1 {
            color: #000080;
            font-size: 36px;
            font-weight: 800;
            margin: 10px 0;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .welcome-badge {
            background: linear-gradient(135deg, #000080, #0000b3);
            color: white;
            padding: 10px 28px;
            border-radius: 50px;
            display: inline-block;
            font-size: 18px;
            font-weight: 600;
            margin-top: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 128, 0.3);
        }

        /* Main content */
        .main-content {
            padding: 40px 30px;
            text-align: center;
        }

        .greeting {
            font-size: 32px;
            color: #1a1a1a;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .message {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
            max-width: 450px;
            margin-left: auto;
            margin-right: auto;
        }

        /* CTA Button */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF9933, #FF6B6B);
            color: white;
            text-decoration: none;
            padding: 16px 42px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 18px;
            margin: 25px 0;
            box-shadow: 0 15px 25px -8px rgba(255, 153, 51, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 30px -8px rgba(255, 153, 51, 0.6);
        }

        /* Quick Links Section */
        .quick-links-section {
            background: linear-gradient(135deg, #f8fafc, #eef2f6);
            padding: 30px;
            border-radius: 16px;
            margin: 30px 0;
        }

        .section-title {
            color: #000080;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .quick-links-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }

        .quick-link-item {
            background: white;
            padding: 12px 8px;
            border-radius: 12px;
            text-decoration: none;
            color: #2d3748;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
            display: block;
        }

        .quick-link-item:hover {
            background: #000080;
            color: white;
            transform: translateY(-2px);
            border-color: #000080;
        }

        /* Divider */
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
            margin: 30px 0;
        }

        /* Footer links */
        .footer-links {
            background: #1e293b;
            padding: 40px 30px 30px;
            text-align: center;
        }

        .contact-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 25px;
            border-radius: 16px;
            margin: 0 0 25px 0;
            backdrop-filter: blur(10px);
        }

        .contact-item {
            display: inline-block;
            margin: 0 15px;
            color: #e2e8f0;
            font-size: 14px;
            line-height: 2;
        }

        .contact-item:not(:last-child)::after {
            content: "•";
            margin-left: 15px;
            color: #FF9933;
        }

        /* Social links */
        .social-links {
            margin: 30px 0;
        }

        .social-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 50%;
            margin: 0 6px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .social-icon:hover {
            background: #FF9933;
            transform: translateY(-3px);
            border-color: #FF9933;
        }

        /* Legal links */
        .legal-links {
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .legal-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 12px;
            font-size: 13px;
            transition: color 0.3s ease;
            display: inline-block;
            line-height: 2;
        }

        .legal-links a:hover {
            color: #FF9933;
        }

        .legal-links span.separator {
            color: #475569;
        }

        .copyright {
            margin-top: 25px;
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
        }

        .heart {
            color: #FF9933;
            display: inline-block;
            animation: heartbeat 1.5s ease infinite;
        }

        @keyframes heartbeat {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.1);
            }
        }

        .india-flag {
            display: inline-block;
            margin-left: 5px;
        }

        /* Unsubscribe */
        .unsubscribe {
            margin-top: 20px;
            font-size: 11px;
            color: #64748b;
        }

        .unsubscribe a {
            color: #94a3b8;
            text-decoration: underline;
            text-decoration-style: dotted;
        }

        .unsubscribe a:hover {
            color: #FF9933;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .feature-card {
                width: 100%;
            }

            .header h1 {
                font-size: 28px;
            }

            .greeting {
                font-size: 26px;
            }

            .contact-item {
                display: block;
                margin: 10px 0;
            }

            .contact-item:not(:last-child)::after {
                content: none;
            }

            .quick-links-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .legal-links a {
                display: block;
                margin: 10px 0;
            }

            .legal-links span.separator {
                display: none;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="content-wrapper">
            <!-- Header -->
            <div class="header">
                <h1>🇮🇳 QUEUE INDIA</h1>
                <div class="welcome-badge">Welcome Aboard! 🎉</div>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="greeting">
                    Namaste, <span>${userName} </span>! 👋
                </div>

                <div class="message">
                    Thank you for registering with Queue India! We're thrilled to have you join our community.
                    Get ready to experience seamless queue management like never before.
                </div>


                <!-- CTA Button -->
                <a href="https://queue-india.vercel.app/login" class="cta-button">
                    🚀 Login to Your Account
                </a>

            </div>

            <!-- Footer with Links -->
            <div class="footer-links">
                <!-- Contact Information -->
                <div class="contact-info">
                    <div class="contact-item">📞 +91 98765 43210</div>
                    <div class="contact-item">✉️ support@queue-india.vercel.app</div>
                    <div class="contact-item">🏢 Jalandhar, Punjab, India</div>
                </div>

                <!-- Important Links -->
                <div style="margin: 25px 0;">
                    <a href="https://queue-india.vercel.app"
                        style="color: #e2e8f0; text-decoration: none; margin: 0 15px; font-size: 14px;">🏠 Home</a>
                    <a href="https://queue-india.vercel.app/about"
                        style="color: #e2e8f0; text-decoration: none; margin: 0 15px; font-size: 14px;">ℹ️ About</a>
                    <a href="https://queue-india.vercel.app/contact"
                        style="color: #e2e8f0; text-decoration: none; margin: 0 15px; font-size: 14px;">📞 Contact</a>
                    <a href="https://queue-india.vercel.app/departments"
                        style="color: #e2e8f0; text-decoration: none; margin: 0 15px; font-size: 14px;">🏛️
                        Departments</a>
                </div>

                <!-- Legal Links with correct paths -->
                <div class="legal-links">
                    <a href="https://queue-india.vercel.app/terms-of-service">Terms of Service</a>
                    <span class="separator">•</span>
                    <a href="https://queue-india.vercel.app/privacy-policy">Privacy Policy</a>
                </div>

                <!-- Copyright -->
                <div class="copyright">
                    © 2026 QueueINDIA. All rights reserved.<br>
                    Made with <span class="heart">❤️</span> in India <span class="india-flag">🇮🇳</span>
                </div>

                <!-- Unsubscribe -->
                <div class="unsubscribe">
                    If you didn't register for Queue India, please ignore this email.<br>
                    <a href="#">Unsubscribe</a> from marketing emails
                </div>
            </div>
        </div>
    </div>
</body>

</html>
`;

export default welcomeEmailHtml;