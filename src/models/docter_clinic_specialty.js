"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Clinic_Specialty extends Model {
    static associate(models) {
      Doctor_Clinic_Specialty.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctor",
      });
      Doctor_Clinic_Specialty.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        as: "clinic",
      });
      Doctor_Clinic_Specialty.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        as: "specialty",
      });
    }
  }
  Doctor_Clinic_Specialty.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Clinic_Specialty",
      tableName: "doctor_clinic_specialty",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Doctor_Clinic_Specialty;
};
