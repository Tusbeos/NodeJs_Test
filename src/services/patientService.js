const db = require("../models/index");
require("dotenv").config();

let patientBookAppointmentService = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.date || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
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
              data: data.date,
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
