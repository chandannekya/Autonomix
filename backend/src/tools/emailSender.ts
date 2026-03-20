import { createTransport } from "nodemailer";

export const sendEmail = async (
  userMail: string,
  message: string,
  subject: string,
): Promise<string> => {
  const transporter = createTransport({
    service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: `"AutonomiX Agent" <${process.env.MAIL_USER}>`,
      to: userMail,
      subject,
      body: message,
    });

    return `Email sent successfully to ${userMail}`;
  } catch (error) {
    const err = error as Error;
    return `Email sending failed: ${err.message}`;
  }
};
