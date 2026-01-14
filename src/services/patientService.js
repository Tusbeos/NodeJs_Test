const db = require("../models/index");
require("dotenv").config();
import emailService from "./emailService";
let patientBookAppointmentService = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.timeType ||
        !data.fullName ||
        !data.timeString ||
        !data.doctorName
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          // redirectLink: `${process.env.URL_REACT}/verify-booking?token=${data.token}&doctorId=${data.doctorId}`,
        });
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save User Succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  patientBookAppointmentService: patientBookAppointmentService,
};
