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
          errMessage: "Thiếu dữ liệu bắt buộc",
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
        errMessage: "Tạo phòng khám thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewClinic: createNewClinic,
};
