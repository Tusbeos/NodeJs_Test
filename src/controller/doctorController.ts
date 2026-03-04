import { Request, Response } from "express";
import doctorService from "../services/doctorService";

// Controller lấy bác sĩ nổi bật
const getTopDoctorHome = async (req: Request, res: Response): Promise<any> => {
  let limit = req.query.limit;
  if (!limit) limit = "6";
  try {
    const response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy tất cả bác sĩ
const getAllDoctors = async (req: Request, res: Response): Promise<any> => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lưu thông tin bác sĩ
const saveInfoDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const response = await doctorService.saveInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy chi tiết bác sĩ theo ID
const getDetailDoctorById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const response = await doctorService.getDetailDoctorByIdService(
      req.query.id as string,
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller tạo hàng loạt lịch khám
const bulkCreateSchedule = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const response = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy lịch khám theo ngày
const getScheduleByDate = async (req: Request, res: Response): Promise<any> => {
  try {
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;
    if (!doctorId || !date) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
      });
    }
    const response = await doctorService.getScheduleByDate(doctorId, date);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller tạo hàng loạt dịch vụ bác sĩ
const bulkCreateDoctorServices = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const response = await doctorService.bulkCreateDoctorService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy danh sách dịch vụ bác sĩ
const getListDoctorServices = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await doctorService.getListDoctorServices(
      req.query.doctorId as string,
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

// Controller lấy thông tin bổ sung bác sĩ
const getExtraInfoDoctorById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await doctorService.getExtraInfoDoctorByIdService(
      req.query.doctorId as string,
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

// Controller lấy chuyên khoa theo bác sĩ
const getSpecialtiesByDoctorId = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await doctorService.getSpecialtiesByDoctorIdService(
      req.query.doctorId as string,
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

// Controller lấy bác sĩ theo chuyên khoa
const getDoctorSpecialtyById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await doctorService.getDoctorSpecialtyByIdService(req.query);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Error from the server" });
  }
};

// Controller lấy bác sĩ theo phòng khám
const getDoctorsByClinicId = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await doctorService.getDoctorsByClinicIdService(
      req.query.clinicId as string,
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

export default {
  getTopDoctorHome,
  getAllDoctors,
  saveInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  bulkCreateDoctorServices,
  getListDoctorServices,
  getExtraInfoDoctorById,
  getSpecialtiesByDoctorId,
  getDoctorSpecialtyById,
  getDoctorsByClinicId,
};
