# TaskFlow — Production Real-Time Collaborative Task Management Platform

A high-performance, responsive, full-stack Task Management application built for modern multi-user collaboration. Features instant WebSocket state synchronization, strict Role-Based Access Control (RBAC), Optimistic Concurrency Control (OCC) collision handling, interactive discussion streams, and real-time user presence tracking.

---

## 🌟 Key Features

- **⚡ Real-Time Task Synchronization:** Instant status updates, task creation, edits, and deletions propagated across all active clients via **Socket.IO** with zero manual refreshes.
- **🛡️ Optimistic Concurrency Control (OCC):** Prevents simultaneous edit collisions using document version checks (`version` tag), returning structured `409 Conflict` (`TASK_MODIFIED`) responses when conflicting edits occur.
- **🔐 Secure Authentication & RBAC:** Stateless JWT authentication, bcrypt password hashing, and role-based permissions strictly separating **USER** and **ADMIN** capabilities.
- **🟢 Teammate Presence Tracking:** Real-time online/offline presence indicators (🟢 Online / ⚫ Offline) dynamically updating on WebSocket connect/disconnect.
- **🔔 Real-Time Notifications:** Dynamic unread notification badges, dropdown drawer, and non-blocking toast alerts for task assignments and status updates.
- **💬 Task Discussions & Audit Timeline:** Real-time collaborative comment streams and immutable activity history tracking every status and assignment transition.
- **🔍 Fast Search, Filters & Sorting:** Debounced multi-field search (title, description, assignee), compound filtering (status, priority, assignment, due date), and multi-column sorting.
- **📊 Live Dashboard Analytics:** Real-time summary statistics (Total, In Progress, Completed, Overdue, Urgent) automatically recalculating upon live updates.
- **📱 Responsive Ergonomics:** SaaS UI designed with Tailwind CSS, supporting Desktop, Laptop, Tablet, and Mobile devices with accessible keyboard navigation and skeleton loaders.
- **🧩 Modular Architecture:** Data layer decoupled via the Repository/Service pattern, ensuring persistence can transition seamlessly beyond MongoDB in future versions.
- **💰 100% Free & Open-Source:** Zero external paid API dependencies (no OpenAI, Google Maps, or Razorpay required).

---

## 🏗️ Technology Stack

| Tier | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18+) | Modern UI components with Hooks and Context API |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS | SaaS styling system with custom typography & palettes |
| **Icons** | Lucide React | Lightweight, accessible SVG icon library |
| **Client Networking** | Axios | Configured with automatic JWT request/response interceptors |
| **Client Real-Time** | Socket.IO Client | Auto-reconnect listeners, room subscriptions, presence tracking |
| **Backend Runtime** | Node.js + Express.js | High-throughput REST API server with rate limiting & helmet |
| **Real-Time Engine** | Socket.IO Server | Room broadcasting (`tasks:global`, `task:<id>`, `user:<id>`) |
| **Database** | MongoDB + Mongoose | Document database with compound indexes & schema constraints |
| **Authentication** | JWT + bcryptjs | Token-based stateless authentication & password hashing |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB community instance or free MongoDB Atlas cluster connection string

---

### Step 1: Clone or Open Project
```powershell
cd "c:\Users\UJJWAL SINGH\Task management Application"
```

---

### Step 2: Backend Setup & Seeding

1. Navigate to the `server/` directory:
   ```powershell
   cd server
   ```
2. Install backend dependencies:
   ```powershell
   npm install
   ```
3. Configure environment variables in `server/.env` (or copy from `.env.example`):
   ```ini
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=super_secret_jwt_key_replace_in_production_min_32_chars
   JWT_EXPIRE=24h
   CLIENT_URL=http://localhost:5173
   ```
4. **Seed the database** with demo accounts, sample tasks, comments, and activity logs:
   ```powershell
   npm run seed
   ```
5. Start the backend server:
   ```powershell
   npm run dev
   # or: npm start
   ```
   *The server will start at `http://localhost:5000` with WebSocket gateway ready.*

---

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the `client/` directory:
   ```powershell
   cd client
   ```
2. Install frontend dependencies:
   ```powershell
   npm install
   ```
3. Configure environment variables in `client/.env` (or copy from `.env.example`):
   ```ini
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```powershell
   npm run dev
   ```
5. Open your browser at **`http://localhost:5173`**.

---

## 👥 Demo Login Credentials

