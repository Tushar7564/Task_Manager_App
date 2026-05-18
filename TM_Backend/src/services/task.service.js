import { pool } from "../db/pool.js";

export const getAllTasks = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
    [userId]
  );

  return result.rows;
};

export const createTask = async ({ title, description, userId }) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, userId]
  );

  return result.rows[0];
};

export const updateTask = async (id, { title, description, is_completed, userId }) => {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
    [title, description, is_completed, id, userId]
  );

  return result.rows[0];
};

export const deleteTask = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );

  return result.rows[0];
};