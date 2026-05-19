import { pool } from "../db/pool.js";

export const getAllTasks = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
    [userId]
  );

  return result.rows;
};

export const createTask = async ({
  title,
  description,
  is_completed,
  priority,
  status,
  dueDate,
  projectId,
  userId,
}) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, is_completed, priority, status, due_date, project_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      title,
      description,
      is_completed,
      priority,
      status,
      dueDate,
      projectId,
      userId,
    ]
  );

  return result.rows[0];
};

export const updateTask = async (
  id,
  {
    title,
    description,
    is_completed,
    priority,
    status,
    dueDate,
    projectId,
    userId,
  }
) => {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, is_completed = $3, priority = $4, status = $5, due_date = $6, project_id = $7 WHERE id = $8 AND user_id = $9 RETURNING *",
    [
      title,
      description,
      is_completed,
      priority,
      status,
      dueDate,
      projectId,
      id,
      userId,
    ]
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
