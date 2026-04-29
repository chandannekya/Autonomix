import { createTransport } from "nodemailer";

// Notice the curly braces added around to, subject, and body
export const sendEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<string> => {
  console.log("EMAIL", process.env.MAIL_USER);
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  try {
    console.log(to, body, subject, "mail object");
    console.log("Attempting to dispatch email via Gmail SMTP...");
    const info = await transporter.sendMail({
      from: `"AutonomiX Agent" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text: body,
    });
    console.log("SMTP Delivery Success! Message ID:", info.messageId);
    console.log("SMTP Response:", info.response);

    return `Email sent successfully to ${to}`;
  } catch (error) {
    const err = error as Error;
    console.error("SMTP Delivery Failed!", err);
    return `Email sending failed: ${err.message}`;
  }
};
