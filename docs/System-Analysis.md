# Phân tích & Thiết kế hệ thống (E‑Hospital)

> Tài liệu này tổng hợp theo mã nguồn hiện tại (Frontend ReactJS + Backend NodeJS/Express + MySQL/Sequelize).

## 1) Tổng quan kiến trúc
- **Kiến trúc Client–Server:** ReactJS (Class Component) gọi API JSON → NodeJS/Express xử lý nghiệp vụ → Sequelize truy vấn MySQL.
- **Luồng dữ liệu chính:** UI → Service (axios) → API route → Controller → Service → Model/DB → trả JSON.
- **Định tuyến tổng thể (FE):** [Reactjs_Test/src/containers/App.js](Reactjs_Test/src/containers/App.js)
- **Định tuyến API (BE):** [NodeJs_Test/src/route/web.js](NodeJs_Test/src/route/web.js)

## 2) Phân hệ & chức năng chính
### 2.1. Xác thực & người dùng
- **Đăng nhập:** `POST /api/login` → `handleLogin()` → kiểm tra mật khẩu, trả user + role.
- **Quản trị user (Admin):** xem/tạo/sửa/xoá user.
  - UI: [Reactjs_Test/src/containers/System/UserManage.js](Reactjs_Test/src/containers/System/UserManage.js)
  - API: [NodeJs_Test/src/controller/userController.js](NodeJs_Test/src/controller/userController.js), [NodeJs_Test/src/services/userService.js](NodeJs_Test/src/services/userService.js)

### 2.2. Quản lý bác sĩ (Admin)
- **Thông tin bác sĩ:** mô tả, giá khám, thanh toán, tỉnh, phòng khám, ghi chú, chuyên khoa.
- **Markdown giới thiệu bác sĩ:** soạn thảo nội dung bằng Markdown editor.
- **Dịch vụ khám của bác sĩ:** danh sách dịch vụ và giá.
  - UI: [Reactjs_Test/src/containers/System/Admin/ManageDoctor.js](Reactjs_Test/src/containers/System/Admin/ManageDoctor.js), [Reactjs_Test/src/containers/System/Admin/DoctorServices.js](Reactjs_Test/src/containers/System/Admin/DoctorServices.js)
  - API: [NodeJs_Test/src/controller/doctorController.js](NodeJs_Test/src/controller/doctorController.js), [NodeJs_Test/src/services/doctorService.js](NodeJs_Test/src/services/doctorService.js)

### 2.3. Quản lý lịch khám (Doctor/Admin)
- **Tạo lịch theo ngày & khung giờ:** chọn bác sĩ, ngày, time slots và lưu.
- **Tải lịch đã có để chỉnh sửa:** lấy lịch theo ngày.
  - UI: [Reactjs_Test/src/containers/System/Doctor/ManageSchedule.js](Reactjs_Test/src/containers/System/Doctor/ManageSchedule.js)
  - API: `POST /api/bulk-create-schedule`, `GET /api/get-schedule-doctor-by-date` trong [NodeJs_Test/src/route/web.js](NodeJs_Test/src/route/web.js)
  - Nghiệp vụ: [NodeJs_Test/src/services/doctorService.js](NodeJs_Test/src/services/doctorService.js)

### 2.4. Quản lý bệnh nhân đặt lịch (Doctor/Admin)
- **Danh sách bệnh nhân theo ngày/bác sĩ.**
- **Xác nhận bệnh nhân đã khám xong.**
  - UI: [Reactjs_Test/src/containers/System/Doctor/ManagePatient.js](Reactjs_Test/src/containers/System/Doctor/ManagePatient.js)
  - API: `GET /api/get-patients-by-doctor`, `POST /api/confirm-patient-booking` trong [NodeJs_Test/src/route/web.js](NodeJs_Test/src/route/web.js)
  - Nghiệp vụ: [NodeJs_Test/src/services/patientService.js](NodeJs_Test/src/services/patientService.js)

