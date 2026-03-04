"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Doctor_Clinic_Specialty - bảng liên kết bác sĩ - phòng khám - chuyên khoa
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Doctor_Clinic_Specialty extends Model {
    public id!: number;
    public doctorId!: number;
    public clinicId!: number;
    public specialtyId!: number;

    static associate(models: any) {
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
