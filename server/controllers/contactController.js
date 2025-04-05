import nodemailer from "nodemailer";

export const handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use other services like Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: process.env.EMAIL_USER, // Replace with your email to receive messages
      subject: `Contact Form Submission: ${subject}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send your message. Please try again later." });
  }
};