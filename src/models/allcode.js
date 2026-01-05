"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    static associate(models) {
      AllCode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      AllCode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      AllCode.hasMany(models.User, { foreignKey: "roleId", as: "roleData" });
      AllCode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "priceId",
        as: "priceTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "provinceId",
        as: "provinceTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "paymentId",
        as: "paymentTypeData",
      });
    }
  }
  AllCode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      value_En: DataTypes.STRING,
      value_Vi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
      tableName: "allCodes",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return AllCode;
};
