🚀 **Task Manager – Full Stack CRUD App**

A modern, full-stack Task Management application built with React, Express, and PostgreSQL.
Designed to demonstrate strong frontend fundamentals, clean architecture, and RESTful backend practices.

✨ **Features**
🔹 **Core Functionality**

- Create, Read, Update, Delete tasks (Full CRUD)
- Mark tasks as completed / undo
- Edit tasks via modal
- Confirm delete modal
- Optimistic UI updates

🔹 **Productivity Enhancements**

- Filter: All / Active / Completed
- Search by title
- Sort:
    - Newest
    - Oldest
    - Title A–Z
    - Completed last
- Task counters per filter

🔹 **UX Improvements**

- Loading state
- Error handling with toast notifications
- Empty state handling
- Persistent UI preferences (filter & sort saved in localStorage)
- Clean, modern UI with Tailwind CSS

🛠 **Tech Stack**
**Frontend**
    - React (Vite)
    - Tailwind CSS
    - Axios
    - React Toastify

**Backend**
    - Node.js
    - Express.js
    - PostgreSQL
    - pg (node-postgres)

📂 **Project Structure**
Task_Manager_App/
│
├── TM_Backend/              # Express + PostgreSQL backend
│   ├── routes/
│   │   └── tasks.js
│   ├── db.js
│   ├── index.js
│   └── package.json
│
├── task-manager/            # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── main.jsx
│   └── package.json
│
└── README.md

⚙️ **Local Setup Instructions**
1️⃣ **Clone Repository**
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd Task_Manager_App

🗄 **Backend Setup (PostgreSQL + Express)**
2️⃣ **Create PostgreSQL Database**

Open PostgreSQL and run:
CREATE DATABASE taskmanager;

\c taskmanager;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3️⃣ **Configure Environment Variables**

Create:

TM_Backend/.env
PORT=8080
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taskmanager
DB_PASSWORD=YOUR_PASSWORD
DB_PORT=5432

4️⃣ **Install & Start Backend**

cd TM_Backend
npm install
npm run start

Backend runs at:
http://localhost:8080

💻 **Frontend Setup (React + Vite)**
5️⃣ **Install & Run Frontend**

cd task-manager
npm install
npm run dev

Frontend runs at:

http://localhost:5173

Vite proxy forwards /tasks to backend automatically.

🔁 API Endpoints
**Method**	**Endpoint**	**Description**
GET	        /tasks	        Fetch all tasks
POST	    /tasks	        Create new task
PUT	        /tasks/:id	    Update task
DELETE	    /tasks/:id	    Delete task

🧠 **Architecture Highlights**
🔹 **Clean Separation of Concerns**
- **TaskPage** → Container (state + API)
- **TaskList** → Presentation
- **TaskItem** → Pure UI component
- API calls centralized in **tasksApi.js**

🔹 **Optimistic Updates**
UI updates immediately for:
    - Toggle complete
    - Delete
    - Edit
Rollback handled on failure.

🔹 **Derived State Pattern**
**visibleTasks** is computed from:
    - tasks
    - filter
    - search
    - sort
Avoids unnecessary state duplication.

🎨 **UI Preview**

### Home Page
![Home Page](<Screenshot 2026-03-02 at 3.40.44 PM.png>)

### Edit Modal
![edit ui](<Screenshot 2026-03-02 at 3.41.39 PM.png>)

### Delete Modal
![delete ui](<Screenshot 2026-03-02 at 3.43.16 PM.png>)

🚀 **Possible Future Enhancements**

- Authentication (multi-user tasks)
- Due date + priority
- Drag-and-drop reordering
- Deployment (Render + GitHub Pages)
- Unit testing (Jest / React Testing Library)

📌 **Why This Project?**

This project demonstrates:
    - Full-stack integration
    - RESTful API design
    - Controlled components
    - State management patterns
    - UX best practices
    - Error handling
    - Clean folder architecture
    - Production-style code separation

📜 **License**

MIT License

👨‍💻 **Author**

Built by **Tushar**
Computer Science Graduate | Full Stack Developer