import db from "../models/index";

// Tạo phòng khám mới
const createNewClinic = (data: any): Promise<any> => {
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

// Lấy chi tiết phòng khám theo ID
const getDetailClinicById = (clinicId: string | number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        return;
      }

      const clinic: any = await db.Clinic.findOne({
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

// Lấy tất cả phòng khám
const getAllClinic = (limit?: string | number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedLimit = Number(limit);
      const queryOptions: any = {
        attributes: ["id", "name", "image", "address"],
      };
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        queryOptions.limit = parsedLimit;
      }
      const clinics = await db.Clinic.findAll(queryOptions);

      if (clinics && clinics.length > 0) {
        clinics.map((item: any) => {
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

// Cập nhật phòng khám
const updateClinic = (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        return;
      }

      const clinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (!clinic) {
        resolve({
          errCode: 2,
          errMessage: "Clinic not found",
        });
        return;
      }

      if (data.name) clinic.name = data.name;
      if (data.address) clinic.address = data.address;
      if (data.descriptionHTML) clinic.descriptionHTML = data.descriptionHTML;
      if (data.descriptionMarkdown)
        clinic.descriptionMarkdown = data.descriptionMarkdown;
      if (data.imageBase64) clinic.image = data.imageBase64;
      if (data.imageCoverBase64) clinic.imageCover = data.imageCoverBase64;

      await clinic.save();

      resolve({
        errCode: 0,
        errMessage: "Update clinic successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa phòng khám
const deleteClinic = (clinicId: string | number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
        return;
      }

      await db.Doctor_Clinic_Specialty.destroy({
        where: { clinicId },
      });

      const result = await db.Clinic.destroy({
        where: { id: clinicId },
      });

      if (!result) {
        resolve({
          errCode: 2,
          errMessage: "Clinic not found",
        });
        return;
      }

      resolve({
        errCode: 0,
        errMessage: "Delete clinic successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createNewClinic,
  getDetailClinicById,
  getAllClinic,
  updateClinic,
  deleteClinic,
};
