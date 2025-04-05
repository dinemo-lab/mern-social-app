import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};