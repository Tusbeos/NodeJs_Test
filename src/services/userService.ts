import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// Interface cho response login
interface UserData {
  errCode: number;
  message: string;
  user?: any;
}

// Xử lý đăng nhập
const handleUserLogin = (
  email: string,
  password: string,
): Promise<UserData> => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData: UserData = { errCode: 0, message: "" };

      const isExist = await checkUserEmail(email);
      if (isExist) {
        const user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          const check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.message = "Ok";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.message = "Wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.message = "User not found";
        }
      } else {
        userData.errCode = 1;
        userData.message =
          "Your email isn't in our system. Please try another email!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

// Kiểm tra email đã tồn tại chưa
const checkUserEmail = (email: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (user) resolve(true);
      else resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả user hoặc user theo ID
const getAllUsers = async (userId: string): Promise<any> => {
  try {
    if (userId === "ALL") {
      return await db.User.findAll({
        attributes: { exclude: ["password"] },
      });
    }
    if (userId) {
      return await db.User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
      });
    }
    return null;
  } catch (e) {
    throw e;
  }
};

// Tạo user mới
const createNewUser = (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used, please try another email",
        });
      } else {
        const hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar
            ? Buffer.from(data.avatar.split(",")[1], "base64")
            : null,
        });
        resolve({
          errCode: 0,
          message: "Create new user succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa user
const deleteUser = (userId: string | number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        resolve({
          errCode: 2,
          message: `The user isn't exist`,
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        message: "The user is deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật thông tin user
const updateUserData = (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          message: "Missing required parameters!",
        });
      }
      const user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        if (data.avatar) {
          let base64 = data.avatar;
          if (base64.startsWith("data:")) {
            base64 = base64.split(",")[1];
          }
          if (base64) {
            user.image = Buffer.from(base64, "base64");
          }
        }
        await user.save();
        resolve({
          errCode: 0,
          message: "Update the user succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          message: `User's not found!`,
        });
      }
    } catch (e) {
      reject(e);
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

// Lấy danh sách AllCode theo type
const getAllCodeService = (typeInput: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const result: any = {};
        const allCode = await db.AllCode.findAll({
          where: { type: typeInput },
        });
        result.errCode = 0;
        result.data = allCode;
        resolve(result);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
