"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Specialty - chuyên khoa
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Specialty extends Model {
    public id!: number;
    public name!: string;
    public image!: Buffer;
    public descriptionHTML!: string;
    public descriptionMarkdown!: string;

    static associate(models: any) {
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
