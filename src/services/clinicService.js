const db = require("../models");

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data ||
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.imageCoverBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        return;
      }

      await db.Clinic.create({
        name: data.name,
        address: data.address,
        image: data.imageBase64,
        imageCover: data.imageCoverBase64,
        descriptionHTML: data.descriptionHTML,
        descriptionMarkdown: data.descriptionMarkdown,
      });

      resolve({
        errCode: 0,
        errMessage: "Create clinic successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailClinicById = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        return;
      }

      let clinic = await db.Clinic.findOne({
        where: { id: clinicId },
        attributes: [
          "id",
          "name",
          "address",
          "image",
          "imageCover",
          "descriptionHTML",
          "descriptionMarkdown",
        ],
      });

      if (clinic && clinic.image) {
        clinic.image = Buffer.from(clinic.image).toString("base64");
      }
      if (clinic && clinic.imageCover) {
        clinic.imageCover = Buffer.from(clinic.imageCover).toString("base64");
      }

      resolve({
        errCode: 0,
        data: clinic || {},
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinics = await db.Clinic.findAll({
        attributes: ["id", "name", "image", "address"],
      });

      if (clinics && clinics.length > 0) {
        clinics.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image).toString("base64");
          }
          return item;
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: clinics,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewClinic: createNewClinic,
  getDetailClinicById: getDetailClinicById,
  getAllClinic: getAllClinic,
};
