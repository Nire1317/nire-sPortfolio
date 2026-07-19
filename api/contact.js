import { db, admin } from "../lib/firebase-admin.js";
import { Resend } from "resend";

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // In production, replace '*' with your specific domain if you want to restrict access
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // 2. Handle OPTIONS Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 3. Accept POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Only POST requests are accepted.",
    });
  }

  try {
    // 4. Validate server configuration
    if (!process.env.RESEND_API_KEY || !process.env.FIREBASE_PROJECT_ID) {
      console.error("Server configuration error: Missing environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    // 5. Rate Limiting Placeholder
    // TODO: Implement production rate limiting here if needed (e.g., via Vercel WAF, Upstash Redis, or Vercel KV).
    // In-memory cache is not reliable on Vercel because functions are stateless and run in isolated, ephemeral instances.

    // 6. Spam Protection Placeholder
    // TODO: Integrate Turnstile (Cloudflare) or Google reCAPTCHA v3 here to prevent bot abuse.

    // 7. Payload validation
    const { name, email, subject, message } = req.body || {};

    if (
      !name ||
      typeof name !== "string" ||
      !email ||
      typeof email !== "string" ||
      !subject ||
      typeof subject !== "string" ||
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    // Subject length check (3-150 characters)
    if (trimmedSubject.length < 3 || trimmedSubject.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    // Message length check (10-5000 characters)
    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    // 8. Capture visitor metadata
    const ip = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.headers["x-real-ip"] || req.socket.remoteAddress || "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    // 9. Save message to Firestore (store raw text, escaping is handled by React during rendering)
    if (!db) {
      console.error("Database connection is not initialized.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
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
      status: "new",
    };

    await db.collection("contacts").add(contactData);

    // 10. Send email notification using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.TO_EMAIL || "ashertuzon@gmail.com";

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: trimmedEmail,
      subject: "New Portfolio Contact",
      text: `Name: ${trimmedName}
Email: ${trimmedEmail}
Subject: ${trimmedSubject}

Message:
${trimmedMessage}

Sent At: ${new Date().toISOString()}`,
    });

    // 11. Return success response
    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    // Graceful error handling - logs error internally but never exposes details to client
    console.error("Error handling contact form submission:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your message.",
    });
  }
}
