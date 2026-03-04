"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model AllCode - bảng tra cứu cho position, gender, role, timeType, price, province, payment, status
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class AllCode extends Model {
    public id!: number;
    public keyMap!: string;
    public type!: string;
    public value_En!: string;
    public value_Vi!: string;

    static associate(models: any) {
      AllCode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      AllCode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      AllCode.hasMany(models.User, { foreignKey: "roleId", as: "roleData" });
      AllCode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "priceId",
        as: "priceTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "provinceId",
        as: "provinceTypeData",
      });
      AllCode.hasMany(models.DoctorInfo, {
        foreignKey: "paymentId",
        as: "paymentTypeData",
      });
      // AllCode cho trạng thái Booking
      AllCode.hasMany(models.Booking, {
        foreignKey: "statusId",
        as: "statusData",
      });
      // AllCode cho kiểu thời gian Booking
      AllCode.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "bookingTimeTypeData",
      });
    }
  }
  AllCode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      value_En: DataTypes.STRING,
      value_Vi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AllCode",
      tableName: "allCodes",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return AllCode;
};
