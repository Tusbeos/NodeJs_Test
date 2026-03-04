import { Request, Response } from "express";
import patientService from "../services/patientService";

// Controller đặt lịch khám cho bệnh nhân
const patientBookAppointment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await patientService.patientBookAppointmentService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

// Controller xác nhận đặt lịch
const verifyBookAppointment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await patientService.verifyBookAppointment(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

// Controller lấy danh sách bệnh nhân theo bác sĩ
const getPatientsByDoctor = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;
    const info = await patientService.getPatientsByDoctorService(
      doctorId,
      date,
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller xác nhận hoàn tất khám
const confirmPatientBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await patientService.confirmPatientBookingService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  patientBookAppointment,
  verifyBookAppointment,
  getPatientsByDoctor,
  confirmPatientBooking,
};
