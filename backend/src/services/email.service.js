import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const SENDER_EMAIL = "onboarding@resend.dev"; // Default Resend test domain, or custom verified domain

/**
 * Send welcome email to newly registered learner
 */
export async function sendWelcomeEmail(toEmail, userName) {
  if (!resend) {
    console.log(`[Email Mock] Welcome email to ${toEmail} (${userName}) - RESEND_API_KEY not configured.`);
    return { success: false, reason: "RESEND_API_KEY_NOT_CONFIGURED" };
  }

  try {
    const data = await resend.emails.send({
      from: `NeuroLearn AI <${SENDER_EMAIL}>`,
      to: [toEmail],
      subject: "Welcome to NeuroLearn AI — Smarter Learning Awaits!",
      html: `
        <div style="font-family: sans-serif; background-color: #0F0F1A; color: #FFFFFF; padding: 32px; border-radius: 12px;">
          <h1 style="color: #4F8EF7;">Welcome, ${userName || "Learner"}!</h1>
          <p style="color: #A0A0C0; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join <strong>NeuroLearn AI</strong>. Your courses now adapt in real time to your focus, curiosity, and emotion.
          </p>
          <div style="background-color: #1A1A2E; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 10px 0; color: #5BE39A; font-weight: bold;">Quick Getting Started Tips:</p>
            <ul style="color: #DDD; margin: 0; padding-left: 20px;">
              <li>Enable your webcam for live adaptive emotion detection</li>
              <li>Browse our curated catalog of modern engineering & AI courses</li>
              <li>Check your learning analytics to monitor weekly focus trends</li>
            </ul>
          </div>
          <p style="color: #888; font-size: 13px;">
            Happy learning,<br />
            The NeuroLearn AI Team
          </p>
        </div>
      `,
    });
    console.log(`📧 Welcome email sent to ${toEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send learning session summary email after session ends
 */
export async function sendSessionSummaryEmail(toEmail, userName, sessionData) {
  if (!resend) {
    console.log(`[Email Mock] Session summary email to ${toEmail} - RESEND_API_KEY not configured.`);
    return { success: false, reason: "RESEND_API_KEY_NOT_CONFIGURED" };
  }

  const { duration, dominantEmotion, courseTitle } = sessionData;
  const minutes = Math.round(duration / 60);

  try {
    const data = await resend.emails.send({
      from: `NeuroLearn AI <${SENDER_EMAIL}>`,
      to: [toEmail],
      subject: `Your Learning Session Summary: ${courseTitle || "Course"}`,
      html: `
        <div style="font-family: sans-serif; background-color: #0F0F1A; color: #FFFFFF; padding: 32px; border-radius: 12px;">
          <h2 style="color: #4F8EF7;">Great work today, ${userName || "Learner"}!</h2>
          <p style="color: #A0A0C0; font-size: 15px;">Here is the summary of your latest adaptive session:</p>
          <div style="background-color: #1A1A2E; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Course:</strong> ${courseTitle || "Adaptive Learning Track"}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> ${minutes > 0 ? `${minutes} minute(s)` : `${duration} seconds`}</p>
            <p style="margin: 8px 0;"><strong>Dominant Emotion:</strong> <span style="color: #52B8E6; font-weight: bold; text-transform: capitalize;">${dominantEmotion || "Focused"}</span></p>
          </div>
          <p style="color: #888; font-size: 13px;">Keep up the streak and return soon for your next module!</p>
        </div>
      `,
    });
    console.log(`📧 Session summary email sent to ${toEmail}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Failed to send session summary email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}
