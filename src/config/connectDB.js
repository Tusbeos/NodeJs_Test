import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME, // js_db
  process.env.DB_USER, // app
  process.env.DB_PASS, // apppass
  {
    host: process.env.DB_HOST, // 127.0.0.1
    port: Number(process.env.DB_PORT), // 3307
    dialect: "mysql",
    logging: false,
  }
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
