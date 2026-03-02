app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    return res.status(200).json(result.rows); // [] is fine
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: "Title must be at least 2 characters." });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title.trim(), description.trim()]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description = "", is_completed } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({ message: "Title must be at least 2 characters." });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, is_completed = $3
       WHERE id = $4
       RETURNING *`,
      [title.trim(), description.trim(), !!is_completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task deleted." });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});