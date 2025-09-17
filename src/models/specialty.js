"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {}
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING, // nếu migration còn "imgage", đổi lại cho khớp
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
      tableName: "specialties", // nếu chưa sửa migration, dùng "spacialtys"
      freezeTableName: true,
      timestamps: false, // migration không có createdAt/updatedAt
    }
  );
  return Specialty;
};
