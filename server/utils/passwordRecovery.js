const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

async function passwordRecover(to, recoveryPIN) {
  // Construct the email body with the reset link
  const emailBody = `Enter the following code to change your password: ${recoveryPIN}. If you did not request a password reset, please ignore this email.`;

  console.log("🚀 ~ passwordRecover ~ emailBody:", emailBody);
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"OnTask 👻" <${process.env.FROM_EMAIL}>`,
      to: to, // list of receivers
      subject: "Password Reset", // Subject line
      text: emailBody, // plain text body
      html: `<p>${emailBody}</p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = passwordRecover;
