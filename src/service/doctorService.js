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

export default {
  getTopDoctorHome: getTopDoctorHome,
};
