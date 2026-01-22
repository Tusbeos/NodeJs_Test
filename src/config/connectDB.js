import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
  },
);

export default async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected:", process.env.DB_NAME);
  } catch (err) {
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
