"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model History - lịch sử khám bệnh
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class History extends Model {
    public id!: number;
    public address!: string;
    public description!: string;
    public image!: number;
    public files!: string;

    static associate(models: any) {}
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
    },
  );
  return History;
};
