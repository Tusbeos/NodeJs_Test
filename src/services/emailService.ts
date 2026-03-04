import dotenv from "dotenv";
import nodemailer from "nodemailer";
import emailCommon from "./emailTemplates";
dotenv.config();

// Interface cho dữ liệu gửi email
interface EmailData {
  receiverEmail: string;
  patientName: string;
  time: string;
  doctorName: string;
  language: string;
  redirectLink: string;
}

// Gửi email xác nhận đặt lịch
const sendSimpleEmail = async (dataSend: EmailData): Promise<any> => {
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

export default {
  sendSimpleEmail,
};
module.exports = {
  sendSimpleEmail,
};
