import db from "../models/index";
import dotenv from "dotenv";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

// Tạo URL xác nhận email
const buildUrlEmail = (doctorId: string | number, token: string): string => {
  const result = `${process.env.URL_REACT_APP}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

// Đặt lịch khám bệnh cho bệnh nhân
const patientBookAppointmentService = async (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hasFullName = !!data.fullName;
      const hasSplitName = !!data.firstName && !!data.lastName;
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.timeType ||
        (!hasFullName && !hasSplitName) ||
        !data.timeString ||
        !data.doctorName
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
        const token = uuidv4();
        const patientName = hasFullName
          ? data.fullName
          : `${data.lastName || ""} ${data.firstName || ""}`.trim();

        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: patientName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        const user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            firstName: data.firstName || null,
            lastName: data.lastName || null,
          },
        });

        if (user && user[0]) {
          // Cập nhật thêm thông tin bệnh nhân nếu có
          if (data.firstName) user[0].firstName = data.firstName;
          if (data.lastName) user[0].lastName = data.lastName;
          if (data.gender) user[0].gender = data.gender;
          if (data.phoneNumber) user[0].phoneNumber = data.phoneNumber;
          if (data.address) user[0].address = data.address;
          await user[0].save();

          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
              birthday: data.birthday || null,
              reason: data.reason || null,
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

// Xác nhận lịch khám từ email
const verifyBookAppointment = async (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
        const appointment = await db.Booking.findOne({
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

// Lấy danh sách bệnh nhân theo bác sĩ và ngày
const getPatientsByDoctorService = (
  doctorId: string | number,
  date: string,
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
        return;
      }

      const bookings = await db.Booking.findAll({
        where: {
          doctorId: doctorId,
          date: date,
        },
        include: [
          {
            model: db.User,
            as: "patientData",
            attributes: ["email", "firstName", "lastName", "phoneNumber"],
          },
          {
            model: db.AllCode,
            as: "bookingTimeTypeData",
            attributes: ["value_Vi", "value_En"],
          },
        ],
        order: [["createdAt", "DESC"]],
        raw: false,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: bookings || [],
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xác nhận hoàn tất khám cho bệnh nhân
const confirmPatientBookingService = (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.bookingId) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
        return;
      }

      const booking = await db.Booking.findOne({
        where: { id: data.bookingId },
        raw: false,
      });

      if (!booking) {
        resolve({
          errCode: 2,
          errMessage: "Booking not found",
        });
        return;
      }

      if (data.doctorId && +booking.doctorId !== +data.doctorId) {
        resolve({
          errCode: 3,
          errMessage: "Invalid doctor",
        });
        return;
      }

      booking.statusId = data.statusId || "S3";
      await booking.save();

      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  patientBookAppointmentService,
  verifyBookAppointment,
  getPatientsByDoctorService,
  confirmPatientBookingService,
};
module.exports = {
  patientBookAppointmentService,
  verifyBookAppointment,
  getPatientsByDoctorService,
  confirmPatientBookingService,
};