### 2.5. Đặt lịch khám (Bệnh nhân)
- **Xem chi tiết bác sĩ:** hồ sơ, lịch khám, giá & thông tin phòng khám.
- **Chọn khung giờ & đặt lịch:** nhập thông tin, gửi email xác nhận.
- **Xác thực lịch hẹn qua email:** cập nhật trạng thái booking.
  - UI: 
    - Chi tiết bác sĩ: [Reactjs_Test/src/containers/Patient/Doctor/DetailDoctor.js](Reactjs_Test/src/containers/Patient/Doctor/DetailDoctor.js)
    - Lịch bác sĩ: [Reactjs_Test/src/containers/Patient/Doctor/DoctorSchedules.js](Reactjs_Test/src/containers/Patient/Doctor/DoctorSchedules.js)
    - Thông tin giá & phòng khám: [Reactjs_Test/src/containers/Patient/Doctor/DoctorExtraInfo.js](Reactjs_Test/src/containers/Patient/Doctor/DoctorExtraInfo.js)
    - Đặt lịch: [Reactjs_Test/src/containers/Patient/Booking/BookingDoctor.js](Reactjs_Test/src/containers/Patient/Booking/BookingDoctor.js)
    - Xác nhận email: [Reactjs_Test/src/containers/Patient/VerifyEmail.js](Reactjs_Test/src/containers/Patient/VerifyEmail.js)
  - API: `POST /api/patient-book-appointment`, `POST /api/verify-book-appointment` trong [NodeJs_Test/src/route/web.js](NodeJs_Test/src/route/web.js)
  - Email: [NodeJs_Test/src/services/emailService.js](NodeJs_Test/src/services/emailService.js)

### 2.6. Quản lý chuyên khoa (Admin) & hiển thị (Patient)
- **Admin:** tạo/sửa/xoá chuyên khoa, hình ảnh & mô tả Markdown.
- **Patient:** danh sách chuyên khoa & chi tiết; lọc bác sĩ theo chuyên khoa.
  - UI Admin: [Reactjs_Test/src/containers/System/Specialty/ManageSpecialty.js](Reactjs_Test/src/containers/System/Specialty/ManageSpecialty.js)
  - UI Patient: [Reactjs_Test/src/containers/Patient/Specialty/SpecialtyList.js](Reactjs_Test/src/containers/Patient/Specialty/SpecialtyList.js), [Reactjs_Test/src/containers/Patient/Specialty/DetailSpecialty.js](Reactjs_Test/src/containers/Patient/Specialty/DetailSpecialty.js)
  - API: [NodeJs_Test/src/controller/specialtyController.js](NodeJs_Test/src/controller/specialtyController.js), [NodeJs_Test/src/services/specialtyService.js](NodeJs_Test/src/services/specialtyService.js)

### 2.7. Quản lý phòng khám (Admin) & hiển thị (Patient)
- **Admin:** tạo/sửa/xoá phòng khám, logo/cover, mô tả.
- **Patient:** danh sách phòng khám & chi tiết; lọc bác sĩ theo phòng khám.
  - UI Admin: [Reactjs_Test/src/containers/System/Clinic/ManageClinic.js](Reactjs_Test/src/containers/System/Clinic/ManageClinic.js)
  - UI Patient: [Reactjs_Test/src/containers/Patient/Clinic/ClinicList.js](Reactjs_Test/src/containers/Patient/Clinic/ClinicList.js), [Reactjs_Test/src/containers/Patient/Clinic/DetailClinic.js](Reactjs_Test/src/containers/Patient/Clinic/DetailClinic.js)
  - API: [NodeJs_Test/src/controller/clinicController.js](NodeJs_Test/src/controller/clinicController.js), [NodeJs_Test/src/services/clinicService.js](NodeJs_Test/src/services/clinicService.js)

### 2.8. Trang chủ & khám phá nội dung
- **Trang chủ:** banner, tìm kiếm, slider chuyên khoa, phòng khám, bác sĩ nổi bật.
  - UI: [Reactjs_Test/src/containers/HomePage/HomePage.js](Reactjs_Test/src/containers/HomePage/HomePage.js), [Reactjs_Test/src/containers/HomePage/HomeHeader.js](Reactjs_Test/src/containers/HomePage/HomeHeader.js)
  - Sections: [Reactjs_Test/src/containers/HomePage/Section/Specialty.js](Reactjs_Test/src/containers/HomePage/Section/Specialty.js), [Reactjs_Test/src/containers/HomePage/Section/MedicalFacility.js](Reactjs_Test/src/containers/HomePage/Section/MedicalFacility.js), [Reactjs_Test/src/containers/HomePage/Section/OutStandingDoctor.js](Reactjs_Test/src/containers/HomePage/Section/OutStandingDoctor.js)

