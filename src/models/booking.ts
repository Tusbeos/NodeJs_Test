"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Booking - lưu thông tin đặt lịch khám bệnh
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Booking extends Model {
    public id!: number;
    public statusId!: string;
    public doctorId!: number;
    public patientId!: number;
    public date!: string;
    public timeType!: string;
    public token!: string;
    public birthday!: string;
    public reason!: string;

    static associate(models: any) {
      Booking.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "patientId",
        as: "patientData",
      });
      Booking.belongsTo(models.AllCode, {
        foreignKey: "statusId",
        targetKey: "keyMap",
        as: "statusData",
      });
      Booking.belongsTo(models.AllCode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "bookingTimeTypeData",
      });
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      date: DataTypes.STRING,
      timeType: DataTypes.STRING,
      token: DataTypes.STRING,
      birthday: DataTypes.STRING,
      reason: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Booking;
};
