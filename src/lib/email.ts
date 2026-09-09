import { NextRequest, NextResponse } from "next/server";

export interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  from?: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

let configured = false;
let transporter: any = null;

export function configureEmail(config: EmailConfig) {
  if (configured) return;

  try {
    const nodemailer = require("nodemailer");
    transporter = nodemailer.createTransport({
      host: config.host || process.env.SMTP_HOST,
      port: config.port || Number(process.env.SMTP_PORT || 587),
      secure: config.secure || (process.env.SMTP_SECURE === "true"),
      auth: {
        user: config.user || process.env.SMTP_USER,
        pass: config.pass || process.env.SMTP_PASS,
      },
    });
    configured = true;
  } catch (error) {
    console.warn("nodemailer not installed. Email service disabled.");
  }
}

export async function sendEmail(message: EmailMessage) {
  if (!configured || !transporter) {
    console.warn("Email service is not configured. Message:", message);
    return;
  }

  try {
    await transporter.sendMail({
      from: message.from || process.env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: message.attachments,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: "Welcome to Galaxy AI Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Welcome to Galaxy AI Hub</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Galaxy AI Hub. Explore AI-powered features, discover Galaxy devices, and experience the future of mobile AI.</p>
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/ai" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: linear-gradient(90deg, #00f0ff, #2563eb); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">Try Galaxy AI</a>
      </div>
    `,
    text: `Welcome to Galaxy AI Hub, ${name}! Explore AI-powered features and Galaxy devices.`,
  });
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: number) {
  await sendEmail({
    to,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Order Confirmed</h1>
        <p>Thank you for your purchase!</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p>We'll send you shipping updates soon.</p>
      </div>
    `,
    text: `Order ${orderNumber} confirmed. Total: $${total.toFixed(2)}`,
  });
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  await sendEmail({
    to,
    subject: "Reset your Galaxy AI Hub password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Reset Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: linear-gradient(90deg, #00f0ff, #2563eb); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 16px; color: #666;">This link expires in 1 hour.</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function sendNewsletterVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/newsletter/verify?token=${token}`;
  await sendEmail({
    to,
    subject: "Verify your Galaxy AI Newsletter subscription",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Verify Your Email</h1>
        <p>Please verify your email to receive Galaxy AI updates:</p>
        <a href="${verifyUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: linear-gradient(90deg, #00f0ff, #2563eb); color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
      </div>
    `,
    text: `Verify your newsletter subscription: ${verifyUrl}`,
  });
}

