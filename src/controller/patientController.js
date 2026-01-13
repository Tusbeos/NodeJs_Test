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

module.exports = {
  patientBookAppointment: patientBookAppointment,
};
