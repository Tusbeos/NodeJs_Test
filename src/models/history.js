"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //associate Đinh danh các mối quan hệ của model
    static associate(models) {
      // define association here
    }
  }
  History.init(
    {
      patienId: DataTypes.INTEGER,
      docterId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      files: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
