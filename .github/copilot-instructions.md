# 1. Project Overview & Business Domain

- **Project Name:** Medical Appointment Booking System (Hệ thống đặt lịch khám bệnh).
- **Role:** Backend API Service (Node.js).
- **Client:** Frontend is React.js (Consumes APIs via HTTP/JSON).
- **Key Entities:**
  - **Doctor (Bác sĩ):** Has specialty, clinic, schedule, price.
  - **Patient (Bệnh nhân):** Books appointments, receives email confirmations.
  - **Clinic (Phòng khám):** Physical location containing doctors.
  - **Specialty (Chuyên khoa):** Categories like Cardio, Derma, etc.

# 2. Tech Stack & Architecture Rules

- **Language:** JavaScript (Node.js).
- **Framework:** Express.js (MVC Pattern).
- **Database:** MySQL using **Sequelize ORM**.
- **Response Format:** **ALWAYS return JSON** (`res.status(200).json(...)`).
  - DO NOT return HTML (`res.render`) because this is an API for React.
  - Exception: Only use EJS/HTML for generating email templates.

# 3. Folder Structure Context

- `src/models`: Sequelize models (define Database Schema).
- `src/services`: **ALL Business Logic goes here**. Database queries (CRUD) must happen here.
- `src/controller`: Receives Request -> Calls Service -> Returns Response. Keep controllers thin.
- `src/route`: Define API endpoints.
- `src/config`: Database connection and environment variables.

# 4. Coding Style & Behavior

- **Language:** - **Code/Variables:** English (CamelCase).
  - **Comments/Explanation:** **Vietnamese (Tiếng Việt)**.
- **Error Handling:** - Use `try/catch` in async functions.
  - Return standardized error objects: `{ errCode: 1, message: 'Lỗi...' }`.
- **CORS:** Remember to handle CORS since Frontend (React) runs on a different port.

# 5. Instructions for Copilot

- When I ask for code, explain the logic in Vietnamese first.
- When creating a new API, suggest both the **Route** and the **Controller** structure.
- Always check if a variable exists before using it to avoid `undefined` errors.
