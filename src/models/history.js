"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {}
  }
  History.init(
    {
      address: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.INTEGER,
      files: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "History",
      tableName: "histories",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return History;
};
