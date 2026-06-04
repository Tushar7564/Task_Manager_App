import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "JWT_SECRET",
  "CLIENT_URL",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:");
  missingEnvVars.forEach((key) => console.error(`- ${key}`));
  console.error("Please add them to TM_Backend/.env and restart the server.");
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT),
  clientUrl: process.env.CLIENT_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  },
};
