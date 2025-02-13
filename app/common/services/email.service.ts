import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

/**
 * Sends an appointment confirmation email to the user.
 * @param {string} recipientEmail - The email of the user.
 * @param {string} userName - The name of the user.
 * @param {string} appointmentDate - The appointment date.
 * @param {string} staffName - The staff member assigned.
 */
export const sendAppointmentEmail = async (
  recipientEmail: string,
  appointmentDate: string,
) => {
  try {
    const mailOptions = {
      from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Appointment Confirmation",
      html: `
        <h2>Hello,</h2>
        <p>Your appointment has been successfully scheduled with <strong></strong>.</p>
        <p><strong>Date & Time:</strong> ${appointmentDate}</p>
        <p>If you need to reschedule or cancel, please visit your dashboard.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Clinic Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Appointment confirmation email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
