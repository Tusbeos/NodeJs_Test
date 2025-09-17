"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      statusId: { type: Sequelize.STRING },
      doctorId: { type: Sequelize.INTEGER }, // fixed
      patientId: { type: Sequelize.INTEGER }, // fixed
      date: { type: Sequelize.DATE },
      timeType: { type: Sequelize.STRING },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  },
};
