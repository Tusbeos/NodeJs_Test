const db = require("../models");
const { Op } = require("sequelize");

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialties = await db.Specialty.findAll();
      if (specialties && specialties.length > 0) {
        specialties.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image).toString("base64");
          }
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data: specialties,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getSpecialtyByIds = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ids) {
        resolve({
          errCode: 1,
          message: "Thiếu danh sách ID chuyên khoa",
        });
        return;
      }

      const idArr = String(ids)
        .split(",")
        .map((item) => Number(item))
        .filter((item) => item);

      if (!idArr || idArr.length === 0) {
        resolve({
          errCode: 1,
          message: "Danh sách ID không hợp lệ",
        });
        return;
      }

      let specialties = await db.Specialty.findAll({
        where: { id: { [Op.in]: idArr } },
      });

      if (specialties && specialties.length > 0) {
        specialties = specialties.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image).toString("base64");
          }
          return item;
        });
      }

      resolve({
        errCode: 0,
        message: "OK",
        data: specialties || [],
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewSpecialty: createNewSpecialty,
  getAllSpecialty: getAllSpecialty,
  getSpecialtyByIds: getSpecialtyByIds,
};
