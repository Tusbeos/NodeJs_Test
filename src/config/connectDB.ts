import { Sequelize } from "sequelize";

// Khởi tạo kết nối Sequelize từ biến môi trường
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
  },
);

// Hàm kết nối database
export default async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected:", process.env.DB_NAME);
  } catch (err: any) {
    console.error("❌ DB error:", err.message);
    console.error({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      db: process.env.DB_NAME,
    });
    process.exit(1);
  }
}
