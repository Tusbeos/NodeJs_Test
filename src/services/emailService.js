require("dotenv").config();
const nodemailer = require("nodemailer");
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
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Booking Care" <Biconghi123@gmail.com>',
      to: dataSend.receiverEmail,
      subject:
        dataSend.language === "vi"
          ? "Thông tin đặt lịch khám bệnh"
          : "Booking appointment information",
      html: emailCommon.getBookingEmailTemplate(dataSend),
    });
    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Lỗi gửi email:", error);
    return null;
  }
};

module.exports = {
  sendSimpleEmail,
};
