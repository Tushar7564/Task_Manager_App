# Deployment Guide

This guide keeps deployment simple:

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon or Supabase PostgreSQL

## 1. Database Setup

Create a PostgreSQL database on Neon or Supabase, then copy the connection values into your backend environment variables.

Run this SQL in the database SQL editor:

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

## 2. Backend Deployment

Use Render or Railway.

Root directory:

```txt
TM_Backend
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Backend environment variables:

```env
PORT=8080
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=7d
```

After deployment, copy your backend URL. Example:

```txt
https://taskflow-api.onrender.com
```

## 3. Frontend Deployment

Use Vercel.

Root directory:

```txt
task-manager
```

Build command:

```bash
npm run build
```

Output directory:

```txt
dist
```

Frontend environment variables:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

After setting this value, redeploy the frontend.

## 4. Common Deployment Errors

### CORS Error

Problem:

```txt
Access to XMLHttpRequest has been blocked by CORS policy
```

Fix:

- Set backend `CLIENT_URL` to your exact Vercel URL.
- Include `https://`.
- Do not include a trailing slash.

### Database Connection Error

Fix:

- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, and `DB_NAME`.
- Make sure the database allows external connections.
- For hosted PostgreSQL, use the values provided by Neon or Supabase.

### Missing JWT_SECRET

Problem:

```txt
Missing required environment variables: JWT_SECRET
```

Fix:

- Add a long random value for `JWT_SECRET`.
- Redeploy the backend.

### Wrong API URL

Symptoms:

- Frontend login fails.
- Browser network tab calls the wrong domain.
- Requests go to Vercel instead of the backend.

Fix:

- Set `VITE_API_BASE_URL` in Vercel to the deployed backend URL.
- Redeploy the frontend after changing the variable.

## 5. Final Smoke Test

1. Open the deployed frontend.
2. Register a new user.
3. Login.
4. Create a project.
5. Create a task.
6. Edit, delete, and toggle a task.
7. Switch to Kanban view.
8. Drag a task between columns.
9. Refresh and confirm data persists.
