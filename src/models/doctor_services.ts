"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model DoctorServices - dịch vụ của bác sĩ
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class DoctorServices extends Model {
    public id!: number;
    public doctorId!: number;
    public nameVi!: string;
    public nameEn!: string;
    public price!: string;
    public descriptionVi!: string;
    public descriptionEn!: string;

    static associate(models: any) {}
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
    },
  );
  return DoctorServices;
};
