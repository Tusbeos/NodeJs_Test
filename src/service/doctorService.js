import { where } from "sequelize";

const db = require("../models");

let getTopDoctorHome = async (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findAll({
        limit: limit,
        order: [["createdAt", "DESC"]],
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value_En", "value_Vi"],
          },
        ],
        nest: true,
        raw: true,
      });
      resolve({ errCode: 0, data: user });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({ errCode: 0, data: doctors });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { action, doctorId, contentHTML, contentMarkdown, description } =
        inputData || {};

      if (!doctorId || !contentHTML || !contentMarkdown || !action) {
        resolve({ errCode: 1, errMessage: "Missing Parameter" });
        return;
      }
      if (action === "CREATE") {
        await db.Markdown.create({
          doctorId,
          contentHTML,
          contentMarkdown,
          description,
        });
      } else if (action === "EDIT") {
        let doctorMarkdown = await db.Markdown.findOne({
          where: { doctorId: doctorId },
          raw: false,
        });
        if (doctorMarkdown) {
          doctorMarkdown.contentHTML = contentHTML;
          doctorMarkdown.contentMarkdown = contentMarkdown;
          doctorMarkdown.description = description;
          await doctorMarkdown.save();
        }
      }
      resolve({
        errCode: 0,
        errMessage: "Save info doctor succeed",
      });
    } catch (e) {
      console.error("saveInfoDoctor ERROR:", e);
      reject(e);
    }
  });
};

let getDetailDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({ errCode: 1, errMessage: "Missing Parameter!" });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value_En", "value_Vi"],
            },
          ],
          nest: true,
          raw: false,
        });
        resolve({
          errCode: 0,
          data: data,
        });

        if (data && data.image) {
          data.image = data.image.toString("base64");
        }
        if (!data) {
          data = {};
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveInfoDoctor: saveInfoDoctor,
  getDetailDoctorByIdService: getDetailDoctorByIdService,
};
