import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  user: env.db.user,
  password: env.db.password,
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
});