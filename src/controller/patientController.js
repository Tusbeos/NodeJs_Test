let patientService = require("../services/patientService");

let patientBookAppointment = async (req, res) => {
  try {
    let info = await patientService.patientBookAppointmentService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let verifyBookAppointment = async (req, res) => {
  try {
    let info = await patientService.verifyBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getPatientsByDoctor = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let date = req.query.date;
    let info = await patientService.getPatientsByDoctorService(doctorId, date);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  patientBookAppointment: patientBookAppointment,
  verifyBookAppointment: verifyBookAppointment,
  getPatientsByDoctor: getPatientsByDoctor,
};
