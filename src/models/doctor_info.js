"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DoctorInfo extends Model {
    static associate(models) {
      DoctorInfo.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "priceTypeData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provinceTypeData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "paymentTypeData",
      });
    }
  }
  DoctorInfo.init(
    {
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DoctorInfo",
      tableName: "doctor_infos",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return DoctorInfo;
};
