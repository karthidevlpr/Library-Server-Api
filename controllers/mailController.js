import nodemailer from "nodemailer"

let testAccount = nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: testAccount.user, // generated ethereal user
    pass: testAccount.pass, // generated ethereal password
  },
});

export const mailNotification = async (mailInfo) => {
  const {to, subject, text, html} = mailInfo
  const mailOption = {
    from: testAccount.user, // sender address
    to: to,
    subject: subject,
    html: html,
  }
  try {
    const info = await transporter.sendMail(mailOption)
    console.info('Email sent: ' + info.response);
    console.info(info);
  } catch (error) {
    console.error('Email sent: ' + error);
  }
}