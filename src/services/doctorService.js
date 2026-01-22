import _, { includes } from "lodash";
const { Op } = require("sequelize");
const db = require("../models");
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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
            model: db.AllCode,
            as: "positionData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.AllCode,
            as: "genderData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.AllCode,
            as: "roleData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.DoctorInfo,
            attributes: ["count"],
            where: {
              count: {
                [Op.gt]: 7,
              },
            },
            required: true,
          },
        ],
        nest: true,
        raw: true,
      });
      if (user && user.length > 0) {
        user.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image).toString("base64");
          }
          return item;
        });
      }
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

let checkRequiredFields = (inputData) => {
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "clinicId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arrFields.length; i++) {
    if (!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  if (isValid) {
    const hasSpecialtyIds =
      Array.isArray(inputData.specialtyIds) &&
      inputData.specialtyIds.length > 0;
    if (!hasSpecialtyIds) {
      isValid = false;
      element = "specialtyIds";
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let saveInfoDoctor = async (inputData) => {
  try {
    let checkObj = checkRequiredFields(inputData);
    if (!checkObj.isValid) {
      return {
        errCode: 1,
        errMessage: `Missing parameter: ${checkObj.element}`,
      };
    }
    if (inputData.action === "CREATE") {
      await db.Markdown.create({
        doctorId: inputData.doctorId,
        contentHTML: inputData.contentHTML,
        contentMarkdown: inputData.contentMarkdown,
        description: inputData.description,
      });
    } else if (inputData.action === "EDIT") {
      let doctorMarkdown = await db.Markdown.findOne({
        where: { doctorId: inputData.doctorId },
        raw: false,
      });

      if (doctorMarkdown) {
        doctorMarkdown.contentHTML = inputData.contentHTML;
        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
        doctorMarkdown.description = inputData.description;
        await doctorMarkdown.save();
      }
    }

    let doctorInfo = await db.DoctorInfo.findOne({
      where: { doctorId: inputData.doctorId },
      raw: false,
    });

    const specialtyIds = Array.isArray(inputData.specialtyIds)
      ? inputData.specialtyIds
      : [];

    if (doctorInfo) {
      doctorInfo.priceId = inputData.selectedPrice;
      doctorInfo.paymentId = inputData.selectedPayment;
      doctorInfo.provinceId = inputData.selectedProvince;
      doctorInfo.nameClinic = inputData.nameClinic;
      doctorInfo.addressClinic = inputData.addressClinic;
      doctorInfo.note = inputData.note;
      doctorInfo.clinicId = inputData.clinicId;
      await doctorInfo.save();
    } else {
      await db.DoctorInfo.create({
        doctorId: inputData.doctorId,
        priceId: inputData.selectedPrice,
        paymentId: inputData.selectedPayment,
        provinceId: inputData.selectedProvince,
        nameClinic: inputData.nameClinic,
        addressClinic: inputData.addressClinic,
        note: inputData.note,
        clinicId: inputData.clinicId,
      });
    }
    await db.Doctor_Clinic_Specialty.destroy({
      where: { doctorId: inputData.doctorId },
    });
    if (specialtyIds && specialtyIds.length > 0) {
      const bulkData = specialtyIds.map((id) => ({
        doctorId: inputData.doctorId,
        clinicId: inputData.clinicId,
        specialtyId: id,
      }));
      await db.Doctor_Clinic_Specialty.bulkCreate(bulkData);
    }

    return {
      errCode: 0,
      errMessage: "Save info doctor succeed",
    };
  } catch (e) {
    console.error("saveInfoDoctor ERROR:", e);
    return {
      errCode: -1,
      errMessage: "Error from server",
    };
  }
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
              model: db.AllCode,
              as: "positionData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.AllCode,
              as: "roleData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["id", "doctorId", "createdAt", "updatedAt"],
              },
              include: [
                {
                  model: db.AllCode,
                  as: "priceTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
                {
                  model: db.AllCode,
                  as: "provinceTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
                {
                  model: db.AllCode,
                  as: "paymentTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
              ],
            },
          ],
          nest: true,
          raw: false,
        });
        const listSpecialty = await db.Doctor_Clinic_Specialty.findAll({
          where: { doctorId: inputId },
          attributes: ["specialtyId"],
          raw: true,
        });
        const specialtyIds = listSpecialty.map((item) => item.specialtyId);

        if (!data) {
          data = {};
        }
        if (!data.DoctorInfo) {
          data.DoctorInfo = {};
        }
        data.DoctorInfo.specialtyIds = specialtyIds;

        if (data && data.image) {
          data.image = data.image.toString("base64");
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
        return;
      } else {
        let schedule = data.arrSchedule;
        const normalizedDate = data.formattedDate
          ? new Date(Number(data.formattedDate)).setHours(0, 0, 0, 0)
          : schedule.length > 0
            ? new Date(Number(schedule[0].date)).setHours(0, 0, 0, 0)
            : "";

        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            item.date = String(normalizedDate);
            return item;
          });
        }
        let dateToQuery = normalizedDate ? String(normalizedDate) : "";
        let existing = await db.Schedule.findAll({
          where: {
            doctorId: data.doctorId,
            date: dateToQuery,
          },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          nest: true,
          raw: true,
        });
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
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

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
        return;
      }

      let normalizedDate = String(new Date(Number(date)).setHours(0, 0, 0, 0));

      let schedules = await db.Schedule.findAll({
        where: {
          doctorId: doctorId,
          date: normalizedDate,
        },
        include: [
          {
            model: db.AllCode,
            as: "timeTypeData",
            attributes: ["value_En", "value_Vi"],
          },
        ],
        raw: false,
        nest: true,
      });
      if (!schedules) schedules = [];
      resolve({
        errCode: 0,
        data: schedules,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateDoctorService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrDoctorService || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let services = data.arrDoctorService;
        if (services && services.length > 0) {
          services = services.map((item) => {
            return {
              ...item,
              doctorId: data.doctorId,
            };
          });
        }
        await db.DoctorServices.destroy({
          where: { doctorId: data.doctorId },
        });
        await db.DoctorServices.bulkCreate(services);
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
let getListDoctorServices = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let services = await db.DoctorServices.findAll({
          where: { doctorId: inputId },
          attributes: [
            "nameVi",
            "nameEn",
            "price",
            "descriptionVi",
            "descriptionEn",
          ],
        });

        resolve({
          errCode: 0,
          data: services,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInfoDoctorByIdService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let info = await db.DoctorInfo.findOne({
          where: { doctorId: inputId },
          attributes: {
            exclude: ["id", "doctorId", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.AllCode,
              as: "priceTypeData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.AllCode,
              as: "provinceTypeData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.AllCode,
              as: "paymentTypeData",
              attributes: ["value_En", "value_Vi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!info) info = {};
        resolve({
          errCode: 0,
          data: info,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getSpecialtiesByDoctorIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
        return;
      }

      const listSpecialty = await db.Doctor_Clinic_Specialty.findAll({
        where: { doctorId },
        attributes: ["specialtyId"],
        raw: true,
      });

      const specialtyIds = listSpecialty.map((item) => item.specialtyId);

      resolve({
        errCode: 0,
        data: specialtyIds,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctorSpecialtyByIdService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        const doctorLinks = await db.Doctor_Clinic_Specialty.findAll({
          where: { specialtyId: inputData.id },
          attributes: ["doctorId"],
          raw: true,
        });
        const doctorIds = [
          ...new Set(doctorLinks.map((item) => item.doctorId)),
        ];

        let doctors = await db.User.findAll({
          where: { roleId: "R2", id: { [Op.in]: doctorIds } },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.AllCode,
              as: "positionData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.AllCode,
              as: "roleData",
              attributes: ["value_En", "value_Vi"],
            },
            {
              model: db.DoctorInfo,
              attributes: {
                exclude: ["id", "doctorId", "createdAt", "updatedAt"],
              },
              required: true,
              include: [
                {
                  model: db.AllCode,
                  as: "priceTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
                {
                  model: db.AllCode,
                  as: "provinceTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
                {
                  model: db.AllCode,
                  as: "paymentTypeData",
                  attributes: ["value_En", "value_Vi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (doctors && doctors.length > 0) {
          doctors = doctors.map((item) => {
            if (item.image) {
              item.image = Buffer.from(item.image).toString("base64");
            }
            return item;
          });
        }

        resolve({
          errCode: 0,
          data: doctors,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctorsByClinicIdService = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
        return;
      }

      const doctorLinks = await db.Doctor_Clinic_Specialty.findAll({
        where: { clinicId },
        attributes: ["doctorId"],
        raw: true,
      });

      const doctorIds = [...new Set(doctorLinks.map((item) => item.doctorId))];

      const clinicInfo = await db.Clinic.findOne({
        where: { id: clinicId },
        attributes: ["id", "name", "address"],
        raw: true,
      });

      resolve({
        errCode: 0,
        data: doctorIds,
        clinic: clinicInfo || null,
      });
    } catch (e) {
      reject(e);
    }
  });
};
export default {
  getTopDoctorHome,
  getAllDoctors,
  saveInfoDoctor,
  getDetailDoctorByIdService,
  bulkCreateSchedule,
  getScheduleByDate,
  bulkCreateDoctorService,
  getListDoctorServices,
  getExtraInfoDoctorByIdService,
  getSpecialtiesByDoctorIdService,
  getDoctorSpecialtyByIdService: getDoctorSpecialtyByIdService,
  getDoctorsByClinicIdService,
};
