"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {}
  }
  Clinic.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.TEXT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Clinic",
      tableName: "clinics",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Clinic;
};
