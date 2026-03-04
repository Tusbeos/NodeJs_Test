# YÊU CẦU CHUYỂN ĐỔI DỰ ÁN TỪ NODE.JS + EXPRESS SANG JAVA SPRING BOOT

> **Dự án:** Hệ thống Đặt Lịch Khám Bệnh (Medical Appointment Booking System)  
> **Nguồn (Source):** Node.js 14+ / Express.js / Sequelize ORM / MySQL 8 / bcryptjs / Nodemailer / lodash / uuid  
> **Đích (Target):** Java 17+ / Spring Boot 3.2+ / Spring Data JPA (Hibernate 6) / MySQL 8  
> **Ngày tạo:** 2026

---

## MỤC LỤC

1. [Tổng quan & Mục tiêu chuyển đổi](#1-tổng-quan--mục-tiêu-chuyển-đổi)
2. [Yêu cầu môi trường & công cụ](#2-yêu-cầu-môi-trường--công-cụ)
3. [Kiến trúc tổng thể (Architecture)](#3-kiến-trúc-tổng-thể-architecture)
4. [Chuyển đổi Entity / Model](#4-chuyển-đổi-entity--model)
5. [Chuyển đổi Repository (Data Access Layer)](#5-chuyển-đổi-repository-data-access-layer)
6. [Chuyển đổi Service Layer (Business Logic)](#6-chuyển-đổi-service-layer-business-logic)
7. [Chuyển đổi Controller / API Endpoints](#7-chuyển-đổi-controller--api-endpoints)
8. [Xác thực & Phân quyền (Authentication & Authorization)](#8-xác-thực--phân-quyền-authentication--authorization)
9. [Xử lý Email](#9-xử-lý-email)
10. [Xử lý ảnh & file (Image / BLOB)](#10-xử-lý-ảnh--file-image--blob)
11. [Validation & Error Handling](#11-validation--error-handling)
12. [CORS & Middleware → Filter / Interceptor](#12-cors--middleware--filter--interceptor)
13. [Database Migration](#13-database-migration)
14. [Testing](#14-testing)
15. [Docker & Deployment](#15-docker--deployment)
16. [Bảng mapping chi tiết từng API](#16-bảng-mapping-chi-tiết-từng-api)
17. [Bảng mapping Use Case → Spring Component](#17-bảng-mapping-use-case--spring-component)
18. [Checklist tổng hợp](#18-checklist-tổng-hợp)

---

## 1. TỔNG QUAN & MỤC TIÊU CHUYỂN ĐỔI

### 1.1 Lý do chuyển đổi

- **Type Safety:** Java là ngôn ngữ strongly-typed, giảm lỗi runtime.
- **Enterprise Ecosystem:** Spring Boot cung cấp sẵn Security, Transaction, Validation, Caching, AOP.
- **Performance:** JVM tối ưu hóa tốt hơn cho hệ thống lớn, multi-thread native.
- **Maintainability:** Strong typing + annotation-based giúp code rõ ràng, dễ bảo trì.

### 1.2 Nguyên tắc chuyển đổi

| Nguyên tắc                     | Mô tả                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| **Giữ nguyên Database Schema** | Tái sử dụng MySQL schema hiện tại, không thay đổi tên bảng/cột                          |
| **Giữ nguyên API Contract**    | Các endpoint URL và request/response format giữ nguyên để Frontend React không phải sửa |
| **Nâng cấp Security**          | Thêm JWT Authentication + Role-based Authorization (hiện tại chưa có)                   |
| **Cải thiện Validation**       | Dùng Bean Validation thay vì check thủ công                                             |
| **Chuẩn hóa Error Response**   | Giữ format `{ errCode, message }` nhưng thêm HTTP status code chuẩn                     |

---

## 2. YÊU CẦU MÔI TRƯỜNG & CÔNG CỤ

### 2.1 Tech Stack bắt buộc

| Thành phần | Công nghệ                    | Version                | Mục đích                      |
| ---------- | ---------------------------- | ---------------------- | ----------------------------- |
| Language   | Java                         | 17 hoặc 21 (LTS)       | Runtime                       |
| Framework  | Spring Boot                  | 3.2+                   | Core framework                |
| Build Tool | Maven hoặc Gradle            | Maven 3.9+ / Gradle 8+ | Dependency management         |
| ORM        | Spring Data JPA + Hibernate  | 6.x                    | Thay thế Sequelize            |
| Database   | MySQL                        | 8.0+                   | Giữ nguyên                    |
| Security   | Spring Security 6 + jjwt     | 0.12+                  | JWT Auth                      |
| Validation | Hibernate Validator          | 8.x                    | Bean Validation               |
| Email      | Spring Mail (JavaMailSender) | -                      | Thay thế Nodemailer           |
| API Docs   | SpringDoc OpenAPI            | 2.3+                   | Swagger UI                    |
| Migration  | Flyway hoặc Liquibase        | -                      | Thay thế Sequelize migrations |
| Testing    | JUnit 5 + Mockito + MockMvc  | -                      | Unit + Integration test       |
| Container  | Docker + Docker Compose      | -                      | Giữ nguyên containerization   |

### 2.2 Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-mysql</artifactId>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>

    <!-- API Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 2.3 Cấu trúc thư mục Spring Boot

```
src/main/java/com/medical/booking/
├── MedicalBookingApplication.java          // @SpringBootApplication
├── config/
│   ├── SecurityConfig.java                 // Spring Security + JWT filter
│   ├── CorsConfig.java                     // CORS configuration
│   ├── WebConfig.java                      // Interceptors, formatters
│   └── OpenApiConfig.java                  // Swagger config
├── security/
│   ├── JwtTokenProvider.java               // Tạo & verify JWT
│   ├── JwtAuthenticationFilter.java        // OncePerRequestFilter
│   └── CustomUserDetailsService.java       // Load user từ DB
├── entity/
│   ├── User.java                           // ← models/users.js
│   ├── AllCode.java                        // ← models/allcode.js
│   ├── Booking.java                        // ← models/booking.js
│   ├── Schedule.java                       // ← models/schedule.js
│   ├── DoctorInfo.java                     // ← models/doctor_info.js
│   ├── DoctorClinicSpecialty.java          // ← models/docter_clinic_specialty.js
│   ├── Specialty.java                      // ← models/specialty.js
│   ├── Clinic.java                         // ← models/clinic.js
│   ├── Markdown.java                       // ← models/markdown.js
│   ├── History.java                        // ← models/history.js
│   └── DoctorService.java                  // ← models/doctor_services.js
├── repository/
│   ├── UserRepository.java
│   ├── AllCodeRepository.java
│   ├── BookingRepository.java
│   ├── ScheduleRepository.java
│   ├── DoctorInfoRepository.java
│   ├── DoctorClinicSpecialtyRepository.java
│   ├── SpecialtyRepository.java
│   ├── ClinicRepository.java
│   ├── MarkdownRepository.java
│   ├── HistoryRepository.java
│   └── DoctorServiceRepository.java
├── service/
│   ├── UserService.java                    // ← services/userService.js
│   ├── DoctorService.java                  // ← services/doctorService.js
│   ├── PatientService.java                 // ← services/patientService.js
│   ├── SpecialtyService.java               // ← services/specialtyService.js
│   ├── ClinicService.java                  // ← services/clinicService.js
│   ├── EmailService.java                   // ← services/emailService.js + emailTemplates.js
│   ├── AllCodeService.java                 // Mới - quản lý master data
│   └── AuthService.java                    // Mới - JWT login/register
├── controller/
│   ├── AuthController.java                 // POST /api/login
│   ├── UserController.java                 // ← controller/userController.js
│   ├── DoctorController.java               // ← controller/doctorController.js
│   ├── PatientController.java              // ← controller/patientController.js
│   ├── SpecialtyController.java            // ← controller/specialtyController.js
│   ├── ClinicController.java               // ← controller/clinicController.js
│   └── AllCodeController.java              // GET /api/allcode
├── dto/
│   ├── request/                            // Request DTOs (validation)
│   │   ├── LoginRequest.java
│   │   ├── CreateUserRequest.java
│   │   ├── UpdateUserRequest.java
│   │   ├── BookingRequest.java
│   │   ├── SaveDoctorInfoRequest.java
│   │   ├── BulkScheduleRequest.java        // { doctorId, formattedDate, arrSchedule[] }
│   │   ├── ScheduleRequest.java            // { timeType, date, doctorId }
│   │   ├── DoctorServicesRequest.java      // { doctorId, arrDoctorService[] }
│   │   ├── ConfirmBookingRequest.java      // { bookingId, doctorId?, statusId? }
│   │   ├── SpecialtyRequest.java
│   │   └── ClinicRequest.java
│   └── response/                           // Response DTOs
│       ├── ApiResponse.java                // { errCode, message, data }
│       ├── UserResponse.java
│       ├── DoctorDetailResponse.java
│       ├── ScheduleResponse.java
│       ├── BookingResponse.java
│       ├── SpecialtyResponse.java
│       └── ClinicResponse.java
├── mapper/
│   ├── UserMapper.java                     // Entity ↔ DTO (MapStruct)
│   ├── DoctorMapper.java
│   └── ...
├── exception/
│   ├── GlobalExceptionHandler.java         // @ControllerAdvice
│   ├── AppException.java                   // Custom exception
│   └── ErrorCode.java                      // Enum error codes
└── enums/
    ├── RoleEnum.java                       // R1, R2, R3
    ├── GenderEnum.java                     // M, F
    ├── PositionEnum.java                   // P0..P4
    ├── TimeTypeEnum.java                   // T1..T8
    └── StatusEnum.java                     // S1, S2, S3, S4
```

---

## 3. KIẾN TRÚC TỔNG THỂ (ARCHITECTURE)

### 3.1 So sánh kiến trúc

```
NODE.JS (Hiện tại)                    JAVA SPRING (Mục tiêu)
─────────────────                     ────────────────────
route/web.js                    →     @RestController + @RequestMapping
controller/*.js                 →     controller/*.java (thin controller)
services/*.js                   →     service/*.java (@Service, @Transactional)
models/*.js (Sequelize)         →     entity/*.java (@Entity, JPA)
(không có)                      →     repository/*.java (Spring Data JPA)
(không có)                      →     dto/request/*.java (Bean Validation)
(không có)                      →     dto/response/*.java (Response DTO)
(không có)                      →     mapper/*.java (MapStruct)
(không có)                      →     exception/ (Global handling)
config/connectDB.js             →     application.yml (auto-config)
(bcryptjs thủ công)             →     Spring Security + BCryptPasswordEncoder
(không có JWT)                  →     security/ (JWT filter chain)
lodash (_.differenceWith)       →     Java Stream API / CollectionUtils
uuid (v4)                       →     java.util.UUID.randomUUID()
nodemailer                      →     Spring Mail (JavaMailSender)
body-parser (limit: 50mb)       →     spring.servlet.multipart config
```

### 3.2 Luồng xử lý Request (Spring Boot)

```
Client Request
    ↓
CorsFilter (CORS)
    ↓
JwtAuthenticationFilter (Xác thực token)
    ↓
@RestController (Nhận request, validate DTO)
    ↓
@Service (Business logic, @Transactional)
    ↓
Repository (Spring Data JPA → Hibernate → MySQL)
    ↓
Entity → Mapper → Response DTO
    ↓
Client Response (JSON)
```

---

## 4. CHUYỂN ĐỔI ENTITY / MODEL

### 4.1 Nguyên tắc chung

- Mỗi Sequelize model → 1 JPA `@Entity` class
- `DataTypes.STRING` → `String`
- `DataTypes.INTEGER` → `Integer` hoặc `Long`
- `DataTypes.TEXT` → `@Lob String` hoặc `@Column(columnDefinition = "TEXT")`
- `DataTypes.BLOB('long')` → `@Lob byte[]` (hoặc chuyển sang URL String nếu dùng S3)
- `DataTypes.DATE` → `LocalDateTime` hoặc `LocalDate`
- `timestamps: true` → dùng `@CreatedDate` / `@LastModifiedDate` với `@EntityListeners`
- `belongsTo` → `@ManyToOne` + `@JoinColumn`
- `hasMany` → `@OneToMany(mappedBy = "...")`
- `hasOne` → `@OneToOne(mappedBy = "...")`

### 4.2 Chi tiết từng Entity

#### 4.2.1 User Entity (← models/users.js)

**Sequelize hiện tại:**

```javascript
// fields: email, password, firstName, lastName, address, phoneNumber, gender, image(BLOB), roleId, positionId
// associations: hasOne Markdown, hasOne DoctorInfo, hasMany Schedule, hasMany DoctorClinicSpecialty, hasMany Booking(doctor), hasMany Booking(patient)
```

**Spring JPA yêu cầu:**

```java
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;          // BCrypt hash

    private String firstName;
    private String lastName;
    private String address;

    @Column(columnDefinition = "TEXT")     // ⚠️ Sequelize: DataTypes.TEXT (không phải STRING)
    private String phoneNumber;

    // gender trỏ đến AllCode.keyMap (type = 'GENDER')
    private String gender;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;             // ⚠️ Xem xét chuyển sang URL

    // roleId trỏ đến AllCode.keyMap (type = 'ROLE')
    private String roleId;

    // positionId trỏ đến AllCode.keyMap (type = 'POSITION')
    private String positionId;

    // === Relationships ===
    @OneToOne(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Markdown markdown;

    @OneToOne(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private DoctorInfo doctorInfo;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "doctor")
    private List<DoctorClinicSpecialty> doctorClinicSpecialties;

    @OneToMany(mappedBy = "doctor")
    private List<Booking> doctorBookings;

    @OneToMany(mappedBy = "patient")
    private List<Booking> patientBookings;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**⚠️ Lưu ý quan trọng:**

- `gender`, `roleId`, `positionId` hiện lưu dạng String keyMap (`R1`, `M`, `P0`,...) reference tới bảng `allCodes`. Có 2 cách xử lý:
  - **Cách 1 (Khuyến nghị - giữ tương thích):** Giữ String, dùng `@ManyToOne @JoinColumn(name="roleId", referencedColumnName="keyMap")` trỏ tới AllCode
  - **Cách 2 (Refactor):** Chuyển thành Java Enum, nhưng cần migration data
- `image` dạng BLOB → **Khuyến nghị chuyển sang lưu URL** (upload S3/Cloudinary), thêm migration script convert base64 → file

#### 4.2.2 AllCode Entity (← models/allcode.js)

**Sequelize hiện tại:**

```javascript
// fields: keyMap(STRING), type(STRING), value_En(STRING), value_Vi(STRING)
// Dùng làm master data cho: ROLE, POSITION, GENDER, TIME, PRICE, PAYMENT, PROVINCE, STATUS
```

**Spring JPA yêu cầu:**

```java
@Entity
@Table(name = "allCodes")  // ⚠️ Sequelize tableName = "allCodes" (camelCase, freezeTableName: true)
public class AllCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "keyMap")
    private String keyMap;      // VD: "R1", "T1", "P0", "S1"

    private String type;        // VD: "ROLE", "TIME", "PRICE"
    private String valueEn;     // English label
    private String valueVi;     // Vietnamese label
}
```

**⚠️ Quyết định kiến trúc cần đưa ra:**

- **Giữ AllCode table:** Ưu điểm = không cần migration data, Frontend không sửa. Nhược điểm = query join nhiều.
- **Chuyển sang Enum:** Ưu điểm = type-safe, không cần join. Nhược điểm = cần migration, Frontend phải sửa nếu thêm giá trị mới qua DB.
- **Khuyến nghị:** Giữ AllCode table + tạo Java Enum song song để validation trong code.

#### 4.2.3 Booking Entity (← models/booking.js)

```java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String statusId;         // → AllCode (STATUS: S1, S2, S3, S4)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId")
    private User doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patientId")
    private User patient;

    private String date;             // ⚠️ Nên đổi sang LocalDate
    private String timeType;         // → AllCode (TIME: T1..T8)

    @Column(unique = true)
    private String token;            // UUID verify token

    private String birthday;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**⚠️ Lưu ý:**

- `date` hiện là STRING (timestamp dạng text) → Nên giữ STRING để tương thích Frontend, hoặc convert sang `LocalDate` nếu Frontend sẵn sàng.
- `token` dùng UUID → Spring dùng `UUID.randomUUID().toString()`.
- Cần `@Transactional` + `@Lock(LockModeType.PESSIMISTIC_WRITE)` khi tạo booking để tránh race condition.

#### 4.2.4 Schedule Entity (← models/schedule.js)

```java
@Entity
@Table(name = "schedules",
       uniqueConstraints = @UniqueConstraint(columnNames = {"doctorId", "date", "timeType"}))
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer currentNumber;   // Số lượng đặt hiện tại
    private Integer maxNumber;       // Số lượng tối đa

    private String date;             // Ngày khám (STRING timestamp)
    private String timeType;         // → AllCode (TIME)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId")
    private User doctor;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.5 DoctorInfo Entity (← models/doctor_info.js)

```java
@Entity
@Table(name = "doctor_infos")
public class DoctorInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId", unique = true)
    private User doctor;

    private String priceId;          // → AllCode (PRICE)
    private String provinceId;       // → AllCode (PROVINCE)
    private String paymentId;        // → AllCode (PAYMENT)

    private String addressClinic;
    private String nameClinic;

    private String note;               // ⚠️ Sequelize: DataTypes.STRING (không phải TEXT)

    private Long clinicId;           // FK tới Clinic
    private Integer count;           // Số lượt khám

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.6 DoctorClinicSpecialty Entity (← models/docter_clinic_specialty.js)

```java
@Entity
@Table(name = "doctor_clinic_specialty")
public class DoctorClinicSpecialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId")
    private User doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinicId")
    private Clinic clinic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialtyId")
    private Specialty specialty;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.7 Specialty Entity (← models/specialty.js)

```java
@Entity
@Table(name = "specialties")
public class Specialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;            // ⚠️ Nên chuyển sang URL

    @Column(columnDefinition = "TEXT")
    private String descriptionHTML;

    @Column(columnDefinition = "TEXT")
    private String descriptionMarkdown;

    @OneToMany(mappedBy = "specialty")
    private List<DoctorClinicSpecialty> specialtyDoctors;  // ← Sequelize: hasMany as "specialtyDoctors"

    // ⚠️ timestamps: false trong Sequelize → KHÔNG thêm @CreatedDate/@LastModifiedDate
}
```

#### 4.2.8 Clinic Entity (← models/clinic.js)

```java
@Entity
@Table(name = "clinics")
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;            // ⚠️ Nên chuyển sang URL

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageCover;       // ⚠️ Nên chuyển sang URL

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionHTML;

    @Column(columnDefinition = "LONGTEXT")
    private String descriptionMarkdown;

    @OneToMany(mappedBy = "clinic")
    private List<DoctorClinicSpecialty> doctorClinicSpecialties;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.9 Markdown Entity (← models/markdown.js)

```java
@Entity
@Table(name = "markdown")   // ⚠️ Sequelize tableName = "markdown" (không có 's')
public class Markdown {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "LONGTEXT")
    private String contentHTML;

    @Column(columnDefinition = "LONGTEXT")
    private String contentMarkdown;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId")        // ⚠️ Sequelize User.hasOne(Markdown, { foreignKey: "doctorID" })
    private User doctor;                   // column thực tế trong Markdown model là "doctorId"

    private Long specialtyId;
    private Long clinicId;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.10 History Entity (← models/history.js)

```java
@Entity
@Table(name = "histories")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer image;           // ⚠️ Kiểu INTEGER lạ - kiểm tra lại schema

    @Column(columnDefinition = "TEXT")
    private String files;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

#### 4.2.11 DoctorServices Entity (← models/doctor_services.js)

```java
@Entity
@Table(name = "doctor_services")
public class DoctorServiceEntity {   // Đổi tên tránh trùng với Spring @Service
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorId")
    private User doctor;

    private String nameVi;
    private String nameEn;
    private String price;            // ⚠️ Sequelize: DataTypes.STRING (không phải Integer)

    @Column(columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

---

## 5. CHUYỂN ĐỔI REPOSITORY (DATA ACCESS LAYER)

### 5.1 Nguyên tắc

- Sequelize query trực tiếp trong service → Spring tách thành `Repository` interface kế thừa `JpaRepository<Entity, Long>`
- Sequelize `findAll({ where: {...} })` → Spring Data derived query methods hoặc `@Query` JPQL
- Sequelize `include: [{ model }]` (eager loading) → JPA `@EntityGraph` hoặc `JOIN FETCH`

### 5.2 Các Repository cần tạo

```java
// === UserRepository ===
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Thay thế: db.User.findAll({ where: { roleId: 'R2' }, order: [['createdAt', 'DESC']], limit })
    List<User> findByRoleIdOrderByCreatedAtDesc(String roleId, Pageable pageable);

    // Top doctors - thay thế logic lọc count > 7
    @Query("SELECT u FROM User u WHERE u.roleId = 'R2' ORDER BY u.createdAt DESC")
    List<User> findTopDoctors(Pageable pageable);
}

// === AllCodeRepository ===
public interface AllCodeRepository extends JpaRepository<AllCode, Long> {
    List<AllCode> findByType(String type);
    Optional<AllCode> findByKeyMap(String keyMap);
}

// === BookingRepository ===
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByTokenAndDoctorId(String token, Long doctorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.token = :token AND b.statusId = :statusId")
    Optional<Booking> findByTokenAndStatusForUpdate(String token, String statusId);

    List<Booking> findByDoctorIdAndDate(Long doctorId, String date);
    // ⚠️ Node.js getPatientsByDoctorService KHÔNG lọc theo status → trả tất cả bookings

    boolean existsByPatientIdAndDoctorIdAndDateAndTimeType(
            Long patientId, Long doctorId, String date, String timeType);
    // ⚠️ Dùng cho findOrCreate logic

    // Thay thế: Booking.findOrCreate({ where: { ... } })
    // → Dùng service logic: existsByXxx() ? skip : save(new Booking(...))
}

// === ScheduleRepository ===
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorIdAndDate(Long doctorId, String date);

    @Modifying
    @Query("DELETE FROM Schedule s WHERE s.doctor.id = :doctorId AND s.date = :date")
    void deleteByDoctorIdAndDate(Long doctorId, String date);

    boolean existsByDoctorIdAndDateAndTimeType(Long doctorId, String date, String timeType);
}

// === DoctorInfoRepository ===
public interface DoctorInfoRepository extends JpaRepository<DoctorInfo, Long> {
    Optional<DoctorInfo> findByDoctorId(Long doctorId);
}

// === DoctorClinicSpecialtyRepository ===
public interface DoctorClinicSpecialtyRepository extends JpaRepository<DoctorClinicSpecialty, Long> {
    List<DoctorClinicSpecialty> findByDoctorId(Long doctorId);
    List<DoctorClinicSpecialty> findBySpecialtyId(Long specialtyId);
    List<DoctorClinicSpecialty> findByClinicId(Long clinicId);

    @Modifying
    void deleteByDoctorId(Long doctorId);

    @Modifying
    void deleteBySpecialtyId(Long specialtyId);

    @Modifying
    void deleteByClinicId(Long clinicId);
}

// === SpecialtyRepository ===
public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    // findAll, findById, save, deleteById → có sẵn từ JpaRepository
}

// === ClinicRepository ===
public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    // findAll, findById, save, deleteById → có sẵn từ JpaRepository
}

// === MarkdownRepository ===
public interface MarkdownRepository extends JpaRepository<Markdown, Long> {
    Optional<Markdown> findByDoctorId(Long doctorId);
}

// === DoctorServiceRepository ===
public interface DoctorServiceRepository extends JpaRepository<DoctorServiceEntity, Long> {
    List<DoctorServiceEntity> findByDoctorId(Long doctorId);

    @Modifying
    void deleteByDoctorId(Long doctorId);
}
```

---

## 6. CHUYỂN ĐỔI SERVICE LAYER (BUSINESS LOGIC)

### 6.1 Nguyên tắc chung

- Mỗi file `services/*.js` → 1 class `@Service` trong Spring
- Thêm `@Transactional` cho các method có write operations
- Thay `try/catch return { errCode }` → throw `AppException(ErrorCode.XXX)` + GlobalExceptionHandler
- Inject repository qua **constructor injection** (không dùng `@Autowired` trên field)

### 6.2 Mapping chi tiết

#### 6.2.1 userService.js → UserService.java

| Method Node.js                     | Method Spring                            | Thay đổi quan trọng                                      |
| ---------------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| `handleUserLogin(email, password)` | `AuthService.login(LoginRequest)`        | Tách sang AuthService, trả JWT token thay vì user data   |
| `checkUserEmail(email)`            | `UserRepository.existsByEmail(email)`    | Inline vào repository                                    |
| `getAllUsers(id)`                  | `getAllUsers(Long id)`                   | Dùng Pageable, trả DTO không trả entity                  |
| `createNewUser(data)`              | `createUser(CreateUserRequest)`          | Bean Validation tự động, BCryptPasswordEncoder           |
| `deleteUser(userId)`               | `deleteUser(Long userId)`                | Kiểm tra tồn tại trước khi xóa                           |
| `updateUserData(data)`             | `updateUser(Long id, UpdateUserRequest)` | Partial update, không cho sửa email/password qua API này |
| `hashUserPassword(password)`       | `passwordEncoder.encode(password)`       | Dùng Spring Security BCryptPasswordEncoder               |

**Logic cần chú ý:**

```java
// Node.js: let userData = new Buffer(data.avatar, 'base64')
// Spring: Xử lý base64 image
@Transactional
public UserResponse createUser(CreateUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new AppException(ErrorCode.EMAIL_EXISTS);
    }
    User user = userMapper.toEntity(request);
    user.setPassword(passwordEncoder.encode(request.getPassword()));

    // Xử lý image base64
    if (request.getAvatar() != null) {
        user.setImage(Base64.getDecoder().decode(request.getAvatar()));
    }

    return userMapper.toResponse(userRepository.save(user));
}
```

#### 6.2.2 doctorService.js → DoctorService.java

| Method Node.js                                  | Method Spring                                                   | Thay đổi quan trọng                                                      |
| ----------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `getTopDoctorHome(limit)`                       | `getTopDoctors(int limit)`                                      | Dùng `Pageable.ofSize(limit)`, EntityGraph cho AllCode join              |
| `getAllDoctors()`                               | `getAllDoctors()`                                               | Pageable + DTO projection                                                |
| `saveInfoDoctor(data)`                          | `saveDoctorInfo(SaveDoctorInfoRequest)`                         | `@Transactional` bọc cả Markdown + DoctorInfo + DoctorClinicSpecialty    |
| `getDetailDoctorByIdService(id)`                | `getDoctorDetail(Long id)`                                      | `@EntityGraph` load eager Markdown, DoctorInfo, AllCode                  |
| `bulkCreateSchedule(data)`                      | `bulkCreateSchedule(BulkScheduleRequest)`                       | Request: {doctorId, formattedDate, arrSchedule}, delete+recreate pattern |
| `getScheduleByDate(doctorId, date)`             | `getScheduleByDate(Long doctorId, String date)`                 | Repository derived query                                                 |
| `getExtraInfoDoctorById(id)`                    | `getExtraInfo(Long id)`                                         | Join DoctorInfo + AllCode price/payment/province                         |
| `getSpecialtiesByDoctorId(id)`                  | `getSpecialtiesByDoctorId(Long id)`                             | Join DoctorClinicSpecialty → Specialty                                   |
| `getDoctorSpecialtyById(specialtyId, location)` | `getDoctorsBySpecialty(Long specialtyId, String provinceId)`    | Complex join query                                                       |
| `getDoctorsByClinicId(clinicId)`                | `getDoctorsByClinic(Long clinicId)`                             | Join DoctorClinicSpecialty                                               |
| `bulkCreateDoctorServices(data)`                | `saveDoctorServices(Long doctorId, List<DoctorServiceRequest>)` | Delete all + bulkCreate → `deleteByDoctorId` + `saveAll`                 |
| `getListDoctorServices(doctorId)`               | `getDoctorServices(Long doctorId)`                              | Simple find                                                              |

**Logic phức tạp cần chú ý - saveInfoDoctor:**

```java
@Transactional  // ← QUAN TRỌNG: Node.js không có transaction, Spring phải có
public void saveDoctorInfo(SaveDoctorInfoRequest request) {
    // 1. Upsert Markdown
    Markdown markdown = markdownRepository.findByDoctorId(request.getDoctorId())
            .orElse(new Markdown());
    markdown.setDoctor(userRepository.getReferenceById(request.getDoctorId()));
    markdown.setContentHTML(request.getContentHTML());
    markdown.setContentMarkdown(request.getContentMarkdown());
    markdown.setDescription(request.getDescription());
    markdownRepository.save(markdown);

    // 2. Upsert DoctorInfo
    DoctorInfo info = doctorInfoRepository.findByDoctorId(request.getDoctorId())
            .orElse(new DoctorInfo());
    info.setDoctor(userRepository.getReferenceById(request.getDoctorId()));
    info.setPriceId(request.getPriceId());
    info.setProvinceId(request.getProvinceId());
    info.setPaymentId(request.getPaymentId());
    info.setAddressClinic(request.getAddressClinic());
    info.setNameClinic(request.getNameClinic());
    info.setNote(request.getNote());
    info.setClinicId(request.getClinicId());
    doctorInfoRepository.save(info);

    // 3. Replace DoctorClinicSpecialty (destroy all + bulk create)
    doctorClinicSpecialtyRepository.deleteByDoctorId(request.getDoctorId());
    List<DoctorClinicSpecialty> specialties = request.getSpecialties().stream()
            .map(s -> {
                DoctorClinicSpecialty dcs = new DoctorClinicSpecialty();
                dcs.setDoctor(userRepository.getReferenceById(request.getDoctorId()));
                dcs.setClinic(clinicRepository.getReferenceById(s.getClinicId()));
                dcs.setSpecialty(specialtyRepository.getReferenceById(s.getSpecialtyId()));
                return dcs;
            }).toList();
    doctorClinicSpecialtyRepository.saveAll(specialties);
}
```

#### 6.2.3 patientService.js → PatientService.java

| Method Node.js                               | Method Spring                                     | Thay đổi quan trọng                                    |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `patientBookAppointmentService(data)`        | `bookAppointment(BookingRequest)`                 | `@Transactional` + PESSIMISTIC_LOCK, UUID token        |
| `verifyBookAppointment(data)`                | `verifyBooking(String token, Long doctorId)`      | Update status S1 → S2                                  |
| `getPatientsByDoctorService(doctorId, date)` | `getPatientsByDoctor(Long doctorId, String date)` | Join User(patient) + AllCode(timeType)                 |
| `confirmPatientBookingService(data)`         | `confirmBooking(ConfirmBookingRequest)`           | Request: {bookingId, doctorId?, statusId?}, default S3 |

**Logic quan trọng - Đặt lịch khám:**

```java
@Transactional
public BookingResponse bookAppointment(BookingRequest request) {
    // 1. Validate input (Bean Validation đã làm trên DTO)

    // 2. Tìm hoặc tạo User (patient)
    User patient = userRepository.findByEmail(request.getEmail())
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(request.getEmail());
                newUser.setFirstName(request.getFirstName());
                newUser.setLastName(request.getLastName());
                newUser.setAddress(request.getAddress());
                newUser.setGender(request.getGender());
                newUser.setRoleId("R3");  // Patient role
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                return userRepository.save(newUser);
            });

    // 3. Tạo booking với token
    String token = UUID.randomUUID().toString();

    // ⚠️ Kiểm tra booking trùng lặp
    boolean exists = bookingRepository.existsByPatientIdAndDoctorIdAndDateAndTimeType(
            patient.getId(), request.getDoctorId(), request.getDate(), request.getTimeType());
    if (exists) {
        throw new AppException(ErrorCode.BOOKING_ALREADY_EXISTS);
    }

    Booking booking = new Booking();
    booking.setStatusId("S1");  // New
    booking.setDoctor(userRepository.getReferenceById(request.getDoctorId()));
    booking.setPatient(patient);
    booking.setDate(request.getDate());
    booking.setTimeType(request.getTimeType());
    booking.setToken(token);
    booking.setBirthday(request.getBirthday());
    booking.setReason(request.getReason());
    bookingRepository.save(booking);

    // 4. Gửi email xác nhận
    emailService.sendBookingConfirmation(booking, token);

    return bookingMapper.toResponse(booking);
}
```

#### 6.2.4 specialtyService.js → SpecialtyService.java

| Method Node.js             | Method Spring                                | Thay đổi                                                |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| `createNewSpecialty(data)` | `createSpecialty(SpecialtyRequest)`          | Bean Validation                                         |
| `getAllSpecialty()`        | `getAllSpecialties()`                        | Pageable                                                |
| `getSpecialtyByIds(ids)`   | `getSpecialtyByIds(String ids)`              | Nhận ids dạng "1,2,3" → split → findAll WHERE IN        |
| `updateSpecialty(data)`    | `updateSpecialty(Long id, SpecialtyRequest)` | Partial update                                          |
| `deleteSpecialty(id)`      | `deleteSpecialty(Long id)`                   | `@Transactional` xóa cả DoctorClinicSpecialty liên quan |

#### 6.2.5 clinicService.js → ClinicService.java

| Method Node.js            | Method Spring                          | Thay đổi                                                |
| ------------------------- | -------------------------------------- | ------------------------------------------------------- |
| `createNewClinic(data)`   | `createClinic(ClinicRequest)`          | Bean Validation, xử lý 2 BLOB images                    |
| `getDetailClinicById(id)` | `getClinicById(Long id)`               | Include doctors by clinic                               |
| `getAllClinic()`          | `getAllClinics()`                      | Pageable                                                |
| `updateClinic(data)`      | `updateClinic(Long id, ClinicRequest)` | Partial update                                          |
| `deleteClinic(id)`        | `deleteClinic(Long id)`                | `@Transactional` xóa cả DoctorClinicSpecialty liên quan |

#### 6.2.6 emailService.js + emailTemplates.js → EmailService.java

```java
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;  // Thymeleaf thay EJS

    // Constructor injection

    public void sendBookingConfirmation(Booking booking, String token) {
        // Node.js: dùng nodemailer transporter
        // Spring: dùng JavaMailSender
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(booking.getPatient().getEmail());
        helper.setSubject("Xác nhận đặt lịch khám bệnh");

        // Tạo HTML content từ Thymeleaf template
        Context context = new Context();
        context.setVariable("patientName", booking.getPatient().getFirstName());
        context.setVariable("time", booking.getTimeType());
        context.setVariable("doctorName", booking.getDoctor().getFirstName());
        context.setVariable("verifyUrl", buildVerifyUrl(token, booking.getDoctor().getId()));

        String htmlContent = templateEngine.process("booking-confirmation", context);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
```

**Cấu hình application.yml:**

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD} # App Password, không phải password Gmail
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

---

## 7. CHUYỂN ĐỔI CONTROLLER / API ENDPOINTS

### 7.1 Nguyên tắc

- Express `router.get/post/put/delete` → Spring `@GetMapping/@PostMapping/@PutMapping/@DeleteMapping`
- Request body validation: dùng `@Valid @RequestBody`
- Query params: dùng `@RequestParam`
- Path params: dùng `@PathVariable`
- **Giữ nguyên URL pattern** để Frontend React không phải sửa
- Response format chuẩn hóa qua `ApiResponse<T>`

### 7.2 Standard Response DTO

```java
@Data
@Builder
public class ApiResponse<T> {
    @Builder.Default
    private int errCode = 0;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .errCode(0)
                .message("OK")
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(int errCode, String message) {
        return ApiResponse.<T>builder()
                .errCode(errCode)
                .message(message)
                .build();
    }
}
```

### 7.3 Mapping Controller chi tiết

#### AuthController (Mới - tách từ userController)

```java
@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Thay thế: userController.handleLogin
        // Trả về JWT token thay vì chỉ user data
    }
}
```

#### UserController

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/get-all-users")           // ← GET /api/get-all-users?id=
    public ApiResponse<List<UserResponse>> getAllUsers(@RequestParam(required = false) Long id) { }

    @PostMapping("/create-new-user")        // ← POST /api/create-new-user
    @PreAuthorize("hasRole('ADMIN')")       // Chỉ Admin (R1) được tạo user
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) { }

    @PutMapping("/edit-user")               // ← PUT /api/edit-user
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> editUser(@Valid @RequestBody UpdateUserRequest request) { }

    @DeleteMapping("/delete-user")          // ← DELETE /api/delete-user?id=
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteUser(@RequestParam Long id) { }

    @GetMapping("/allcode")                 // ← GET /api/allcode?type=
    public ApiResponse<List<AllCode>> getAllCode(@RequestParam String type) { }
}
```

#### DoctorController

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DoctorController {

    @GetMapping("/top-doctor-home")                    // ← GET /api/top-doctor-home?limit=
    public ApiResponse<List<DoctorResponse>> getTopDoctors(@RequestParam(defaultValue = "10") int limit) { }

    @GetMapping("/get-all-doctors")                    // ← GET /api/get-all-doctors
    public ApiResponse<List<DoctorResponse>> getAllDoctors() { }

    @PostMapping("/save-info-doctors")                 // ← POST /api/save-info-doctors
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> saveDoctorInfo(@Valid @RequestBody SaveDoctorInfoRequest request) { }

    @GetMapping("/get-detail-doctor-by-id")            // ← GET /api/get-detail-doctor-by-id?id=
    public ApiResponse<DoctorDetailResponse> getDoctorDetail(@RequestParam Long id) { }

    @PostMapping("/bulk-create-schedule")              // ← POST /api/bulk-create-schedule
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ApiResponse<Void> bulkCreateSchedule(@Valid @RequestBody BulkScheduleRequest request) { }
    // ⚠️ Node.js nhận: { doctorId, formattedDate, arrSchedule: [{timeType, date, doctorId}...] }
    // → Cần tạo BulkScheduleRequest wrapper, KHÔNG phải List<ScheduleRequest> trực tiếp

    @GetMapping("/get-schedule-doctor-by-date")        // ← GET /api/get-schedule-doctor-by-date?doctorId=&date=
    public ApiResponse<List<ScheduleResponse>> getScheduleByDate(
            @RequestParam Long doctorId, @RequestParam String date) { }

    @PostMapping("/bulk-create-doctor-services")       // ← POST /api/bulk-create-doctor-services
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ApiResponse<Void> bulkCreateDoctorServices(@Valid @RequestBody DoctorServicesRequest request) { }

    @GetMapping("/get-list-doctor-services")           // ← GET /api/get-list-doctor-services?doctorId=
    public ApiResponse<List<DoctorServiceResponse>> getDoctorServices(@RequestParam Long doctorId) { }

    @GetMapping("/get-extra-info-doctor-by-id")        // ← GET /api/get-extra-info-doctor-by-id?doctorId=
    public ApiResponse<DoctorExtraInfoResponse> getExtraInfo(@RequestParam Long doctorId) { }

    @GetMapping("/get-specialties-by-doctor-id")       // ← GET /api/get-specialties-by-doctor-id?doctorId=
    public ApiResponse<List<Long>> getSpecialtiesByDoctor(@RequestParam Long doctorId) { }
    // ⚠️ Node.js trả về mảng specialtyId (List<Long>), không phải SpecialtyResponse

    @GetMapping("/get-doctor-specialty-by-id")         // ← GET /api/get-doctor-specialty-by-id?id=&location=
    public ApiResponse<List<DoctorResponse>> getDoctorsBySpecialty(
            @RequestParam Long id, @RequestParam(required = false) String location) { }

    @GetMapping("/get-doctors-by-clinic-id")           // ← GET /api/get-doctors-by-clinic-id?clinicId=
    public ApiResponse<List<DoctorResponse>> getDoctorsByClinic(@RequestParam Long clinicId) { }
}
```

#### PatientController

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PatientController {

    @PostMapping("/patient-book-appointment")          // ← POST /api/patient-book-appointment
    public ApiResponse<BookingResponse> bookAppointment(@Valid @RequestBody BookingRequest request) { }

    @PostMapping("/verify-book-appointment")           // ← POST /api/verify-book-appointment
    public ApiResponse<Void> verifyBooking(
            @RequestParam String token, @RequestParam Long doctorId) { }

    @GetMapping("/get-patients-by-doctor")             // ← GET /api/get-patients-by-doctor?doctorId=&date=
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ApiResponse<List<PatientBookingResponse>> getPatientsByDoctor(
            @RequestParam Long doctorId, @RequestParam String date) { }

    @PostMapping("/confirm-patient-booking")           // ← POST /api/confirm-patient-booking
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ApiResponse<Void> confirmBooking(@Valid @RequestBody ConfirmBookingRequest request) { }
    // ⚠️ Node.js nhận: { bookingId (bắt buộc), doctorId (tùy chọn - verify ownership), statusId (tùy chọn - default "S3") }
}
```

#### SpecialtyController

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpecialtyController {

    @PostMapping("/create-new-specialty")              // ← POST /api/create-new-specialty
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SpecialtyResponse> createSpecialty(@Valid @RequestBody SpecialtyRequest request) { }

    @PutMapping("/update-specialty")                   // ← PUT /api/update-specialty
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SpecialtyResponse> updateSpecialty(@Valid @RequestBody SpecialtyRequest request) { }

    @DeleteMapping("/delete-specialty")                // ← DELETE /api/delete-specialty?id=
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteSpecialty(@RequestParam Long id) { }

    @GetMapping("/get-all-specialty")                  // ← GET /api/get-all-specialty?limit=
    public ApiResponse<List<SpecialtyResponse>> getAllSpecialties(
            @RequestParam(required = false) Integer limit) { }

    @GetMapping("/get-specialty-by-ids")               // ← GET /api/get-specialty-by-ids?ids=1,2,3
    public ApiResponse<List<SpecialtyResponse>> getSpecialtyByIds(@RequestParam String ids) { }
    // ⚠️ Node.js nhận ids dạng "1,2,3" → split thành mảng → findAll WHERE id IN (...)
}
```

#### ClinicController

```java
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClinicController {

    @PostMapping("/create-new-clinic")                 // ← POST /api/create-new-clinic
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ClinicResponse> createClinic(@Valid @RequestBody ClinicRequest request) { }

    @PutMapping("/update-clinic")                      // ← PUT /api/update-clinic
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ClinicResponse> updateClinic(@Valid @RequestBody ClinicRequest request) { }

    @DeleteMapping("/delete-clinic")                   // ← DELETE /api/delete-clinic?id=
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteClinic(@RequestParam Long id) { }

    @GetMapping("/get-all-clinic")                     // ← GET /api/get-all-clinic?limit=
    public ApiResponse<List<ClinicResponse>> getAllClinics(
            @RequestParam(required = false) Integer limit) { }

    @GetMapping("/get-detail-clinic-by-id")            // ← GET /api/get-detail-clinic-by-id?id=
    public ApiResponse<ClinicDetailResponse> getClinicById(@RequestParam Long id) { }
}
```

---

## 8. XÁC THỰC & PHÂN QUYỀN (AUTHENTICATION & AUTHORIZATION)

### 8.1 Tình trạng hiện tại (Node.js)

- **Chỉ có login bằng email+password** (bcryptjs compare)
- **KHÔNG có JWT token** - trả user data trực tiếp
- **KHÔNG có authorization** - bất kỳ ai cũng gọi được mọi API
- **KHÔNG có middleware bảo vệ route**

### 8.2 Yêu cầu mới (Spring Boot)

#### 8.2.1 JWT Authentication Flow

```
1. POST /api/login (email + password)
   → Verify credentials
   → Generate JWT Access Token (15 phút) + Refresh Token (7 ngày)
   → Return tokens

2. Mọi request sau đó:
   → Header: Authorization: Bearer <access_token>
   → JwtAuthenticationFilter verify token
   → Set SecurityContextHolder
   → Proceed to controller

3. POST /api/refresh-token (Mới)
   → Nhận refresh token
   → Trả access token mới
```

#### 8.2.2 Role-based Authorization

| Role    | keyMap | Quyền truy cập                                                      |
| ------- | ------ | ------------------------------------------------------------------- |
| Admin   | R1     | Toàn bộ API (CRUD users, doctors, specialties, clinics)             |
| Doctor  | R2     | Quản lý schedule, xem patients, confirm booking, update profile     |
| Patient | R3     | Đặt lịch, xem lịch sử, verify booking                               |
| Public  | -      | Login, view doctors, view specialties, view clinics, verify booking |

#### 8.2.3 Security Config

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Cho phép @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // API stateless
            .cors(cors -> cors.configurationSource(corsConfigSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patient-book-appointment").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/verify-book-appointment").permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/top-doctor-home",
                    "/api/get-all-doctors",
                    "/api/get-detail-doctor-by-id",
                    "/api/get-schedule-doctor-by-date",
                    "/api/get-extra-info-doctor-by-id",
                    "/api/get-specialties-by-doctor-id",
                    "/api/get-all-specialty",
                    "/api/get-specialty-by-ids",
                    "/api/get-doctor-specialty-by-id",
                    "/api/get-all-clinic",
                    "/api/get-detail-clinic-by-id",
                    "/api/get-doctors-by-clinic-id",
                    "/api/get-list-doctor-services",
                    "/api/allcode"
                ).permitAll()
                // Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Tất cả còn lại cần xác thực
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // Giống bcryptjs salt rounds = 10
    }
}
```

**⚠️ Lưu ý quan trọng cho Frontend:**

- Frontend React cần cập nhật để gửi JWT token trong header `Authorization: Bearer <token>`
- Cần thêm logic refresh token khi access token hết hạn
- Lưu token vào `httpOnly cookie` hoặc `localStorage` (cân nhắc bảo mật)

---

## 9. XỬ LÝ EMAIL

### 9.1 So sánh

| Thành phần | Node.js (Hiện tại)                      | Spring Boot (Mục tiêu)       |
| ---------- | --------------------------------------- | ---------------------------- |
| Library    | Nodemailer                              | Spring Mail (JavaMailSender) |
| Template   | String template literal (HTML trong JS) | Thymeleaf template engine    |
| Transport  | SMTP Gmail                              | SMTP Gmail (giữ nguyên)      |
| Async      | async/await                             | `@Async` + `@EnableAsync`    |

### 9.2 Yêu cầu

- Tạo file template HTML bằng Thymeleaf tại `src/main/resources/templates/email/`
  - `booking-confirmation.html` → template xác nhận đặt lịch (song ngữ Vi/En)
  - `booking-verified.html` → template xác nhận thành công
- Dùng `@Async` để gửi email không block request chính
- Retry mechanism nếu gửi email thất bại

---

## 10. XỬ LÝ ẢNH & FILE (IMAGE / BLOB)

### 10.1 Tình trạng hiện tại

- **User.image:** `DataTypes.BLOB` → Lưu ảnh dạng binary trong MySQL
- **Specialty.image:** `DataTypes.BLOB('long')` → Lưu ảnh lớn
- **Clinic.image + imageCover:** `DataTypes.BLOB('long')` → 2 ảnh lớn
- Frontend gửi ảnh dạng **base64 string**, backend decode rồi lưu BLOB

### 10.2 Lựa chọn khi chuyển đổi

| Phương án                        | Mô tả                             | Ưu điểm                                 | Nhược điểm                    |
| -------------------------------- | --------------------------------- | --------------------------------------- | ----------------------------- |
| **A: Giữ BLOB**                  | Giữ nguyên cách lưu MySQL BLOB    | Không cần migration, Frontend không sửa | DB phình to, slow query       |
| **B: Chuyển sang File System**   | Lưu file trên server, DB lưu path | Đơn giản, nhanh                         | Mất file khi scale, không CDN |
| **C: Chuyển sang Cloud Storage** | S3 / Cloudinary / MinIO           | Scalable, CDN, chuyên nghiệp            | Cần setup thêm, có chi phí    |

### 10.3 Khuyến nghị

- **Phase 1 (MVP):** Giữ BLOB để đảm bảo tương thích, Sprint chuyển đổi nhanh
- **Phase 2 (Optimize):** Chuyển sang MinIO (self-hosted S3 compatible) + migration script convert BLOB → file URL
- **Cả hai phase:** Frontend vẫn gửi base64, backend decode + xử lý

---

## 11. VALIDATION & ERROR HANDLING

### 11.1 Validation

**Node.js hiện tại:** Check thủ công từng field

```javascript
// Ví dụ trong doctorService.js
let checkRequiredFields = (data) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', ...];
    for (let i = 0; i < arr.length; i++) {
        if (!data[arr[i]]) {
            result.isValid = false;
            result.element = arr[i];
            break;
        }
    }
};
```

**Spring Boot yêu cầu:** Bean Validation trên Request DTO

```java
public class SaveDoctorInfoRequest {
    @NotNull(message = "Doctor ID không được để trống")
    private Long doctorId;

    @NotBlank(message = "Content HTML không được để trống")
    private String contentHTML;

    @NotBlank(message = "Content Markdown không được để trống")
    private String contentMarkdown;

    @Size(max = 5000, message = "Description tối đa 5000 ký tự")
    private String description;

    private String priceId;
    private String provinceId;
    private String paymentId;
    private String addressClinic;
    private String nameClinic;
    private String note;
    private Long clinicId;

    @Valid
    private List<DoctorSpecialtyRequest> specialties;
}
```

### 11.2 Error Handling

**Global Exception Handler:**

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    // Validation errors → errCode: 1
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(ApiResponse.error(1, message));
    }

    // Business exceptions → errCode từ ErrorCode enum
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode.getCode(), errorCode.getMessage()));
    }

    // Unexpected errors → errCode: -1
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error(-1, "Lỗi hệ thống: " + ex.getMessage()));
    }
}
```

**Error Code Enum:**

```java
public enum ErrorCode {
    // Auth errors
    INVALID_CREDENTIALS(2, "Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    EMAIL_EXISTS(3, "Email đã tồn tại", HttpStatus.CONFLICT),
    TOKEN_EXPIRED(4, "Token đã hết hạn", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(5, "Không có quyền truy cập", HttpStatus.FORBIDDEN),

    // Resource errors
    USER_NOT_FOUND(10, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    DOCTOR_NOT_FOUND(11, "Không tìm thấy bác sĩ", HttpStatus.NOT_FOUND),
    SPECIALTY_NOT_FOUND(12, "Không tìm thấy chuyên khoa", HttpStatus.NOT_FOUND),
    CLINIC_NOT_FOUND(13, "Không tìm thấy phòng khám", HttpStatus.NOT_FOUND),
    BOOKING_NOT_FOUND(14, "Không tìm thấy lịch hẹn", HttpStatus.NOT_FOUND),

    // Business errors
    BOOKING_ALREADY_EXISTS(20, "Lịch hẹn đã tồn tại", HttpStatus.CONFLICT),
    SCHEDULE_FULL(21, "Lịch khám đã đầy", HttpStatus.CONFLICT),
    BOOKING_ALREADY_VERIFIED(22, "Lịch hẹn đã được xác nhận", HttpStatus.CONFLICT),
    MISSING_REQUIRED_FIELD(1, "Thiếu thông tin bắt buộc", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
```

---

## 12. CORS & MIDDLEWARE → FILTER / INTERCEPTOR

### 12.1 CORS

**Node.js hiện tại:** Dùng `cors` package middleware

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());
app.use(bodyParser.json({ limit: "50mb" })); // ⚠️ Limit 50MB cho base64 image
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
```

**Spring Boot yêu cầu:**

```java
@Bean
public CorsConfigurationSource corsConfigSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:3000",       // React dev (giống server.js hiện tại)
        "https://your-domain.com"      // Production
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Content-Type", "Authorization"));
    config.setAllowCredentials(true);  // ← credentials: true giống Node.js
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}
```

**⚠️ Spring Boot max request size (thay thế bodyParser limit 50mb):**

```yaml
# application.yml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
server:
  tomcat:
    max-http-form-post-size: 50MB
```

### 12.2 Middleware → Filter/Interceptor Mapping

| Express Middleware                         | Spring Equivalent                                | Mục đích                          |
| ------------------------------------------ | ------------------------------------------------ | --------------------------------- |
| `cors()`                                   | `CorsFilter` / `CorsConfigurationSource`         | Cross-origin                      |
| `express.json()`                           | Tự động (Spring Boot auto-config Jackson)        | Parse JSON body                   |
| `express.urlencoded()`                     | Tự động                                          | Parse form data                   |
| (Không có)                                 | `JwtAuthenticationFilter`                        | Xác thực JWT                      |
| (Không có)                                 | `@PreAuthorize`                                  | Phân quyền                        |
| (Không có)                                 | `HandlerInterceptor`                             | Logging, rate limit               |
| `bodyParser.json({ limit: '50mb' })`       | `spring.servlet.multipart.max-request-size=50MB` | Max request size cho base64 image |
| `bodyParser.urlencoded({ limit: '50mb' })` | `server.tomcat.max-http-form-post-size=50MB`     | Max form post size                |

---

## 13. DATABASE MIGRATION

### 13.1 Chiến lược

- **KHÔNG thay đổi schema hiện tại** → Giữ nguyên tất cả tên bảng, tên cột
- Dùng **Flyway** để quản lý migration thay Sequelize migrations
- Baseline migration (V1) = schema hiện tại
- Các migration tiếp theo cho cải thiện (nếu cần)

### 13.2 Flyway Setup

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    baseline-version: 0
    locations: classpath:db/migration
```

**Migration files:**

```
src/main/resources/db/migration/
├── V1__baseline_schema.sql         # Schema hiện tại (export từ MySQL)
├── V2__add_refresh_token_table.sql # Thêm bảng refresh_token cho JWT
└── V3__add_indexes.sql             # Thêm index tối ưu performance
```

### 13.3 Cổng kết nối application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:medical_booking}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: validate # CHỈ validate, KHÔNG auto-create/update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect
```

---

## 14. TESTING

### 14.1 Yêu cầu test coverage

| Layer                         | Tool                  | Coverage tối thiểu        |
| ----------------------------- | --------------------- | ------------------------- |
| Unit Test (Service)           | JUnit 5 + Mockito     | 80%                       |
| Integration Test (Repository) | @DataJpaTest          | 70%                       |
| API Test (Controller)         | MockMvc               | 90%                       |
| Security Test                 | @WithMockUser         | 100% các secured endpoint |
| Email Test                    | GreenMail (mock SMTP) | 100%                      |

### 14.2 Ví dụ test structure

```java
// === Unit Test: PatientService ===
@ExtendWith(MockitoExtension.class)
class PatientServiceTest {
    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private EmailService emailService;
    @InjectMocks private PatientService patientService;

    @Test
    void bookAppointment_shouldCreateBookingAndSendEmail() { ... }

    @Test
    void bookAppointment_shouldThrowWhenDuplicateBooking() { ... }

    @Test
    void verifyBooking_shouldUpdateStatusToS2() { ... }
}

// === Integration Test: Controller ===
@SpringBootTest
@AutoConfigureMockMvc
class DoctorControllerIntegrationTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void getTopDoctors_shouldReturnPublicly() throws Exception {
        mockMvc.perform(get("/api/top-doctor-home").param("limit", "10"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.errCode").value(0));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void saveDoctorInfo_shouldRequireAdmin() throws Exception { ... }
}
```

---

## 15. DOCKER & DEPLOYMENT

### 15.1 Dockerfile (Multi-stage build)

```dockerfile
# === Build Stage ===
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# === Run Stage ===
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 15.2 Docker Compose (Cập nhật)

```yaml
version: "3.8"
services:
  backend:
    build: .
    ports:
      - "8080:8080" # Thay đổi từ port Node.js
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=medical_booking
      - DB_USERNAME=root
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
    depends_on:
      mysql:
        condition: service_healthy

  mysql:
    image: mysql:8.0
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: medical_booking
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
```

### 15.3 Monitoring (Mới)

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when_authorized
```

---

## 16. BẢNG MAPPING CHI TIẾT TỪNG API

| #   | Method | URL (Giữ nguyên)                    | Node.js Source                            | Spring Controller                         | Auth Required | Role          |
| --- | ------ | ----------------------------------- | ----------------------------------------- | ----------------------------------------- | ------------- | ------------- |
| 1   | POST   | `/api/login`                        | userController.handleLogin                | AuthController.login                      | No            | -             |
| 2   | GET    | `/api/get-all-users`                | userController.handleGetAllUsers          | UserController.getAllUsers                | Yes           | ADMIN         |
| 3   | POST   | `/api/create-new-user`              | userController.handleCreateNewUser        | UserController.createUser                 | Yes           | ADMIN         |
| 4   | PUT    | `/api/edit-user`                    | userController.handleEditUser             | UserController.editUser                   | Yes           | ADMIN         |
| 5   | DELETE | `/api/delete-user`                  | userController.handleDeleteUser           | UserController.deleteUser                 | Yes           | ADMIN         |
| 6   | GET    | `/api/allcode`                      | userController.getAllCode                 | AllCodeController.getAllCode              | No            | -             |
| 7   | GET    | `/api/top-doctor-home`              | doctorController.getTopDoctorHome         | DoctorController.getTopDoctors            | No            | -             |
| 8   | GET    | `/api/get-all-doctors`              | doctorController.getAllDoctors            | DoctorController.getAllDoctors            | No            | -             |
| 9   | POST   | `/api/save-info-doctors`            | doctorController.saveInfoDoctor           | DoctorController.saveDoctorInfo           | Yes           | ADMIN         |
| 10  | GET    | `/api/get-detail-doctor-by-id`      | doctorController.getDetailDoctorById      | DoctorController.getDoctorDetail          | No            | -             |
| 11  | POST   | `/api/bulk-create-schedule`         | doctorController.bulkCreateSchedule       | DoctorController.bulkCreateSchedule       | Yes           | ADMIN, DOCTOR |
| 12  | GET    | `/api/get-schedule-doctor-by-date`  | doctorController.getScheduleByDate        | DoctorController.getScheduleByDate        | No            | -             |
| 13  | POST   | `/api/bulk-create-doctor-services`  | doctorController.bulkCreateDoctorServices | DoctorController.bulkCreateDoctorServices | Yes           | ADMIN, DOCTOR |
| 14  | GET    | `/api/get-list-doctor-services`     | doctorController.getListDoctorServices    | DoctorController.getDoctorServices        | No            | -             |
| 15  | GET    | `/api/get-extra-info-doctor-by-id`  | doctorController.getExtraInfoDoctorById   | DoctorController.getExtraInfo             | No            | -             |
| 16  | GET    | `/api/get-specialties-by-doctor-id` | doctorController.getSpecialtiesByDoctorId | DoctorController.getSpecialtiesByDoctor   | No            | -             |
| 17  | GET    | `/api/get-doctor-specialty-by-id`   | doctorController.getDoctorSpecialtyById   | DoctorController.getDoctorsBySpecialty    | No            | -             |
| 18  | GET    | `/api/get-doctors-by-clinic-id`     | doctorController.getDoctorsByClinicId     | DoctorController.getDoctorsByClinic       | No            | -             |
| 19  | POST   | `/api/patient-book-appointment`     | patientController.patientBookAppointment  | PatientController.bookAppointment         | No            | -             |
| 20  | POST   | `/api/verify-book-appointment`      | patientController.verifyBookAppointment   | PatientController.verifyBooking           | No            | -             |
| 21  | GET    | `/api/get-patients-by-doctor`       | patientController.getPatientsByDoctor     | PatientController.getPatientsByDoctor     | Yes           | ADMIN, DOCTOR |
| 22  | POST   | `/api/confirm-patient-booking`      | patientController.confirmPatientBooking   | PatientController.confirmBooking          | Yes           | ADMIN, DOCTOR |
| 23  | POST   | `/api/create-new-specialty`         | specialtyController.createNewSpecialty    | SpecialtyController.createSpecialty       | Yes           | ADMIN         |
| 24  | PUT    | `/api/update-specialty`             | specialtyController.updateSpecialty       | SpecialtyController.updateSpecialty       | Yes           | ADMIN         |
| 25  | DELETE | `/api/delete-specialty`             | specialtyController.deleteSpecialty       | SpecialtyController.deleteSpecialty       | Yes           | ADMIN         |
| 26  | GET    | `/api/get-all-specialty`            | specialtyController.getAllSpecialty       | SpecialtyController.getAllSpecialties     | No            | -             |
| 27  | GET    | `/api/get-specialty-by-ids`         | specialtyController.getSpecialtyByIds     | SpecialtyController.getSpecialtyByIds     | No            | -             |
| 28  | POST   | `/api/create-new-clinic`            | clinicController.createNewClinic          | ClinicController.createClinic             | Yes           | ADMIN         |
| 29  | PUT    | `/api/update-clinic`                | clinicController.updateClinic             | ClinicController.updateClinic             | Yes           | ADMIN         |
| 30  | DELETE | `/api/delete-clinic`                | clinicController.deleteClinic             | ClinicController.deleteClinic             | Yes           | ADMIN         |
| 31  | GET    | `/api/get-all-clinic`               | clinicController.getAllClinic             | ClinicController.getAllClinics            | No            | -             |
| 32  | GET    | `/api/get-detail-clinic-by-id`      | clinicController.getDetailClinicById      | ClinicController.getClinicById            | No            | -             |

---

## 17. BẢNG MAPPING USE CASE → SPRING COMPONENT

| Use Case ID  | Tên Use Case             | Controller              | Service Method                          | Repository                            | Ghi chú                           |
| ------------ | ------------------------ | ----------------------- | --------------------------------------- | ------------------------------------- | --------------------------------- |
| UC-AD-01     | Quản lý Chuyên khoa      | SpecialtyController     | SpecialtyService.create/update/delete   | SpecialtyRepo, DCSRepo                | Xóa cascade DoctorClinicSpecialty |
| UC-AD-02     | Quản lý Người dùng       | UserController          | UserService.create/update/delete/getAll | UserRepo                              | @PreAuthorize ADMIN               |
| UC-AD-03     | Quản lý Bác sĩ           | DoctorController        | DoctorService.saveDoctorInfo            | MarkdownRepo, DoctorInfoRepo, DCSRepo | @Transactional upsert 3 bảng      |
| UC-AD-04     | Quản lý Phòng khám       | ClinicController        | ClinicService.create/update/delete      | ClinicRepo, DCSRepo                   | Xử lý 2 BLOB images               |
| UC-AD-05     | Quản lý Giá khám         | DoctorController        | DoctorService.saveDoctorInfo            | DoctorInfoRepo                        | Lưu priceId → AllCode             |
| UC-AD-06     | Xem Báo cáo              | (Mới) ReportController  | (Mới) ReportService                     | Custom @Query                         | Chưa implement ở Node.js          |
| UC-PT-01     | Đăng ký tài khoản        | (Mới) AuthController    | AuthService.register                    | UserRepo                              | Mới - cần thêm API                |
| UC-PT-02     | Đăng nhập                | AuthController          | AuthService.login                       | UserRepo                              | JWT token response                |
| UC-PT-03     | Xem lịch khám Bác sĩ     | DoctorController        | DoctorService.getScheduleByDate         | ScheduleRepo                          | Public API                        |
| UC-PT-04     | Đặt lịch khám            | PatientController       | PatientService.bookAppointment          | BookingRepo, UserRepo                 | @Transactional, gửi email         |
| UC-PT-05     | Xác nhận Email           | PatientController       | PatientService.verifyBooking            | BookingRepo                           | Token verify, S1→S2               |
| UC-PT-06     | Xem lịch sử khám         | (Mới) PatientController | (Mới) PatientService.getHistory         | BookingRepo, HistoryRepo              | Chưa implement ở Node.js          |
| UC-PT-07     | Xác nhận đã khám         | PatientController       | PatientService.confirmBooking           | BookingRepo                           | S2→S3                             |
| UC-PT-08     | Tìm kiếm Bác sĩ          | DoctorController        | DoctorService.getDoctorsBySpecialty     | DCSRepo, UserRepo                     | Filter by specialty + province    |
| UC-PT-09     | Xem Giá khám             | DoctorController        | DoctorService.getExtraInfo              | DoctorInfoRepo, AllCodeRepo           | Join AllCode price                |
| UC-DR-01     | Đăng nhập (Bác sĩ)       | AuthController          | AuthService.login                       | UserRepo                              | Chung flow login + JWT            |
| UC-DR-02     | Quản lý Lịch khám        | DoctorController        | DoctorService.bulkCreateSchedule        | ScheduleRepo                          | Delete+recreate pattern           |
| UC-DR-03     | Xem DS Bệnh nhân         | PatientController       | PatientService.getPatientsByDoctor      | BookingRepo                           | @PreAuthorize DOCTOR              |
| UC-DR-04     | Xác nhận Khám xong       | PatientController       | PatientService.confirmBooking           | BookingRepo                           | Gửi hóa đơn qua email             |
| UC-DR-05     | Gửi Hóa đơn              | (Mới)                   | EmailService.sendInvoice                | BookingRepo                           | Chưa implement ở Node.js          |
| UC-DR-07     | Cập nhật Hồ sơ           | DoctorController        | DoctorService.updateProfile             | UserRepo, DoctorInfoRepo              | @PreAuthorize DOCTOR              |
| UC-COMMON-01 | Đăng nhập chung          | AuthController          | AuthService.login                       | UserRepo                              | Tất cả role                       |
| UC-COMMON-02 | Đăng xuất                | AuthController          | (Client-side xóa token)                 | -                                     | Stateless JWT                     |
| UC-COMMON-03 | Xem chi tiết Bác sĩ      | DoctorController        | DoctorService.getDoctorDetail           | Multiple repos                        | EntityGraph eager load            |
| UC-COMMON-04 | Xem chi tiết Chuyên khoa | SpecialtyController     | SpecialtyService.getById                | SpecialtyRepo, DCSRepo                | Include doctors list              |
| UC-COMMON-05 | Xem chi tiết Phòng khám  | ClinicController        | ClinicService.getById                   | ClinicRepo, DCSRepo                   | Include doctors list              |

---

## 18. CHECKLIST TỔNG HỢP

### Phase 1: Setup & Cấu trúc (Tuần 1)

- [ ] Khởi tạo Spring Boot project (start.spring.io)
- [ ] Cấu hình `application.yml` (MySQL, Mail, JWT secret)
- [ ] Setup Docker Compose mới
- [ ] Tạo package structure theo mục 2.3
- [ ] Cấu hình Flyway + baseline migration

### Phase 2: Entity & Repository (Tuần 1-2)

- [ ] Tạo 11 JPA Entity classes (User, AllCode, Booking, Schedule, DoctorInfo, DoctorClinicSpecialty, Specialty, Clinic, Markdown, History, DoctorServiceEntity)
- [ ] Tạo 11 Repository interfaces
- [ ] Verify entity mapping với DB schema hiện tại (`ddl-auto: validate`)
- [ ] Viết Repository integration tests (`@DataJpaTest`)

### Phase 3: Security (Tuần 2)

- [ ] Implement `SecurityConfig`
- [ ] Implement `JwtTokenProvider` (generate, validate, parse)
- [ ] Implement `JwtAuthenticationFilter`
- [ ] Implement `CustomUserDetailsService`
- [ ] Tạo `AuthController` + `AuthService` (login, refresh token)
- [ ] Viết Security tests

### Phase 4: DTO & Mapper (Tuần 2-3)

- [ ] Tạo Request DTOs với Bean Validation (8+ classes)
- [ ] Tạo Response DTOs (7+ classes)
- [ ] Tạo `ApiResponse<T>` wrapper
- [ ] Cấu hình MapStruct mappers
- [ ] Tạo `ErrorCode` enum + `GlobalExceptionHandler`

### Phase 5: Service Layer (Tuần 3-4)

- [ ] Implement `UserService` (CRUD + hash password)
- [ ] Implement `DoctorService` (getTop, getAll, saveInfo, getDetail, schedule, services)
- [ ] Implement `PatientService` (book, verify, getPatients, confirm)
- [ ] Implement `SpecialtyService` (CRUD)
- [ ] Implement `ClinicService` (CRUD)
- [ ] Implement `EmailService` (Thymeleaf template + JavaMailSender)
- [ ] Implement `AllCodeService`
- [ ] Viết Unit tests (Mockito) cho tất cả service

### Phase 6: Controller Layer (Tuần 4-5)

- [ ] Implement `AuthController` (login, refresh)
- [ ] Implement `UserController` (5 endpoints)
- [ ] Implement `DoctorController` (12 endpoints)
- [ ] Implement `PatientController` (4 endpoints)
- [ ] Implement `SpecialtyController` (5 endpoints)
- [ ] Implement `ClinicController` (5 endpoints)
- [ ] Implement `AllCodeController` (1 endpoint)
- [ ] Cấu hình CORS
- [ ] Viết MockMvc integration tests cho tất cả endpoints

### Phase 7: Testing & QA (Tuần 5-6)

- [ ] Chạy toàn bộ test suite
- [ ] Test thủ công với Postman/Swagger UI
- [ ] Test với Frontend React (kiểm tra tương thích API)
- [ ] Performance test (so sánh response time với Node.js)
- [ ] Security audit (kiểm tra authorization rules)

### Phase 8: Deployment (Tuần 6)

- [ ] Build Docker image (multi-stage)
- [ ] Update Docker Compose
- [ ] Setup CI/CD pipeline
- [ ] Cấu hình Spring Actuator monitoring
- [ ] Go live

### ⚠️ CÁC RISK & LƯU Ý ĐẶC BIỆT

| Risk                            | Mức độ     | Giải pháp                                   |
| ------------------------------- | ---------- | ------------------------------------------- |
| BLOB image performance          | Cao        | Phase 2 chuyển sang cloud storage           |
| AllCode join overhead           | Trung bình | Cache AllCode data, hoặc dùng `@Cacheable`  |
| `date` field kiểu STRING        | Trung bình | Giữ STRING cho tương thích, convert sau     |
| Frontend phải thêm JWT header   | Cao        | Cập nhật React axios interceptor            |
| Race condition khi booking      | Cao        | `@Transactional` + `PESSIMISTIC_WRITE` lock |
| N+1 query problem               | Cao        | Dùng `@EntityGraph` hoặc `JOIN FETCH`       |
| Email gửi đồng bộ block request | Trung bình | `@Async` + `@EnableAsync`                   |
| Không có Refresh Token          | Trung bình | Thêm refresh token table + API              |

---

> **Tài liệu tham chiếu:**
>
> - `docs/BA_Backend_Analysis.txt` - Phân tích hệ thống chi tiết
> - `docs/UseCase_Specifications.md` - Đặc tả Use Case
> - `docs/database-diagram.dbml` - Sơ đồ database
> - `docs/System-Analysis.md` - Phân tích hệ thống tổng quan