## 3) API chính (tóm tắt)
- **Auth/User:** `/api/login`, `/api/get-all-users`, `/api/create-new-user`, `/api/edit-user`, `/api/delete-user`
- **Allcodes:** `/api/allcode`
- **Doctor:** `/api/top-doctor-home`, `/api/get-all-doctors`, `/api/save-info-doctors`, `/api/get-detail-doctor-by-id`, `/api/get-extra-info-doctor-by-id`, `/api/get-specialties-by-doctor-id`
- **Schedule:** `/api/bulk-create-schedule`, `/api/get-schedule-doctor-by-date`
- **Doctor services:** `/api/bulk-create-doctor-services`, `/api/get-list-doctor-services`
- **Booking:** `/api/patient-book-appointment`, `/api/verify-book-appointment`, `/api/get-patients-by-doctor`, `/api/confirm-patient-booking`
- **Specialty:** `/api/create-new-specialty`, `/api/update-specialty`, `/api/delete-specialty`, `/api/get-all-specialty`, `/api/get-specialty-by-ids`, `/api/get-doctor-specialty-by-id`
- **Clinic:** `/api/create-new-clinic`, `/api/update-clinic`, `/api/delete-clinic`, `/api/get-all-clinic`, `/api/get-detail-clinic-by-id`, `/api/get-doctors-by-clinic-id`

> Chi tiết endpoints nằm tại: [NodeJs_Test/src/route/web.js](NodeJs_Test/src/route/web.js)

## 4) Thiết kế dữ liệu & quan hệ
### 4.1. Bảng chính (Model)
- **Users:** thông tin user (role, gender, position).
- **DoctorInfo:** thông tin chuyên môn bác sĩ (giá, tỉnh, phòng khám, count).
- **Markdown:** nội dung mô tả bác sĩ/phòng khám/chuyên khoa.
- **Schedules:** lịch khám theo ngày và khung giờ.
- **Bookings:** đặt lịch, trạng thái, token xác nhận.
- **AllCodes:** danh mục chung (role, gender, price, province, payment, time, status).
- **Specialties** và **Clinics**.
- **Doctor_Clinic_Specialty:** bảng liên kết bác sĩ – phòng khám – chuyên khoa.

Xem model tại:
- [NodeJs_Test/src/models/users.js](NodeJs_Test/src/models/users.js)
- [NodeJs_Test/src/models/doctor_info.js](NodeJs_Test/src/models/doctor_info.js)
- [NodeJs_Test/src/models/markdown.js](NodeJs_Test/src/models/markdown.js)
- [NodeJs_Test/src/models/schedule.js](NodeJs_Test/src/models/schedule.js)
- [NodeJs_Test/src/models/booking.js](NodeJs_Test/src/models/booking.js)
- [NodeJs_Test/src/models/allcode.js](NodeJs_Test/src/models/allcode.js)
- [NodeJs_Test/src/models/specialty.js](NodeJs_Test/src/models/specialty.js)
- [NodeJs_Test/src/models/clinic.js](NodeJs_Test/src/models/clinic.js)
- [NodeJs_Test/src/models/docter_clinic_specialty.js](NodeJs_Test/src/models/docter_clinic_specialty.js)

### 4.2. Quan hệ chính
- `User` 1–1 `DoctorInfo`
- `User` 1–N `Schedule`
- `User` (doctor) 1–N `Booking` và `User` (patient) 1–N `Booking`
- `Schedule` N–1 `AllCode` theo `timeType`
- `Booking` N–1 `AllCode` theo `statusId` và `timeType`
- `Doctor_Clinic_Specialty` N–1 `User`, `Clinic`, `Specialty`

## 5) Luồng nghiệp vụ chính
### 5.1. Tạo lịch khám
1) Bác sĩ/Admin chọn bác sĩ + ngày + time slots.  
2) FE gọi `saveBulkScheduleDoctor()` → `POST /api/bulk-create-schedule`.  
3) BE đồng bộ lịch: xoá slot cũ không còn chọn, thêm slot mới.

### 5.2. Đặt lịch khám & xác thực email
1) Bệnh nhân chọn lịch từ `DoctorSchedules` → mở form đặt lịch.  
2) FE gọi `postPatientBookAppointment()` → `POST /api/patient-book-appointment`.  
3) BE tạo user bệnh nhân (nếu chưa có), tạo booking status `S1`, gửi email xác nhận.  
4) Bệnh nhân click link xác thực → `POST /api/verify-book-appointment` → cập nhật `S2`.

### 5.3. Bác sĩ xác nhận đã khám
1) Bác sĩ vào quản lý bệnh nhân theo ngày.  
2) Xác nhận booking → `POST /api/confirm-patient-booking` → status `S3`.

## 6) Ghi chú kỹ thuật quan trọng
- **Ảnh** được lưu dạng base64/BLOB trong DB, FE convert base64 để hiển thị.
- **AllCodes** chuẩn hóa danh mục: role, gender, time slots, price, payment, status.
- **Email xác nhận** sử dụng SMTP Gmail qua `nodemailer`.

---
Tài liệu này phản ánh đúng các tính năng đang có trong mã nguồn hiện tại. Nếu bạn muốn mở rộng thêm module hoặc biểu đồ kiến trúc (component diagram, sequence diagram), cho biết phạm vi để mình bổ sung.
