"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
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
