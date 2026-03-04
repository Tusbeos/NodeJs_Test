import dotenv from "dotenv";
dotenv.config();

// Cấu hình Sequelize cho các môi trường
interface DBConfig {
  username: string | undefined;
  password: string | null | undefined;
  database: string | undefined;
  host: string | undefined;
  port?: number | string;
  dialect: string;
  logging?: boolean;
  timezone?: string;
  use_env_variable?: string;
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
  [key: string]: DBConfig;
}

const config: Config = {
  development: {
    username: process.env.DB_USER || "app",
    password: process.env.DB_PASS || "apppass",
    database: process.env.DB_NAME || "demo_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
};

export default config;
module.exports = config;
