"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model User - đại diện cho người dùng (bác sĩ, bệnh nhân, admin)
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public address!: string;
    public phoneNumber!: string;
    public gender!: string;
    public image!: Buffer;
    public roleId!: string;
    public positionId!: string;

    static associate(models: any) {
      User.belongsTo(models.AllCode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });
      User.belongsTo(models.AllCode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      User.belongsTo(models.AllCode, {
        foreignKey: "roleId",
        targetKey: "keyMap",
        as: "roleData",
      });
      User.hasOne(models.Markdown, {
        foreignKey: "doctorID",
      });
      User.hasOne(models.DoctorInfo, {
        foreignKey: "doctorId",
      });
      User.hasMany(models.Schedule, {
        foreignKey: "doctorId",
      });
      User.hasMany(models.Doctor_Clinic_Specialty, {
        foreignKey: "doctorId",
        as: "doctorSpecialties",
      });
      User.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "doctorBookings",
      });
      User.hasMany(models.Booking, {
        foreignKey: "patientId",
        as: "patientBookings",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.TEXT,
      gender: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return User;
};
