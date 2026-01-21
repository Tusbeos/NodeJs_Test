"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(
      "doctor_clinic_specialty",
      ["doctorId", "clinicId", "specialtyId"],
      {
        unique: true,
        name: "uniq_doctor_clinic_specialty",
      },
    );

    await queryInterface.addConstraint("doctor_clinic_specialty", {
      fields: ["doctorId"],
      type: "foreign key",
      name: "fk_doctor_clinic_specialty_doctor",
      references: {
        table: "users",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("doctor_clinic_specialty", {
      fields: ["clinicId"],
      type: "foreign key",
      name: "fk_doctor_clinic_specialty_clinic",
      references: {
        table: "clinics",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("doctor_clinic_specialty", {
      fields: ["specialtyId"],
      type: "foreign key",
      name: "fk_doctor_clinic_specialty_specialty",
      references: {
        table: "specialties",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "doctor_clinic_specialty",
      "fk_doctor_clinic_specialty_specialty",
    );
    await queryInterface.removeConstraint(
      "doctor_clinic_specialty",
      "fk_doctor_clinic_specialty_clinic",
    );
    await queryInterface.removeConstraint(
      "doctor_clinic_specialty",
      "fk_doctor_clinic_specialty_doctor",
    );
    await queryInterface.removeIndex(
      "doctor_clinic_specialty",
      "uniq_doctor_clinic_specialty",
    );
  },
};
