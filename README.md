# TaskFlow - Full Stack Task Manager

TaskFlow is a full-stack SaaS-style task manager built with React, Express, and PostgreSQL. It supports authenticated users, personal tasks, projects, filtering, and a Kanban board with drag and drop.

## Features

- JWT authentication and protected routes
- Persistent login
- User-specific tasks
- Task CRUD
- Priority, status, and due date fields
- Projects and project filtering
- Search, filters, and sort persistence
- List view and Kanban board view
- Drag and drop status updates
- Frontend and backend validation
- Centralized API error handling
- Basic backend hardening with Helmet, CORS, rate limiting, and Morgan
- Responsive SaaS-style dashboard UI

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify
- DnD Kit
- FontAwesome

Backend:

- Node.js
- Express
- PostgreSQL
- pg
- JWT
- bcryptjs
- Zod
- Helmet
- express-rate-limit
- Morgan

Database:

- PostgreSQL
- Recommended deployment: Neon or Supabase

## Folder Structure

```txt
Task_Manager_App/
├── TM_Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── task-manager/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── DEPLOYMENT.md
└── README.md
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd Task_Manager_App
```

Install backend dependencies:

```bash
cd TM_Backend
npm install
```

Install frontend dependencies:

```bash
cd ../task-manager
npm install
```

## Environment Variables

Create `TM_Backend/.env`:

```env
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

Create `task-manager/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For local development, the frontend can also work through the Vite proxy when `VITE_API_BASE_URL` is not set.

## Database Setup

Create the database:

```sql
CREATE DATABASE taskmanager;
```

Run the tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(30) DEFAULT 'todo',
  due_date DATE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Run Commands

Start backend:

```bash
cd TM_Backend
npm run dev
```

Backend runs at:

```txt
http://localhost:8080
```

Start frontend:

```bash
cd task-manager
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

Build frontend:

```bash
cd task-manager
npm run build
```

Preview frontend build:

```bash
cd task-manager
npm run preview
```

## Deployment Plan

- Database: Neon or Supabase PostgreSQL
- Backend: Render or Railway
- Frontend: Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment notes.

## Screenshots

Add screenshots here:

- Login page
- Dashboard list view
- Kanban board
- Project filtering

## Live Demo

Frontend:

```txt
Coming soon
```

Backend health check:

```txt
Coming soon
```

## Author

Built by Tushar.
