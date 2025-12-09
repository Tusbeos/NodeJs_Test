import { where } from "sequelize";
import _, { includes } from "lodash";
import { raw } from "body-parser";
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
            model: db.Allcode,
            as: "positionData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value_En", "value_Vi"],
          },
          {
            model: db.Allcode,
            as: "roleData",
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
            {
              model: db.Allcode,
              as: "roleData",
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
        console.log("----------------------------------------------");
        console.log("existing: ", existing);
        console.log("toCreate: ", toCreate);
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
            model: db.Allcode,
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

export default {
  getTopDoctorHome,
  getAllDoctors,
  saveInfoDoctor,
  getDetailDoctorByIdService,
  bulkCreateSchedule,
  getScheduleByDate,
};
