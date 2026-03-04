"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model DoctorInfo - thông tin chi tiết bác sĩ (giá, tỉnh, thanh toán, phòng khám)
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class DoctorInfo extends Model {
    public id!: number;
    public doctorId!: number;
    public priceId!: string;
    public provinceId!: string;
    public paymentId!: string;
    public addressClinic!: string;
    public nameClinic!: string;
    public note!: string;
    public clinicId!: number;
    public count!: number;

    static associate(models: any) {
      DoctorInfo.belongsTo(models.User, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "priceTypeData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provinceTypeData",
      });
      DoctorInfo.belongsTo(models.AllCode, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "paymentTypeData",
      });
    }
  }
  DoctorInfo.init(
    {
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      clinicId: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DoctorInfo",
      tableName: "doctor_infos",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return DoctorInfo;
};
