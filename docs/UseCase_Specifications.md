# Chi tiết Use Case - Hệ thống Đặt lịch Khám bệnh

## Mục lục
- [1. Use Case của Admin](#1-use-case-của-admin)
- [2. Use Case của Bệnh nhân](#2-use-case-của-bệnh-nhân)
- [3. Use Case của Bác sĩ](#3-use-case-của-bác-sĩ)
- [4. Use Case chung](#4-use-case-chung)

---

## 1. Use Case của Admin

### UC-AD-01: Quản lý Chuyên Khoa
**Actor:** Admin

**Mô tả:** Admin có thể xem, thêm, sửa, xóa các chuyên khoa trong hệ thống.

**Preconditions:**
- Admin đã đăng nhập thành công
- Admin có quyền ROLE = 'ADMIN'

**Postconditions:**
- Danh sách chuyên khoa được cập nhật trong database
- Thông tin được đồng bộ trên frontend

**Main Flow:**
1. Admin truy cập vào trang quản lý chuyên khoa
2. Hệ thống hiển thị danh sách tất cả chuyên khoa
3. Admin chọn thao tác:
   - **Thêm mới:** Nhập tên chuyên khoa, mô tả, hình ảnh, nội dung Markdown → Submit
   - **Chỉnh sửa:** Chọn chuyên khoa → Cập nhật thông tin → Lưu
   - **Xóa:** Chọn chuyên khoa → Xác nhận xóa
4. Hệ thống validate dữ liệu
5. Hệ thống lưu vào database (bảng `specialties`)
6. Hệ thống trả về kết quả thành công

**Alternative Flows:**
- **A1:** Validation lỗi → Hiển thị thông báo lỗi cụ thể
- **A2:** Xóa chuyên khoa có bác sĩ đang liên kết → Cảnh báo hoặc chặn xóa

**Exception Flows:**
- **E1:** Database connection lỗi → Hiển thị "Lỗi hệ thống, vui lòng thử lại"

---

### UC-AD-02: Quản lý Người dùng
**Actor:** Admin

**Mô tả:** Admin có thể xem, thêm, sửa, xóa người dùng (Admin, Doctor, Patient).

**Preconditions:**
- Admin đã đăng nhập thành công

**Postconditions:**
- Người dùng được tạo/sửa/xóa trong bảng `users`
- Password được mã hóa bằng bcrypt

**Main Flow:**
1. Admin truy cập trang quản lý người dùng
2. Hệ thống hiển thị danh sách user (có lọc theo roleId)
3. Admin chọn thao tác:
   - **Thêm mới:** Nhập email, password, firstName, lastName, address, phoneNumber, gender, roleId, positionId → Submit
   - **Chỉnh sửa:** Chọn user → Cập nhật thông tin → Lưu
   - **Xóa:** Chọn user → Xác nhận xóa
4. Hệ thống validate:
   - Email phải unique
   - Password tối thiểu 6 ký tự
5. Hệ thống hash password (bcrypt)
6. Hệ thống lưu vào database
7. Trả về kết quả

**Alternative Flows:**
- **A1:** Email đã tồn tại → "Email đã được sử dụng"
- **A2:** Xóa user là doctor có lịch khám tương lai → Cảnh báo

**Exception Flows:**
- **E1:** Hash password thất bại → Log error và trả về lỗi

---

### UC-AD-03: Quản lý Bác sĩ
**Actor:** Admin

**Mô tả:** Admin quản lý thông tin chuyên môn của bác sĩ (chuyên khoa, phòng khám, giá khám, mô tả).

**Preconditions:**
- Admin đã đăng nhập
- User với roleId='DOCTOR' phải tồn tại trước

**Postconditions:**
- Thông tin được lưu vào `doctor_infos`, `markdown`, `docter_clinic_specialty`

**Main Flow:**
1. Admin chọn một user có roleId='DOCTOR'
2. Hệ thống hiển thị form nhập thông tin:
   - Chuyên khoa (specialtyId)
   - Phòng khám (clinicId)
   - Giá khám (priceId)
   - Địa chỉ khám, tỉnh thành (provinceId), payment (paymentId)
   - Mô tả ngắn (note)
   - Mô tả chi tiết (contentHTML, contentMarkdown)
3. Admin nhập đầy đủ thông tin và submit
4. Hệ thống validate:
   - doctorId, specialtyId, clinicId phải hợp lệ
   - priceId, provinceId, paymentId phải tồn tại trong `allcode`
5. Hệ thống thực hiện transaction:
   - Upsert `doctor_infos`
   - Upsert `markdown`
   - Upsert `docter_clinic_specialty`
6. Commit transaction và trả về kết quả

**Alternative Flows:**
- **A1:** Doctor đã có thông tin → Cập nhật (Upsert)

**Exception Flows:**
- **E1:** Transaction rollback nếu có lỗi

---

### UC-AD-04: Quản lý Phòng Khám
**Actor:** Admin

**Mô tả:** Admin quản lý danh sách phòng khám.

**Preconditions:**
- Admin đã đăng nhập

**Postconditions:**
- Dữ liệu phòng khám được cập nhật trong bảng `clinics`

**Main Flow:**
1. Admin truy cập trang quản lý phòng khám
2. Hệ thống hiển thị danh sách phòng khám
3. Admin chọn thao tác:
   - **Thêm mới:** Nhập tên phòng khám, địa chỉ, hình ảnh, mô tả (HTML/Markdown) → Submit
   - **Chỉnh sửa:** Chọn phòng khám → Cập nhật thông tin → Lưu
   - **Xóa:** Chọn phòng khám → Xác nhận xóa
4. Hệ thống validate dữ liệu
5. Hệ thống lưu vào database
6. Trả về kết quả

**Alternative Flows:**
- **A1:** Xóa phòng khám có bác sĩ → Cảnh báo

---

### UC-AD-05: Quản lý Giá Dịch Vụ
**Actor:** Admin

**Mô tả:** Admin quản lý bảng giá khám bệnh (CRUD trên allcode với type='PRICE').

**Preconditions:**
- Admin đã đăng nhập

**Postconditions:**
- Bảng giá được cập nhật trong `allcodes` (type='PRICE')

**Main Flow:**
1. Admin truy cập trang quản lý giá dịch vụ
2. Hệ thống hiển thị danh sách giá (type='PRICE')
3. Admin chọn thao tác:
   - **Thêm mới:** Nhập keyMap (VD: PRICE1), value (VD: "500.000 VND") → Submit
   - **Chỉnh sửa:** Chọn giá → Cập nhật value → Lưu
   - **Xóa:** Chọn giá → Xác nhận xóa
4. Hệ thống validate:
   - keyMap phải unique
   - value không được rỗng
5. Hệ thống lưu vào database
6. Trả về kết quả

**Alternative Flows:**
- **A1:** Xóa giá đang được bác sĩ sử dụng → Chặn xóa hoặc cảnh báo

---

### UC-AD-06: Thống Kê Báo Cáo
**Actor:** Admin

**Mô tả:** Admin xem báo cáo thống kê (số lượng đặt lịch, doanh thu, bác sĩ hoạt động).

**Preconditions:**
- Admin đã đăng nhập

**Postconditions:**
- Dữ liệu thống kê được hiển thị

**Main Flow:**
1. Admin truy cập trang thống kê
2. Admin chọn loại báo cáo và khoảng thời gian
3. Hệ thống truy vấn database:
   - Tổng số booking theo status
   - Doanh thu (nếu có bảng payment)
   - Top bác sĩ có nhiều lịch khám
   - Chuyên khoa phổ biến
4. Hệ thống render biểu đồ/bảng số liệu
5. Admin có thể export Excel/PDF (optional)

**Alternative Flows:**
- **A1:** Không có dữ liệu → Hiển thị "Không có dữ liệu trong khoảng thời gian này"

---

## 2. Use Case của Bệnh nhân

### UC-PT-01: Đăng Ký
**Actor:** Bệnh nhân (Khách)

**Mô tả:** Người dùng mới tạo tài khoản bệnh nhân.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- User mới được tạo với roleId='PATIENT'

**Main Flow:**
1. Bệnh nhân truy cập trang đăng ký
2. Nhập thông tin: email, password, firstName, lastName, phoneNumber, address, gender
3. Submit form
4. Hệ thống validate:
   - Email chưa tồn tại
   - Password >= 6 ký tự
   - Các field bắt buộc không được rỗng
5. Hệ thống hash password
6. Hệ thống lưu vào `users` với roleId='R3' (PATIENT)
7. Hệ thống gửi email xác thực (optional)
8. Trả về thông báo đăng ký thành công

**Alternative Flows:**
- **A1:** Email đã tồn tại → "Email đã được đăng ký, vui lòng đăng nhập"

**Exception Flows:**
- **E1:** Gửi email thất bại → Log warning nhưng vẫn tạo user thành công

---

### UC-PT-02: Đăng Nhập
*(Xem UC-COMMON-01)*

---

### UC-PT-03: Xem Lịch Hoạt Động (Xem Log Hoạt Động)
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xem các hoạt động của mình trong hệ thống.

**Preconditions:**
- Bệnh nhân đã đăng nhập

**Postconditions:**
- Danh sách hoạt động được hiển thị

**Main Flow:**
1. Bệnh nhân truy cập trang lịch sử hoạt động
2. Hệ thống query log (nếu có bảng audit) hoặc tổng hợp từ `bookings`, `history`
3. Hiển thị danh sách hoạt động theo thời gian

---

### UC-PT-04: Xem Lịch Khám Trống
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xem lịch khám còn trống của một bác sĩ cụ thể.

**Preconditions:**
- Bệnh nhân đã chọn bác sĩ

**Postconditions:**
- Danh sách khung giờ còn trống được hiển thị

**Main Flow:**
1. Bệnh nhân chọn bác sĩ
2. Bệnh nhân chọn ngày muốn xem
3. Hệ thống query `schedules` WHERE doctorId=? AND date=?
4. Hệ thống filter các schedule có currentNumber < maxNumber
5. Hệ thống JOIN với `allcodes` (timeType) để lấy label giờ khám
6. Hiển thị danh sách khung giờ còn slot

**Alternative Flows:**
- **A1:** Không có lịch trống → "Bác sĩ không có lịch khám trong ngày này"

---

### UC-PT-05: Đặt Lịch Khám
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân đặt lịch hẹn với bác sĩ.

**Preconditions:**
- Bệnh nhân đã chọn bác sĩ, ngày, giờ khám
- Schedule còn slot trống (currentNumber < maxNumber)

**Postconditions:**
- Booking mới được tạo với statusId='S1' (NEW)
- Email xác nhận được gửi đến bệnh nhân
- currentNumber trong `schedules` tăng lên 1 (nếu xác nhận ngay)

**Main Flow:**
1. Bệnh nhân chọn bác sĩ, ngày, khung giờ
2. Bệnh nhân nhập thông tin:
   - Họ tên bệnh nhân (fullName)
   - Số điện thoại (phoneNumber)
   - Email
   - Địa chỉ (address)
   - Lý do khám (reason)
   - Ngày sinh (birthday) - optional
   - Giới tính (genderData)
3. Bệnh nhân submit đơn đặt lịch
4. Hệ thống validate:
   - Tất cả field bắt buộc
   - Email format hợp lệ
   - doctorId, date, timeType hợp lệ
   - Check schedule còn slot trống
5. Hệ thống kiểm tra patientId:
   - Nếu đã đăng nhập → Lấy userId hiện tại
   - Nếu chưa đăng nhập → Auto-tạo user với roleId='PATIENT' từ email
6. Hệ thống generate token (uuid v4)
7. Hệ thống lưu vào `bookings` với statusId='S1' (NEW)
8. Hệ thống gửi email xác nhận (template: appointment confirmation + link verify)
9. Trả về thông báo "Đặt lịch thành công, vui lòng kiểm tra email để xác nhận"

**Alternative Flows:**
- **A1:** Slot đã đầy → "Khung giờ đã hết chỗ, vui lòng chọn giờ khác"
- **A2:** Email đã tồn tại nhưng chưa đăng nhập → Hệ thống vẫn tạo booking và yêu cầu xác thực email

**Exception Flows:**
- **E1:** Gửi email thất bại → Log error, booking vẫn được tạo nhưng statusId treo ở 'S1'

---

### UC-PT-06: Xác Thực Email
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân click link trong email để xác nhận đặt lịch.

**Preconditions:**
- Bệnh nhân đã nhận được email xác nhận
- Token hợp lệ và chưa expire

**Postconditions:**
- Booking statusId chuyển từ 'S1' (NEW) → 'S2' (CONFIRMED)
- currentNumber trong `schedules` tăng lên 1

**Main Flow:**
1. Bệnh nhân click link trong email: `/verify-booking?token=xxx&doctorId=yyy`
2. Hệ thống nhận GET request
3. Hệ thống query `bookings` WHERE token=? AND doctorId=?
4. Kiểm tra:
   - Booking tồn tại
   - statusId hiện tại là 'S1'
   - Token hợp lệ (nếu có expiration)
5. Hệ thống update `bookings.statusId` = 'S2'
6. Hệ thống tăng `schedules.currentNumber` +1
7. Hệ thống có thể gửi email thông báo "Xác nhận thành công"
8. Redirect bệnh nhân đến trang thành công

**Alternative Flows:**
- **A1:** Token không hợp lệ → "Link xác nhận không hợp lệ hoặc đã hết hạn"
- **A2:** Booking đã được xác nhận trước đó → "Lịch hẹn đã được xác nhận"

**Exception Flows:**
- **E1:** Schedule không tồn tại → Rollback transaction

---

### UC-PT-07: Xem Lịch Sử Khám
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xem danh sách các lần khám bệnh đã thực hiện.

**Preconditions:**
- Bệnh nhân đã đăng nhập

**Postconditions:**
- Danh sách lịch sử khám được hiển thị

**Main Flow:**
1. Bệnh nhân truy cập trang "Lịch sử khám bệnh"
2. Hệ thống query `bookings` hoặc `history` WHERE patientId=userId
3. Hệ thống JOIN với `users` (doctor), `allcodes` (timeType, status)
4. Hiển thị danh sách (ngày khám, bác sĩ, chuyên khoa, trạng thái)
5. Bệnh nhân có thể click vào từng lần khám để xem chi tiết (nếu có record trong `history`)

**Alternative Flows:**
- **A1:** Chưa có lịch sử → "Bạn chưa có lịch khám nào"

---

### UC-PT-08: Xác Nhận Lịch Khám
*(Duplicate của UC-PT-06, hoặc có thể là bệnh nhân xác nhận lại booking từ trang cá nhân)*

**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xác nhận hoặc hủy lịch hẹn đã đặt.

**Preconditions:**
- Bệnh nhân đã đăng nhập
- Booking tồn tại và thuộc về bệnh nhân

**Postconditions:**
- Trạng thái booking được cập nhật

**Main Flow:**
1. Bệnh nhân truy cập trang "Lịch khám của tôi"
2. Hệ thống hiển thị danh sách booking (statusId='S1' hoặc 'S2')
3. Bệnh nhân chọn:
   - **Xác nhận:** (nếu chưa xác nhận qua email) → Update statusId='S2'
   - **Hủy lịch:** → Update statusId='S4' (CANCELLED) và giảm currentNumber
4. Hệ thống update database
5. Gửi email thông báo

---

### UC-PT-09: Tìm Kiếm Bác Sĩ
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân tìm kiếm bác sĩ theo chuyên khoa, phòng khám, tỉnh thành.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Danh sách bác sĩ phù hợp được hiển thị

**Main Flow:**
1. Bệnh nhân nhập từ khóa hoặc chọn filter:
   - Chuyên khoa (specialtyId)
   - Phòng khám (clinicId)
   - Tỉnh thành (provinceId)
2. Hệ thống query:
   - JOIN `users` ↔ `doctor_infos` ↔ `docter_clinic_specialty` ↔ `specialties`/`clinics`
   - WHERE roleId='R2' AND (filters)
3. Hệ thống hiển thị kết quả (avatar, tên, chuyên khoa, địa chỉ, giá)
4. Bệnh nhân click vào bác sĩ để xem chi tiết

**Alternative Flows:**
- **A1:** Không tìm thấy → "Không có bác sĩ phù hợp"

---

### UC-PT-10: Xem Bảng Giá
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xem bảng giá khám bệnh.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Bảng giá được hiển thị

**Main Flow:**
1. Bệnh nhân truy cập trang bảng giá hoặc xem trong profile bác sĩ
2. Hệ thống query `allcodes` WHERE type='PRICE'
3. Hiển thị danh sách giá (keyMap, value)

---

### UC-PT-11: Xem Đánh Giá
**Actor:** Bệnh nhân

**Mô tả:** Bệnh nhân xem đánh giá của bác sĩ từ bệnh nhân khác.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Danh sách đánh giá được hiển thị

**Main Flow:**
1. Bệnh nhân truy cập trang chi tiết bác sĩ
2. Hệ thống query bảng `reviews` (nếu có) WHERE doctorId=?
3. Hiển thị rating, comment, thời gian

**Alternative Flows:**
- **A1:** Chưa có đánh giá → "Chưa có đánh giá nào"

---

## 3. Use Case của Bác sĩ

### UC-DR-01: Đăng Nhập
*(Xem UC-COMMON-01)*

---

### UC-DR-02: Quản lý Lịch Khám
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ tạo, cập nhật, xóa lịch khám của mình.

**Preconditions:**
- Bác sĩ đã đăng nhập
- roleId='DOCTOR'

**Postconditions:**
- Lịch khám được lưu vào bảng `schedules`

**Main Flow:**
1. Bác sĩ truy cập trang "Quản lý lịch khám"
2. Bác sĩ chọn ngày và các khung giờ muốn mở
3. Bác sĩ nhập số lượng bệnh nhân tối đa cho từng khung giờ (maxNumber)
4. Bác sĩ submit
5. Hệ thống validate:
   - date phải >= ngày hiện tại
   - timeType phải hợp lệ (type='TIME' trong allcodes)
   - maxNumber > 0
6. Hệ thống xử lý:
   - Query schedules hiện tại của bác sĩ trong ngày đó
   - Xóa các khung giờ không được chọn (và currentNumber=0)
   - Upsert các khung giờ được chọn
7. Hệ thống lưu vào `schedules`
8. Trả về kết quả

**Alternative Flows:**
- **A1:** Xóa khung giờ đã có booking → Chặn xóa hoặc cảnh báo

**Exception Flows:**
- **E1:** Transaction rollback nếu có lỗi

---

### UC-DR-03: Xem Danh Sách Bệnh Nhân Đặt Lịch
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ xem danh sách bệnh nhân đã đặt lịch với mình.

**Preconditions:**
- Bác sĩ đã đăng nhập

**Postconditions:**
- Danh sách bệnh nhân được hiển thị

**Main Flow:**
1. Bác sĩ truy cập trang "Danh sách bệnh nhân"
2. Bác sĩ có thể filter theo:
   - Ngày khám
   - Trạng thái (S1, S2, S3, S4)
3. Hệ thống query `bookings` WHERE doctorId=userId
4. JOIN với `allcodes` (timeType, status, gender), `users` (patient)
5. Hiển thị danh sách (tên BN, giờ khám, trạng thái, lý do khám)
6. Bác sĩ có thể click vào để xem chi tiết

**Alternative Flows:**
- **A1:** Không có booking → "Chưa có bệnh nhân nào đặt lịch"

---

### UC-DR-04: Xác Nhận Khám
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ xác nhận đã khám xong cho bệnh nhân.

**Preconditions:**
- Bác sĩ đã đăng nhập
- Booking tồn tại với statusId='S2' (CONFIRMED)

**Postconditions:**
- Booking statusId chuyển sang 'S3' (DONE)
- Ghi nhận vào bảng `history` (optional)

**Main Flow:**
1. Bác sĩ xem danh sách bệnh nhân đặt lịch
2. Bác sĩ chọn bệnh nhân đã khám xong
3. Bác sĩ nhập (optional):
   - Chẩn đoán
   - Đơn thuốc
   - Ghi chú
4. Bác sĩ click "Xác nhận hoàn thành"
5. Hệ thống update `bookings.statusId` = 'S3'
6. Hệ thống insert vào `history` (nếu có)
7. Hệ thống gửi email thông báo hoàn thành (optional)
8. Trả về kết quả

**Alternative Flows:**
- **A1:** Booking đã hoàn thành trước đó → "Lịch hẹn này đã được xác nhận"

---

### UC-DR-05: Gửi Hoá Đơn
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ gửi hoá đơn thanh toán cho bệnh nhân qua email.

**Preconditions:**
- Bác sĩ đã đăng nhập
- Booking đã hoàn thành (statusId='S3')

**Postconditions:**
- Email hoá đơn được gửi đến bệnh nhân

**Main Flow:**
1. Bác sĩ chọn bệnh nhân từ danh sách đã khám
2. Bác sĩ nhập thông tin hoá đơn:
   - Tổng tiền
   - Chi tiết dịch vụ
   - Ghi chú
3. Bác sĩ click "Gửi hoá đơn"
4. Hệ thống generate HTML hoá đơn
5. Hệ thống gửi email với attachment hoặc link
6. Trả về thông báo thành công

**Alternative Flows:**
- **A1:** Gửi email thất bại → Log error và retry

---

### UC-DR-06: Xem Lịch Sử Bệnh Nhân
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ xem lịch sử khám bệnh của một bệnh nhân cụ thể.

**Preconditions:**
- Bác sĩ đã đăng nhập

**Postconditions:**
- Lịch sử bệnh án được hiển thị

**Main Flow:**
1. Bác sĩ chọn bệnh nhân từ danh sách
2. Bác sĩ click "Xem lịch sử"
3. Hệ thống query `history` hoặc `bookings` WHERE patientId=? AND statusId='S3'
4. Hiển thị danh sách các lần khám (ngày, chẩn đoán, đơn thuốc)

**Alternative Flows:**
- **A1:** Bệnh nhân mới, chưa có lịch sử → "Bệnh nhân chưa có lịch sử khám"

---

### UC-DR-07: Xem Bệnh Lịch (Xem Bệnh Án)
*(Duplicate của UC-DR-06)*

---

### UC-DR-08: Cập Nhật Thông Tin
**Actor:** Bác sĩ

**Mô tả:** Bác sĩ cập nhật thông tin cá nhân và chuyên môn.

**Preconditions:**
- Bác sĩ đã đăng nhập

**Postconditions:**
- Thông tin được cập nhật trong `users`, `doctor_infos`, `markdown`

**Main Flow:**
1. Bác sĩ truy cập trang "Thông tin cá nhân"
2. Hệ thống hiển thị form với dữ liệu hiện tại
3. Bác sĩ chỉnh sửa:
   - Thông tin cá nhân: firstName, lastName, phoneNumber, address, avatar
   - Thông tin chuyên môn: note, contentMarkdown, contentHTML
4. Bác sĩ submit
5. Hệ thống validate dữ liệu
6. Hệ thống update `users`, `doctor_infos`, `markdown`
7. Trả về kết quả

**Alternative Flows:**
- **A1:** Validation lỗi → Hiển thị thông báo lỗi

---

## 4. Use Case chung

### UC-COMMON-01: Đăng Nhập
**Actor:** Admin, Bác sĩ, Bệnh nhân

**Mô tả:** User đăng nhập vào hệ thống bằng email và password.

**Preconditions:**
- User đã có tài khoản trong hệ thống

**Postconditions:**
- User được xác thực
- Session/JWT token được tạo
- User được redirect đến trang tương ứng với role

**Main Flow:**
1. User truy cập trang đăng nhập
2. User nhập email và password
3. User click "Đăng nhập"
4. Hệ thống validate:
   - Email và password không được rỗng
   - Email format hợp lệ
5. Hệ thống query `users` WHERE email=?
6. Hệ thống so sánh password (bcrypt.compare)
7. Nếu đúng:
   - Tạo session hoặc JWT token
   - Trả về user info (không bao gồm password)
   - Redirect theo roleId:
     - ADMIN → /admin/dashboard
     - DOCTOR → /doctor/dashboard
     - PATIENT → /home
8. Nếu sai → Trả về "Email hoặc mật khẩu không đúng"

**Alternative Flows:**
- **A1:** Email không tồn tại → "Email không tồn tại trong hệ thống"
- **A2:** Password sai → "Mật khẩu không chính xác"
- **A3:** Account bị khóa → "Tài khoản đã bị khóa"

**Exception Flows:**
- **E1:** Bcrypt compare error → Log error và trả về "Lỗi hệ thống"

---

### UC-COMMON-02: Đăng Xuất
**Actor:** Admin, Bác sĩ, Bệnh nhân

**Mô tả:** User đăng xuất khỏi hệ thống.

**Preconditions:**
- User đã đăng nhập

**Postconditions:**
- Session/JWT token bị xóa
- User bị redirect về trang login

**Main Flow:**
1. User click "Đăng xuất"
2. Hệ thống xóa session hoặc invalidate JWT token
3. Hệ thống redirect về trang đăng nhập
4. Hiển thị thông báo "Đã đăng xuất thành công"

---

### UC-COMMON-03: Xem Chi Tiết Bác Sĩ
**Actor:** Bệnh nhân, Khách (chưa đăng nhập)

**Mô tả:** Xem thông tin chi tiết của một bác sĩ.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Thông tin bác sĩ được hiển thị

**Main Flow:**
1. User click vào bác sĩ từ danh sách hoặc tìm kiếm
2. Hệ thống query:
   - `users` WHERE id=doctorId
   - JOIN `doctor_infos`, `markdown`, `docter_clinic_specialty`, `specialties`, `clinics`
   - JOIN `allcodes` (price, payment, province, position)
3. Hệ thống hiển thị:
   - Thông tin cá nhân (tên, avatar, chức danh)
   - Chuyên khoa, phòng khám
   - Giá khám, phương thức thanh toán
   - Mô tả chi tiết (HTML content)
   - Lịch khám khả dụng
4. User có thể click "Đặt lịch khám"

---

### UC-COMMON-04: Xem Chi Tiết Chuyên Khoa
**Actor:** Bệnh nhân, Khách

**Mô tả:** Xem thông tin chi tiết về một chuyên khoa và danh sách bác sĩ.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Thông tin chuyên khoa được hiển thị

**Main Flow:**
1. User click vào chuyên khoa từ trang chủ
2. Hệ thống query:
   - `specialties` WHERE id=specialtyId
   - JOIN `docter_clinic_specialty` để lấy danh sách bác sĩ
   - JOIN `users`, `doctor_infos` để lấy thông tin bác sĩ
3. Hệ thống hiển thị:
   - Tên chuyên khoa, hình ảnh
   - Mô tả chi tiết (HTML content)
   - Danh sách bác sĩ trong chuyên khoa
4. User có thể click vào bác sĩ để xem chi tiết

---

### UC-COMMON-05: Xem Chi Tiết Phòng Khám
**Actor:** Bệnh nhân, Khách

**Mô tả:** Xem thông tin chi tiết về một phòng khám và danh sách bác sĩ.

**Preconditions:**
- Không yêu cầu đăng nhập

**Postconditions:**
- Thông tin phòng khám được hiển thị

**Main Flow:**
1. User click vào phòng khám từ danh sách
2. Hệ thống query:
   - `clinics` WHERE id=clinicId
   - JOIN `doctor_infos` để lấy danh sách bác sĩ
   - JOIN `users` để lấy thông tin bác sĩ
3. Hệ thống hiển thị:
   - Tên phòng khám, địa chỉ, hình ảnh
   - Mô tả chi tiết
   - Danh sách bác sĩ trong phòng khám
4. User có thể click vào bác sĩ để xem chi tiết

---

## 5. Tổng kết

### Bảng tổng hợp Use Case

| ID | Use Case | Actor | Priority | Complexity |
|----|----------|-------|----------|------------|
| UC-AD-01 | Quản lý Chuyên Khoa | Admin | High | Medium |
| UC-AD-02 | Quản lý Người dùng | Admin | High | High |
| UC-AD-03 | Quản lý Bác sĩ | Admin | High | High |
| UC-AD-04 | Quản lý Phòng Khám | Admin | High | Medium |
| UC-AD-05 | Quản lý Giá Dịch Vụ | Admin | Medium | Low |
| UC-AD-06 | Thống Kê Báo Cáo | Admin | Medium | High |
| UC-PT-01 | Đăng Ký | Bệnh nhân | High | Medium |
| UC-PT-02 | Đăng Nhập | Bệnh nhân | High | Low |
| UC-PT-03 | Xem Log Hoạt Động | Bệnh nhân | Low | Medium |
| UC-PT-04 | Xem Lịch Khám Trống | Bệnh nhân | High | Medium |
| UC-PT-05 | Đặt Lịch Khám | Bệnh nhân | High | High |
| UC-PT-06 | Xác Thực Email | Bệnh nhân | High | Medium |
| UC-PT-07 | Xem Lịch Sử Khám | Bệnh nhân | Medium | Medium |
| UC-PT-08 | Xác Nhận Lịch Khám | Bệnh nhán | Medium | Low |
| UC-PT-09 | Tìm Kiếm Bác Sĩ | Bệnh nhân | High | Medium |
| UC-PT-10 | Xem Bảng Giá | Bệnh nhân | Low | Low |
| UC-PT-11 | Xem Đánh Giá | Bệnh nhân | Medium | Medium |
| UC-DR-01 | Đăng Nhập | Bác sĩ | High | Low |
| UC-DR-02 | Quản lý Lịch Khám | Bác sĩ | High | High |
| UC-DR-03 | Xem Danh Sách BN | Bác sĩ | High | Medium |
| UC-DR-04 | Xác Nhận Khám | Bác sĩ | High | Medium |
| UC-DR-05 | Gửi Hoá Đơn | Bác sĩ | Medium | Medium |
| UC-DR-06 | Xem Lịch Sử BN | Bác sĩ | Medium | Medium |
| UC-DR-08 | Cập Nhật Thông Tin | Bác sĩ | Medium | Low |
| UC-COMMON-01 | Đăng Nhập | All | High | Low |
| UC-COMMON-02 | Đăng Xuất | All | High | Low |
| UC-COMMON-03 | Xem Chi Tiết BS | All | High | Medium |
| UC-COMMON-04 | Xem Chi Tiết CK | All | Medium | Medium |
| UC-COMMON-05 | Xem Chi Tiết PK | All | Medium | Medium |

### Ghi chú kỹ thuật (Backend Implementation)

**Services cần implement:**
- **authService:** Login, logout, register, JWT token
- **userService:** CRUD users
- **doctorService:** Manage doctor info, schedule, patient list
- **patientService:** Booking, verify email, view history
- **specialtyService:** CRUD specialties, get doctors by specialty
- **clinicService:** CRUD clinics, get doctors by clinic
- **bookingService:** Create booking, verify, update status
- **scheduleService:** CRUD schedules, check availability
- **emailService:** Send emails (confirmation, invoice, reminder)
- **reportService:** Statistics and analytics

**API Routes cần tạo:**
```
POST   /api/login
POST   /api/logout
POST   /api/register
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/doctors
GET    /api/doctors/:id
POST   /api/doctors
PUT    /api/doctors/:id

GET    /api/doctor/schedule
POST   /api/doctor/schedule
GET    /api/doctor/patients
PUT    /api/doctor/confirm/:bookingId

POST   /api/patient/booking
GET    /api/patient/verify-booking?token=xxx&doctorId=yyy
GET    /api/patient/history

GET    /api/specialties
POST   /api/specialties (Admin)
GET    /api/specialties/:id

GET    /api/clinics
POST   /api/clinics (Admin)
GET    /api/clinics/:id

GET    /api/schedule?doctorId=xxx&date=yyy

GET    /api/admin/stats
```

**Middleware cần có:**
- **authMiddleware:** Verify JWT token
- **rbacMiddleware:** Check role permissions
- **validationMiddleware:** Validate input
- **errorHandler:** Centralized error handling
- **rateLimiter:** Prevent abuse

---

**End of Document**
