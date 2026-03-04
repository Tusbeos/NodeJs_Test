import express, { Application } from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
import specialtyController from "../controller/specialtyController";
import clinicController from "../controller/clinicController";

const router = express.Router();

// Định nghĩa tất cả API routes
const initWebRouter = (app: Application): void => {
  // Legacy CRUD pages (render EJS)
  router.get("/get", homeController.getHomePage);
  router.get("/about", homeController.getAbout);
  router.get("/crud", homeController.getCURD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getDisplayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // API User
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);

  // API Doctor
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-info-doctors", doctorController.saveInfoDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById,
  );
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate,
  );
  router.post(
    "/api/bulk-create-doctor-services",
    doctorController.bulkCreateDoctorServices,
  );
  router.get(
    "/api/get-list-doctor-services",
    doctorController.getListDoctorServices,
  );
  router.get(
    "/api/get-extra-info-doctor-by-id",
    doctorController.getExtraInfoDoctorById,
  );
  router.get(
    "/api/get-specialties-by-doctor-id",
    doctorController.getSpecialtiesByDoctorId,
  );

  // API Patient
  router.post(
    "/api/patient-book-appointment",
    patientController.patientBookAppointment,
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.verifyBookAppointment,
  );
  router.get(
    "/api/get-patients-by-doctor",
    patientController.getPatientsByDoctor,
  );
  router.post(
    "/api/confirm-patient-booking",
    patientController.confirmPatientBooking,
  );

  // API Specialty
  router.post(
    "/api/create-new-specialty",
    specialtyController.createNewSpecialty,
  );
  router.put("/api/update-specialty", specialtyController.updateSpecialty);
  router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-specialty-by-ids",
    specialtyController.getSpecialtyByIds,
  );
  router.get(
    "/api/get-doctor-specialty-by-id",
    doctorController.getDoctorSpecialtyById,
  );
  router.get(
    "/api/get-doctors-by-clinic-id",
    doctorController.getDoctorsByClinicId,
  );

  // API Clinic
  router.post("/api/create-new-clinic", clinicController.createNewClinic);
  router.put("/api/update-clinic", clinicController.updateClinic);
  router.delete("/api/delete-clinic", clinicController.deleteClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById,
  );

  app.use("/", router);
};

export default initWebRouter;
