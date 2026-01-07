"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor_services", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: { type: Sequelize.INTEGER },
      nameVi: { type: Sequelize.STRING },
      nameEn: { type: Sequelize.STRING },
      price: { type: Sequelize.STRING },
      descriptionVi: { type: Sequelize.TEXT },
      descriptionEn: { type: Sequelize.TEXT },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("doctor_services");
  },
};
