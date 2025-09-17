"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("docter_clinic_specialty", {
      // giữ nguyên tên bảng
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: { type: Sequelize.INTEGER }, // fixed
      clinicId: { type: Sequelize.INTEGER },
      specialtyId: { type: Sequelize.INTEGER }, // fixed
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("docter_clinic_specialty");
  },
};
