"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Schedule - lịch khám của bác sĩ
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Schedule extends Model {
    public id!: number;
    public currentNumber!: number;
    public maxNumber!: number;
    public date!: string;
    public timeType!: string;
    public doctorId!: number;

    static associate(models: any) {
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
    },
  );
  return Schedule;
};
