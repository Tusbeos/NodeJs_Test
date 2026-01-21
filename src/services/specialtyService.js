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

let updateSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
        return;
      }

      const specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (!specialty) {
        resolve({
          errCode: 2,
          errMessage: "Specialty not found",
        });
        return;
      }

      if (data.name) specialty.name = data.name;
      if (data.descriptionHTML)
        specialty.descriptionHTML = data.descriptionHTML;
      if (data.descriptionMarkdown)
        specialty.descriptionMarkdown = data.descriptionMarkdown;
      if (data.imageBase64) specialty.image = data.imageBase64;

      await specialty.save();

      resolve({
        errCode: 0,
        errMessage: "Update specialty successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteSpecialty = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
        return;
      }

      await db.Doctor_Clinic_Specialty.destroy({
        where: { specialtyId },
      });

      const result = await db.Specialty.destroy({
        where: { id: specialtyId },
      });

      if (!result) {
        resolve({
          errCode: 2,
          errMessage: "Specialty not found",
        });
        return;
      }

      resolve({
        errCode: 0,
        errMessage: "Delete specialty successfully",
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
  updateSpecialty: updateSpecialty,
  deleteSpecialty: deleteSpecialty,
};
