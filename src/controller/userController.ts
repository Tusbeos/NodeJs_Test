import { Request, Response } from "express";
import userService from "../services/userService";

// Controller xử lý đăng nhập
const handleLogin = async (req: Request, res: Response): Promise<any> => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameters",
    });
  }
  const userData = await userService.handleUserLogin(email, password);
  console.log("userData: ", userData);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

// Controller lấy tất cả user
const handleGetAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters",
        users: [],
      });
    }

    const users = await userService.getAllUsers(id);

    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      users: users,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller tạo user mới
const handleCreateNewUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

// Controller xóa user
const handleDeleteUser = async (req: Request, res: Response): Promise<any> => {
  const id = req.body.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  const message = await userService.deleteUser(id);
  return res.status(200).json(message);
};

// Controller cập nhật user
const handleEditUser = async (req: Request, res: Response): Promise<any> => {
  const data = req.body;
  const message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

// Controller lấy allcode
const getAllCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await userService.getAllCodeService(req.query.type as string);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Get all code:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Err from server",
    });
  }
};

export default {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
