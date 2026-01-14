const db = require("../models/index");
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

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
        let token = uuidv4();

        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        // Tạo Booking
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
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

let verifyBookAppointment = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            token: data.token,
            doctorId: data.doctorId,
            statusId: "S1",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update Appointment Succeed",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment not found or already verified",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  patientBookAppointmentService: patientBookAppointmentService,
  verifyBookAppointment: verifyBookAppointment,
};
