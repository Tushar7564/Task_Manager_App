const { Pool } = require('pg'); // Importing the Pool module from the pg library
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'taskmanager',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
})

pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Failed to connect to the database:', err));

module.exports = pool;