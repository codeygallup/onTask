const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

async function passwordRecover(to) {
    console.log(to);
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"OnTask 👻" <codey.gallup@hotmail.com>', // sender address
    to: to, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = passwordRecover;


// https://stackoverflow.com/questions/61727215/react-reset-password-send-email-with-reset-password-link-to-reset-the-password