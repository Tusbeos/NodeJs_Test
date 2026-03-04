"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Clinic - phòng khám
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Clinic extends Model {
    public id!: number;
    public name!: string;
    public address!: string;
    public image!: Buffer;
    public imageCover!: Buffer;
    public descriptionHTML!: string;
    public descriptionMarkdown!: string;

    static associate(models: any) {
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
