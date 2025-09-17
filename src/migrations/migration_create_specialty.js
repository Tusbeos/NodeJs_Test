"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("specialties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { type: Sequelize.STRING },
      image: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("specialties");
  },
};
