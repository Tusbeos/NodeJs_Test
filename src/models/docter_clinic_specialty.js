"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Docter_Clinic_Specialty extends Model {
    static associate(models) {}
  }
  Docter_Clinic_Specialty.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Docter_Clinic_Specialty",
      tableName: "docter_clinic_specialty", // giữ nguyên như migration
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Docter_Clinic_Specialty;
};
