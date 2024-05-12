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
  // Construct the reset link using the recovery token
  // const resetLink = `http://localhost:3000/reset?user=${to}&token=${recoveryToken}`;

  // console.log("🚀 ~ passwordRecover ~ resetLink:", resetLink)
  // Construct the email body with the reset link
  const emailBody = `Enter the following code to change your password: ${recoveryPIN}. If you did not request a password reset, please ignore this email.`;

  console.log("🚀 ~ passwordRecover ~ emailBody:", emailBody);
  // send mail with defined transport object
  // const info = await transporter.sendMail({
  //   from: '"OnTask 👻" <codey.gallup@hotmail.com>', // sender address
  //   to: to, // list of receivers
  //   subject: "Password Reset", // Subject line
  //   text: emailBody, // plain text body
  //   html: `<p>${emailBody}</p>`, // html body
  // });

  // console.log("Message sent: %s", info.messageId);
}

module.exports = passwordRecover;

// https://stackoverflow.com/questions/61727215/react-reset-password-send-email-with-reset-password-link-to-reset-the-password
