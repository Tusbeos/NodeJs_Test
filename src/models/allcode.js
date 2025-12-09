"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      Allcode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      Allcode.hasMany(models.User, { foreignKey: "roleId", as: "roleData" });
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      value_En: DataTypes.STRING,
      value_Vi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
      tableName: "allcodes",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Allcode;
};
