import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

// Tạo user mới (legacy CRUD)
const createNewUser = async (data: any): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("New user created successfully!");
    } catch (err) {
      reject(err);
    }
  });
};

// Mã hóa mật khẩu
const hashUserPassword = (password: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

// Lấy tất cả user
const getAllUser = async (): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAll({ raw: true });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

// Lấy thông tin user theo ID
const getUserInfoById = (userId: string | number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        reject([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin user
const updateUserData = (data: any): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.update(data, {
        where: { id: data.id },
      });
      const allUser = await getAllUser();
      resolve(allUser);
    } catch (error) {
      reject(error);
    }
  });
};

// Xóa user theo ID
const deleteUserById = (Id: string | number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.destroy({
        where: { id: Id },
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