Use these seeded accounts to test multi-user collaboration and role permissions:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@taskflow.dev` | `AdminPassword123` | Full access, user directory, system metrics, delete any task |
| **User 1 (Lead)** | `ujjwal@taskflow.dev` | `UserPassword123` | Task CRUD, assignments, comments, personal metrics |
| **User 2 (Dev)** | `rahul@taskflow.dev` | `UserPassword123` | Task CRUD, status transitions, comments |
| **User 3 (Dev)** | `amit@taskflow.dev` | `UserPassword123` | Task CRUD, status transitions, comments |

---

## 📡 Real-Time WebSocket Architecture (Socket.IO)

### Room Topologies
- **`tasks:global`**: Broadcasts general task creation, deletion, and metric updates to all active workspace users.
- **`user:<userId>`**: Direct peer room for personal alerts, task assignment notifications, and mentions.
- **`task:<taskId>`**: Context-specific room for real-time task discussions, granular edits, and comment typing indicators.

### Event Specification
| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `task:created` | Server $\to$ Client | `{ task: TaskObject }` | Real-time card insertion into board and list |
| `task:updated` | Server $\to$ Client | `{ task: TaskObject }` | Real-time detail and priority updates |
| `task:statusChanged`| Server $\to$ Client | `{ taskId, status, version, updatedBy }` | Updates status pill and column positions |
| `task:assigned` | Server $\to$ Client | `{ taskId, taskTitle, assignedBy }` | Direct alert to newly assigned teammate |
| `comment:added` | Server $\to$ Client | `{ taskId, comment: CommentObject }` | Real-time comment stream append |
| `notification:new`| Server $\to$ Client | `{ notification: NotificationObject }` | Real-time bell count increment & toast |
| `user:online` | Server $\to$ Client | `{ userId, name }` | Sets user presence badge to 🟢 |
| `user:offline` | Server $\to$ Client | `{ userId }` | Sets user presence badge to ⚫ |
| `join:task` | Client $\to$ Server | `{ taskId }` | Subscribes client to specific task room |
| `leave:task` | Client $\to$ Server | `{ taskId }` | Unsubscribes client from task room |

---

## 🛡️ Optimistic Concurrency Control (OCC)

To prevent simultaneous overwrite conflicts in multi-user environments:
1. Every task document maintains an integer `version` field.
2. When a user submits an update, the client passes the current known `version`.
3. If the database version is higher than the client's version (indicating another user updated the task in the interim), the API rejects the request with HTTP `409 Conflict`:
   ```json
   {
     "success": false,
     "message": "This task was modified by another user.",
     "error": {
       "code": "TASK_MODIFIED",
       "currentTask": { "title": "...", "version": 3 }
     }
   }
   ```
4. The client automatically displays an **OCC Conflict Resolution Modal** prompting the user to view the latest version without losing data.

---

## 📚 RESTful API Reference

### Authentication & Users (`/api/auth`, `/api/users`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `confirmPassword`). Role defaults to `USER`.
- `POST /api/auth/login` — Authenticate credentials and receive signed JWT token.
- `GET /api/auth/me` — Retrieve currently logged-in user profile.
- `GET /api/auth/users` — List registered users for task assignment dropdowns.

### Task Management (`/api/tasks`)
- `POST /api/tasks` — Create new task (`title`, `description`, `priority`, `dueDate`, `assignedTo`).
- `GET /api/tasks` — Query tasks with search, pagination (`page`, `limit`), filtering (`status`, `priority`, `assignment`, `dueDateFilter`), and sorting.
- `GET /api/tasks/:id` — Retrieve task details, populated assignee, comments, and audit timeline.
- `PUT /api/tasks/:id` — Update task details (enforces OCC version checking).
- `PATCH /api/tasks/:id/status` — Fast status update (`status`, `version`).
- `PATCH /api/tasks/:id/assign` — Update task assignment (`assignedTo`, `version`).
- `PATCH /api/tasks/:id/priority` — Update task priority (`priority`, `version`).
- `DELETE /api/tasks/:id` — Delete task (Creator or Admin only).

### Comments (`/api/tasks/:id/comments`)
- `POST /api/tasks/:id/comments` — Add comment to task discussion stream.
- `GET /api/tasks/:id/comments` — Fetch all comments for a task.
- `DELETE /api/tasks/:id/comments/:commentId` — Delete comment (Author or Admin only).

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user notification list and unread count.
- `PATCH /api/notifications/:id/read` — Mark single notification as read.
- `PATCH /api/notifications/read-all` — Batch mark all notifications as read.

### Dashboard & Admin (`/api/dashboard`, `/api/admin`)
- `GET /api/dashboard/stats` — Personalized user metrics (total, in progress, completed, overdue, urgent).
- `GET /api/admin/stats` — Platform-wide statistics, status distributions, and collection totals (Admin only).
- `GET /api/admin/users` — User management directory with presence status (Admin only).
- `PATCH /api/admin/users/:id/role` — Update user role between `USER` and `ADMIN` (Admin only).
- `DELETE /api/admin/users/:id` — Deactivate/remove a user account (Admin only).

---

## 🧪 Multi-User Real-Time Testing Scenario

You can verify real-time capabilities by opening two distinct browser sessions:

1. **Browser 1 (e.g. Chrome):** Log in as `ujjwal@taskflow.dev` (Password: `UserPassword123`).
2. **Browser 2 (e.g. Chrome Incognito / Firefox):** Log in as `rahul@taskflow.dev` (Password: `UserPassword123`).
3. **Task Assignment Test:**
   - In Browser 1, create a task titled *"Verify WebSocket Events"* and assign it to *Rahul Kumar*.
   - In Browser 2, observe the new task card appear immediately, along with an unread notification badge: 🔔 *"Ujjwal Singh assigned you a new task"*.
4. **Status Change Test:**
   - In Browser 2, change the task status from **To Do** $\to$ **In Progress**.
   - In Browser 1, observe the status pill instantly switch to **In Progress** with no page refresh.
5. **Real-Time Comments Test:**
   - In Browser 1, open the task details and post a comment: *"Please review the API specs"*.
   - In Browser 2, watch the comment appear live in the discussion stream.
6. **Presence Test:**
   - Close Browser 2.
   - In Browser 1, notice Rahul's indicator switch from 🟢 **Online** to ⚫ **Offline**.

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push the repository to GitHub.
2. Import project in Vercel with Root Directory set to `client`.
3. Set environment variable: `VITE_API_URL=https://your-backend-service.onrender.com/api`.
4. Deploy!

### Backend (Render / Railway)
1. Create a new Web Service with Root Directory set to `server`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`).
5. Deploy!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
