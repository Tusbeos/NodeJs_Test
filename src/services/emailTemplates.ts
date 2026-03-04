// Interface cho dữ liệu email template
interface EmailTemplateData {
  patientName: string;
  time: string;
  doctorName: string;
  language: string;
  redirectLink: string;
}

// Template HTML cho email xác nhận đặt lịch (hỗ trợ tiếng Việt và tiếng Anh)
const getBookingEmailTemplate = (dataSend: EmailTemplateData): string => {
  let result = "";

  const language = dataSend.language;

  if (language === "en") {
    result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care.</p>
        <p>Information to schedule an appointment:</p>
        <div>
            <b>Time: ${dataSend.time}</b>
        </div>
        <div>
            <b>Doctor: ${dataSend.doctorName}</b>
        </div>
        <p>If the above information is correct, please click on the link below to confirm and complete the procedure.</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>
        <div>Sincerely thank you!</div>
    `;
  }

  if (language === "vi") {
    result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>
            <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
            <b>Bác sĩ: ${dataSend.doctorName}</b>
        </div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
    `;
  }

  return result;
};

export default {
  getBookingEmailTemplate,
};
module.exports = {
  getBookingEmailTemplate,
};
