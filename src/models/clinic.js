"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      Clinic.hasMany(models.Doctor_Clinic_Specialty, {
        foreignKey: "clinicId",
        as: "clinicDoctorSpecialties",
      });
    }
  }
  Clinic.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      imageCover: DataTypes.BLOB("long"),
      descriptionHTML: DataTypes.TEXT("long"),
      descriptionMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Clinic",
      tableName: "clinics",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Clinic;
};
