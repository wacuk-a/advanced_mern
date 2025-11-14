import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmergencySMS(to: string, message: string): Promise<void> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('Twilio credentials not configured, SMS not sent');
      return;
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    logger.info(`Emergency SMS sent to ${to}`);
  } catch (error) {
    logger.error('Failed to send emergency SMS:', error);
    throw error;
  }
}

export async function sendEmergencyEmail(to: string, subject: string, message: string): Promise<void> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('SMTP credentials not configured, email not sent');
      return;
    }

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #d32f2f;">🚨 EMERGENCY ALERT</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This is an automated emergency alert from SilentVoice+
        </p>
      </div>`
    });

    logger.info(`Emergency email sent to ${to}`);
  } catch (error) {
    logger.error('Failed to send emergency email:', error);
    throw error;
  }
}

export async function sendPushNotification(deviceToken: string, title: string, body: string, data?: any): Promise<void> {
  // This would integrate with FCM (Firebase Cloud Messaging) or similar
  // For now, just log it
  logger.info(`Push notification would be sent to ${deviceToken}: ${title} - ${body}`);
}

