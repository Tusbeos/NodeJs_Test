import _, { includes } from "lodash";
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

let saveInfoDoctor = async (inputData) => {
  try {
    let checkObj = {
      doctorId: inputData.doctorId,
      contentHTML: inputData.contentHTML,
      contentMarkdown: inputData.contentMarkdown,
      action: inputData.action,
      selectedPrice: inputData.selectedPrice,
      selectedPayment: inputData.selectedPayment,
      selectedProvince: inputData.selectedProvince,
      nameClinic: inputData.nameClinic,
      addressClinic: inputData.addressClinic,
      note: inputData.note,
    };

    let isValid = true;
    let element = "";
    for (const key in checkObj) {
      if (!checkObj[key]) {
        isValid = false;
        element = key;
        break;
      }
    }

    if (!isValid) {
      return {
        errCode: 1,
        errMessage: `Missing parameter: ${element}`,
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

    if (doctorInfo) {
      doctorInfo.priceId = inputData.selectedPrice;
      doctorInfo.paymentId = inputData.selectedPayment;
      doctorInfo.provinceId = inputData.selectedProvince;
      doctorInfo.nameClinic = inputData.nameClinic;
      doctorInfo.addressClinic = inputData.addressClinic;
      doctorInfo.note = inputData.note;

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
      });
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
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            item.date = new Date(Number(item.date)).getTime();
            return item;
          });
        }
        let dateToQuery = schedule.length > 0 ? schedule[0].date : "";
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

      let schedules = await db.Schedule.findAll({
        where: {
          doctorId: doctorId,
          date: date,
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
};
