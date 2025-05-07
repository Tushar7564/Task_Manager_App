const express = require('express'); // Import Express
const cors = require('cors');       // Import CORS middleware
const dotenv = require('dotenv');   // Import dotenv for env vars
const app = express();              // Create Express App
const port = process.env.PORT || 8080; // Use port from env or default 8080

dotenv.config();    // Load .env variables into process.env

app.use(cors());    // Enable CORS for all routes
app.use(express.json());    // Parse incoming JSON data

// Root route just for testing
app.get('/', (req, res) => res.send('API is running'));

// Import and mount /tasks routes (file created later)
const taskRouter = require('./routes/tasks');
app.use('/tasks', taskRouter);  // Prefix all task routes with /tasks

app.listen(port, () => console.log(`Server running on port: ${port}`));