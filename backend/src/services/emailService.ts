import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendQuoteConfirmationEmail(data: {
  name: string;
  email: string;
  services: string[];
  other_service?: string;
  timeline?: string;
  budget?: string;
  project_description?: string;
  additional_notes?: string;
}): Promise<void> {
  const servicesList = data.services
    .map(s => (s === 'Other' && data.other_service ? `Other (${data.other_service})` : s))
    .join(', ');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Quote Request Received!</h2>
      <p>Dear <strong>${data.name}</strong>,</p>
      <p>Thank you for submitting your project quote request. Here's a summary:</p>
      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tr style="background:#f3f4f6;">
          <td style="padding:8px; border:1px solid #e5e7eb;"><strong>Services</strong></td>
          <td style="padding:8px; border:1px solid #e5e7eb;">${servicesList}</td>
        </tr>
        ${data.timeline ? `<tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Timeline</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${data.timeline}</td></tr>` : ''}
        ${data.budget ? `<tr style="background:#f3f4f6;"><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Budget</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${data.budget}</td></tr>` : ''}
        ${data.project_description ? `<tr><td style="padding:8px; border:1px solid #e5e7eb;"><strong>Project Description</strong></td><td style="padding:8px; border:1px solid #e5e7eb;">${data.project_description}</td></tr>` : ''}
      </table>
      <p>Our team will review your request and get back to you shortly.</p>
      <p style="color:#6b7280; font-size:0.875em;">This is an automated confirmation email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: data.email,
    subject: 'Quote Request Confirmation - We Received Your Request',
    html,
  });
}
