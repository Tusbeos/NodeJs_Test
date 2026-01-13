import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 6;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let saveInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorByIdService(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getScheduleByDate = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let date = req.query.date;
    if (!doctorId || !date) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
      });
    }
    let response = await doctorService.getScheduleByDate(doctorId, date);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let bulkCreateDoctorServices = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateDoctorService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getListDoctorServices = async (req, res) => {
  try {
    let info = await doctorService.getListDoctorServices(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getExtraInfoDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getExtraInfoDoctorByIdService(
      req.query.doctorId
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInfoDoctor: saveInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  bulkCreateDoctorServices: bulkCreateDoctorServices,
  getListDoctorServices: getListDoctorServices,
  getExtraInfoDoctorById: getExtraInfoDoctorById,
};
