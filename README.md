# MA03 Task Manager

A full-stack Task Management application built using the MERN stack.  
Users can register, log in, and manage their tasks with features such as creating, updating, completing, deleting, searching, filtering, and sorting tasks.

## Tech Stack

- Frontend: React, Vite, Axios, React Router, CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT, bcrypt
- Deployment: Netlify (Frontend), Render (Backend)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Yogesh-chouhan-hub/MA03-Task-Manager
cd MERN-Task-Manager
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside Backend:

```env
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_secret_key
PORT=3000
```

Start the backend:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

## API Documentation

### Authentication

Method Endpoint Description

- POST /signup Register a new user
- POST /login Login user
- POST /logout Logout user

### Tasks

All task APIs require:

```
Authorization: Bearer <token>
```

Method Endpoint Description

- POST /tasks Create a task
- GET /tasks Get all tasks
- GET /tasks/:taskId Get a single task
- PUT /tasks/:taskId Update a task
- PATCH /tasks/:taskId/toggle Toggle task completion
- DELETE /tasks/:taskId Delete a task
- DELETE /tasks/completed Delete all completed tasks

## Live Project

- Frontend: https://ma03-task-manager.netlify.app
- Backend: https://mern-task-manager-backend-8hij.onrender.com
