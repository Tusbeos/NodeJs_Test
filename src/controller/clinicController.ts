import { Request, Response } from "express";
import clinicService from "../services/clinicService";

// Controller tạo phòng khám mới
const createNewClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await clinicService.createNewClinic(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy chi tiết phòng khám
const getDetailClinicById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await clinicService.getDetailClinicById(
      req.query.id as string,
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

// Controller lấy tất cả phòng khám
const getAllClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await clinicService.getAllClinic(req.query.limit as string);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller cập nhật phòng khám
const updateClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await clinicService.updateClinic(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller xóa phòng khám
const deleteClinic = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await clinicService.deleteClinic(req.body.id);
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
  createNewClinic,
  getDetailClinicById,
  getAllClinic,
  updateClinic,
  deleteClinic,
};
