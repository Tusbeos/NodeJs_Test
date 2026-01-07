"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DoctorServices extends Model {
    static associate(models) {}
  }
  DoctorServices.init(
    {
      doctorId: DataTypes.INTEGER,
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      price: DataTypes.STRING,
      descriptionVi: DataTypes.TEXT,
      descriptionEn: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "DoctorServices",
      tableName: "doctor_services",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return DoctorServices;
};
