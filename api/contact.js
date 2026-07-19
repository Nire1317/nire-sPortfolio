import { db, admin } from '../lib/firebase-admin.js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, replace '*' with your specific domain if you want to restrict access
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Handle OPTIONS Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Accept POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Only POST requests are accepted.'
    });
  }

  try {
    // 4. Validate server configuration
    if (!process.env.RESEND_API_KEY || !process.env.FIREBASE_PROJECT_ID) {
      console.error('Server configuration error: Missing environment variables.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.'
      });
    }

    // 5. Rate Limiting Placeholder
    // TODO: Implement production rate limiting here if needed (e.g., via Vercel WAF, Upstash Redis, or Vercel KV).

    // 6. Spam Protection Placeholder
    // TODO: Integrate Turnstile (Cloudflare) or Google reCAPTCHA v3 here to prevent bot abuse.

    // 7. Payload validation
    const { name, email, subject, message } = req.body || {};

    if (!name || typeof name !== 'string' ||
        !email || typeof email !== 'string' ||
        !subject || typeof subject !== 'string' ||
        !message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Validation error.'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Validation error.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error.'
      });
    }

    // Subject length check (3-150 characters)
    if (trimmedSubject.length < 3 || trimmedSubject.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Validation error.'
      });
    }

    // Message length check (10-5000 characters)
    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Validation error.'
      });
    }

    // 8. Capture visitor metadata
    const ip = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';

    // 9. Save message to Firestore (store raw text, escaping is handled by React during rendering)
    if (!db) {
      console.error('Database connection is not initialized.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.'
      });
    }

    const contactData = {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ip,
      userAgent,
      status: 'new'
    };

    await db.collection('contacts').add(contactData);

    // 10. Send email notification using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.TO_EMAIL || 'onboarding@resend.dev';

    // Format received date neatly (e.g., "July 19, 2026 • 3:05 PM GMT+8")
    const formattedDate = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).replace(' at ', ' • ');

    const projectOrigin = process.env.FIREBASE_PROJECT_ID;

    // React-Email inspired simple and elegant layout
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #050505;
          color: #e5e5e5;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #050505;
          padding: 48px 16px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background-color: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 32px;
        }
        .header {
          display: table;
          width: 100%;
          padding-bottom: 20px;
        }
        .brand {
          display: table-cell;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          font-family: monospace, Courier;
          letter-spacing: 0.05em;
        }
        .brand-dot {
          color: #10b981;
        }
        .meta {
          display: table-cell;
          text-align: right;
          font-size: 11px;
          color: #525252;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .divider {
          border: 0;
          border-top: 1px solid #1f1f1f;
          margin: 20px 0;
        }
        .title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }
        .message-container {
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
          color: #d4d4d4;
          white-space: pre-wrap;
          margin: 0 0 28px 0;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 28px;
        }
        .details-row {
          border-bottom: 1px solid #141414;
        }
        .details-row:last-child {
          border-bottom: none;
        }
        .details-label {
          padding: 10px 0;
          font-size: 11px;
          color: #525252;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: 100px;
          font-weight: 500;
        }
        .details-value {
          padding: 10px 0;
          font-size: 13px;
          color: #a3a3a3;
        }
        .details-value a {
          color: #10b981;
          text-decoration: none;
        }
        .btn-group {
          margin-top: 24px;
        }
        .btn {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 6px;
          text-align: center;
          margin-right: 10px;
        }
        .btn-primary {
          background-color: #ffffff;
          color: #000000 !important;
          border: 1px solid #ffffff;
        }
        .btn-secondary {
          background-color: transparent;
          color: #737373 !important;
          border: 1px solid #262626;
        }
        .footer {
          margin-top: 40px;
          font-size: 11px;
          color: #525252;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          
          <!-- BRAND HEADER -->
          <table class="header" cellpadding="0" cellspacing="0">
            <tr>
              <td class="brand">ET<span class="brand-dot">.</span>PORTFOLIO</td>
              <td class="meta">Origin: ${projectOrigin}</td>
            </tr>
          </table>
          
          <hr class="divider" />
          
          <!-- INQUIRY TITLE -->
          <h1 class="title">💼 ${trimmedSubject}</h1>
          
          <!-- MESSAGE CONTENT -->
          <pre class="message-container">${trimmedMessage}</pre>
          
          <hr class="divider" />
          
          <!-- SENDER DETAILS -->
          <div>
            <table class="details-table" cellpadding="0" cellspacing="0">
              <tr class="details-row">
                <td class="details-label">From</td>
                <td class="details-value" style="color: #ffffff; font-weight: 500;">${trimmedName}</td>
              </tr>
              <tr class="details-row">
                <td class="details-label">Email</td>
                <td class="details-value"><a href="mailto:${trimmedEmail}">${trimmedEmail}</a></td>
              </tr>
              <tr class="details-row">
                <td class="details-label">Received</td>
                <td class="details-value">${formattedDate}</td>
              </tr>
              <tr class="details-row">
                <td class="details-label">Metadata</td>
                <td class="details-value" style="font-size: 12px; font-family: monospace; color: #525252;">IP: ${ip}</td>
              </tr>
            </table>
          </div>
          
          <!-- ACTIONS -->
          <div class="btn-group">
            <a href="mailto:${trimmedEmail}" class="btn btn-primary">Quick Reply</a>
            <a href="https://console.firebase.google.com/project/${projectOrigin}/firestore/databases/-default-/data/~2Fcontacts" class="btn btn-secondary" target="_blank">Manage Database</a>
          </div>
          
          <!-- FOOTER -->
          <div class="footer">
            This email was generated automatically by your portfolio contact form backend.<br />
            Powered by Vercel • Firebase • Resend
          </div>
          
        </div>
      </div>
    </body>
    </html>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: trimmedEmail,
      subject: `New Portfolio Inquiry from ${trimmedName}`,
      text: `Name: ${trimmedName}
Email: ${trimmedEmail}
Subject: ${trimmedSubject}

Message:
${trimmedMessage}

Received: ${formattedDate}
Origin: ${projectOrigin}`,
      html: htmlContent
    });

    // 11. Return success response
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.'
    });

  } catch (error) {
    // Graceful error handling
    console.error('Error handling contact form submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your message.'
    });
  }
}
