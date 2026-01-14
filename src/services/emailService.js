require("dotenv").config();
import nodemailer from "nodemailer";
const emailCommon = require("./emailTemplates");
let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: '"Booking Care" <Biconghi123@gmail.com>',
      to: dataSend.reciverEmail,
      subject: "Thông tin Đặt lịch khám bệnh",
      html: emailCommon.getBookingEmailTemplate(dataSend),
    });

    console.log("Message sent:", info.messageId);
  })();
};

module.exports = {
  sendSimpleEmail,
};
