import { pool } from "../db/pool.js";

export const getAllProjects = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE user_id = $1 ORDER BY id ASC",
    [userId]
  );

  return result.rows;
};

export const createProject = async ({ name, description, userId }) => {
  const result = await pool.query(
    "INSERT INTO projects (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
    [name, description, userId]
  );

  return result.rows[0];
};

export const updateProject = async (id, { name, description, userId }) => {
  const result = await pool.query(
    "UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *",
    [name, description, id, userId]
  );

  return result.rows[0];
};

export const deleteProject = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );

  return result.rows[0];
};

export const getProjectById = async (id, userId) => {
  if (!id) return null;

  const result = await pool.query(
    "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  return result.rows[0];
};
