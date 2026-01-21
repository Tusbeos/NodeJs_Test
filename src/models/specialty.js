"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      Specialty.hasMany(models.Doctor_Clinic_Specialty, {
        foreignKey: "specialtyId",
        as: "specialtyDoctors",
      });
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      descriptionHTML: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
      tableName: "specialties",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Specialty;
};
