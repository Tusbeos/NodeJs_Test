import { Request, Response } from "express";
import specialtyService from "../services/specialtyService";

// Controller tạo chuyên khoa mới
const createNewSpecialty = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const info = await specialtyService.createNewSpecialty(req.body);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy tất cả chuyên khoa
const getAllSpecialty = async (req: Request, res: Response): Promise<any> => {
  try {
    const specialties = await specialtyService.getAllSpecialty(
      req.query.limit as string,
    );
    return res.status(200).json(specialties);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller lấy chuyên khoa theo danh sách ID
const getSpecialtyByIds = async (req: Request, res: Response): Promise<any> => {
  try {
    const ids = req.query.ids as string;
    const specialties = await specialtyService.getSpecialtyByIds(ids);
    return res.status(200).json(specialties);
  } catch (e) {
    return res.status(200).json({
      errCode: 1,
      message: "Lỗi từ server",
    });
  }
};

// Controller cập nhật chuyên khoa
const updateSpecialty = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await specialtyService.updateSpecialty(req.body);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller xóa chuyên khoa
const deleteSpecialty = async (req: Request, res: Response): Promise<any> => {
  try {
    const info = await specialtyService.deleteSpecialty(req.body.id);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

export default {
  createNewSpecialty,
  getAllSpecialty,
  getSpecialtyByIds,
  updateSpecialty,
  deleteSpecialty,
};
