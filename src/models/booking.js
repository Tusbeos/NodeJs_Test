"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //associate Đinh danh các mối quan hệ của model
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      docterId: DataTypes.INTEGER,
      patienId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      timeType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
