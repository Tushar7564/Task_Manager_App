const express = require('express'); // Import Express framework
const router = express.Router();    // Create a new router instance
const db = require('../db');        // Import the PostgreSQL database connection from db.js

// Define GET route to fetch all tasks
router.get('/', async(req, res) => {
    try {
        // Query the database to get all tasks, ordered by most recent
        const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');

        // Send back the rows of tasks as JSON
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'No tasks found' });
        }

        res.json(result.rows);
    } catch (err) {
        // If there's an error, log it for better debugging
        console.error('Error fetching tasks:', err);

        // Respond with status 500 (Internal Server Error) and send an error message
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Define POST route to add a new task
router.post('/', async (req, res) => {
  const { title, description = "", is_completed = false } = req.body;

  if (!title || title.trim().length < 2) {
    return res.status(400).json({ message: 'Title must be at least 2 characters.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO tasks (title, description, is_completed) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description.trim(), !!is_completed]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding task:', err);
    return res.status(500).json({ message: 'Failed to add task' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description = "", is_completed = false } = req.body;

  if (!title || title.trim().length < 2) {
    return res.status(400).json({ message: 'Title must be at least 2 characters.' });
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
      [title.trim(), description.trim(), !!is_completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;

    try {
        // Delete the task from the database
        const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Send confirmation message
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;    // Export the router to use in index.js