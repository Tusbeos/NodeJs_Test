"use strict";
import { Model, Sequelize, DataTypes as DT } from "sequelize";

// Model Markdown - nội dung mô tả của bác sĩ
module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Markdown extends Model {
    public id!: number;
    public contentHTML!: string;
    public contentMarkdown!: string;
    public description!: string;
    public doctorId!: number;
    public specialtyId!: number;
    public clinicId!: number;

    static associate(models: any) {}
  }
  Markdown.init(
    {
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Markdown",
      tableName: "markdown",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Markdown;
};
