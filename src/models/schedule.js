"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.AllCode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "timeTypeData",
      });
      Schedule.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorData",
      });
    }
  }
  Schedule.init(
    {
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "schedules",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Schedule;
};
