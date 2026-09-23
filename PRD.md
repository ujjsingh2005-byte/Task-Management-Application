# Product Requirements Document (PRD)
## Real-Time Task Management Application

---

**Document Version:** 1.0.0  
**Status:** Approved / Ready for Implementation  
**Product Target:** Production-Grade Real-Time Collaborative Task Management Platform  
**Author:** Senior Product Manager & Full-Stack Software Architect  
**Created:** September 2026  

---

## 1. Executive Summary & Product Overview

### 1.1 Product Vision
The **Real-Time Task Management Application** is a high-performance, secure, responsive, and real-time collaborative workspace designed to streamline project tracking, task delegation, workflow visibility, and team communication. It provides teams and individual users with an intuitive, unified interface to create, assign, prioritize, track, and discuss tasks with zero-latency synchronization across multiple connected clients.

### 1.2 Core Value Proposition
- **Instant Synchronization:** Bidirectional real-time state synchronization via WebSocket (Socket.IO) eliminating manual refreshes.
- **Role-Based Access Control (RBAC):** Strict boundaries separating standard Users from Administrators.
- **Conflict Resilience:** Optimistic Concurrency Control (OCC) using version checks to prevent overwrite anomalies in multi-user environments.
- **Enterprise-Grade Security:** Robust JWT authentication, bcrypt password hashing, data sanitization, security headers, and rate limiting.
- **Modular Architecture:** Layered, decoupled backend services with database abstraction, ensuring the persistence layer can transition smoothly beyond MongoDB in future iterations.
- **Original UI/UX Experience:** Modern SaaS design balancing density, visual hierarchy, responsive ergonomics, and WCAG accessibility standards without copying proprietary layouts.

### 1.3 Target Benchmarks & Inspiration
While drawing functional parallels from modern productivity platforms (e.g., Trello's status clarity, Asana's assignment accountability, Jira's status transitions, and Notion's clean typography), this application presents an original, lightweight, and focused SaaS interface tailored for modern agile workflows.

---

## 2. Technology Stack & Architectural Principles

### 2.1 Baseline Technology Stack

| Layer | Technology | Key Libraries / Modules |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18+) | Vite, React Router v6 |
| **Styling & Design System** | Tailwind CSS | Lucide React (Icons), Tailwind Typography |
| **Client Networking** | Axios | HTTP Interceptors, JWT Bearer Injection |
| **Client Real-Time** | Socket.IO Client | Reconnect logic, room listeners, event handlers |
| **Backend Runtime** | Node.js (LTS) | Express.js |
| **Real-Time Engine** | Socket.IO Server | Connection auth handshake, room broadcasting |
| **Primary Database** | MongoDB | Mongoose ODM |
| **Authentication & Crypto** | JSON Web Tokens (JWT) | bcryptjs, express-validator |
| **Security & Middleware** | Helmet, CORS, Express-Rate-Limit | Custom RBAC and Auth Middlewares |

### 2.2 Architectural Principles
1. **Zero External Paid Dependencies:** The application relies exclusively on open-source, self-hosted, or free-tier community tools. No third-party paid APIs (e.g., OpenAI, Google Maps, Razorpay) are utilized.
2. **Database Agnosticism / Modular Persistence:** Data access is abstracted behind service and repository layers. Database-specific logic (Mongoose queries) is isolated from business rules and controllers, allowing for seamless swapping of the persistence layer.
3. **Optimistic Concurrency Control (OCC):** Every mutable entity maintains a `version` / `updatedAt` tracking timestamp to detect and resolve collision events gracefully.
4. **Backend-First Authorization:** The frontend reflects permissions for UX only; every mutation is strictly authenticated and authorized on the Express backend before persistence.

---

## 3. Target User Personas & Role Matrix

```
                      +-----------------------------+
                      |   Authentication Boundary   |
                      +--------------+--------------+
                                     |
                    +----------------+----------------+
                    |                                 |
         +----------v----------+           +----------v----------+
         |     ROLE: USER      |           |     ROLE: ADMIN     |
         | (Standard Collaborator)|        | (Workspace Manager) |
         +----------+----------+           +----------+----------+
                    |                                 |
        +-----------+-----------+         +-----------+-----------+
        | - Create & edit tasks |         | - Full user management|
        | - Assign to teammates |         | - System-wide stats   |
        | - Comment & filter    |         | - Global task audit   |
        | - Update own task status|       | - Delete any task     |
        +-----------------------+         +-----------------------+
```

### 3.1 Role 1: User (Standard Collaborator)
- **Profile:** Developers, project contributors, and team members who execute daily tasks.
- **Capabilities:**
  - Self-register and authenticate securely.
  - View personal and team dashboard metrics.
  - Create tasks, edit tasks authored by or assigned to them.
  - Delete tasks they created.
  - Assign/reassign tasks to registered users.
  - Update task progress statuses (`TODO`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
  - Add, edit, and delete their own task comments.
  - Search, filter, and sort tasks across multiple dimensions.
  - Receive real-time push notifications and activity stream logs.
  - Manage personal profile settings and view online teammate presence.

### 3.2 Role 2: Admin (Workspace Administrator)
- **Profile:** Team leads, project managers, and systems administrators.
- **Capabilities:**
  - All User capabilities plus elevated oversight.
  - Access dedicated Admin Dashboard with aggregated system statistics.
  - View, edit, or delete any task across the system (audit and cleanup).
  - Access User Management console (view registered users, inspect roles, deactivate/activate accounts).
  - Monitor global activity feeds and handle stale or invalid records.
  - Provision and promote other users to Admin via internal secure admin utilities.

### 3.3 Role-Based Access Control (RBAC) Matrix

| Resource & Action | Guest / Unauth | User (Creator/Assignee) | User (Non-Creator) | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Register Account** | Yes (User only) | N/A | N/A | Provision |
| **Login / Logout** | Yes | Yes | Yes | Yes |
| **View Dashboard** | No | Yes (Personal metrics) | Yes (Personal metrics) | Yes (Global + Personal) |
| **Create Task** | No | Yes | Yes | Yes |
| **View Task Details** | No | Yes | Yes | Yes |
| **Edit Task Details** | No | Yes | View Only | Yes |
| **Update Task Status** | No | Yes | Yes (If Assigned/Member)| Yes |
| **Delete Task** | No | Yes (Creator only) | No | Yes (Any task) |
| **Assign Task** | No | Yes | Yes | Yes |
| **Add Comment** | No | Yes | Yes | Yes |
| **Edit/Delete Comment** | No | Yes (Own only) | No | Yes (Any comment) |
| **Manage Users** | No | No | No | Yes |
| **System Analytics** | No | No | No | Yes |

---

## 4. User Stories & Acceptance Criteria

### Epic 1: Identity & Access Management (IAM)
- **US-1.1 (Registration):** *As a new user, I want to create an account with my full name, email, and a secure password so that I can access the workspace.*
  - **Acceptance Criteria:**
    - Default role is hardcoded to `USER`. Admin role selection in public registration is rejected.
    - Password validation enforces $\ge 8$ chars, $\ge 1$ uppercase, $\ge 1$ lowercase, and $\ge 1$ number.
    - Duplicate email returns `409 Conflict` with a user-friendly message.
    - Passwords are hashed with bcrypt (salt rounds $\ge 10$).
- **US-1.2 (Authentication):** *As a registered user, I want to log in using my email and password so that I receive an authenticated session token.*
  - **Acceptance Criteria:**
    - Generates signed JWT payload containing `{ id, email, role }`.
    - Returns structured user profile object (excluding password hash).
    - Failed logins return `401 Unauthorized` without revealing whether the email exists.
- **US-1.3 (Route Protection):** *As an unauthenticated user, I should be redirected to login when trying to access `/dashboard` or `/tasks`.*

### Epic 2: Task Lifecycle & Management
- **US-2.1 (Task Creation):** *As a user, I want to create a task with a title, description, priority, assignee, and due date.*
  - **Acceptance Criteria:**
    - Title is mandatory (min 3 chars, max 100 chars).
    - Status defaults to `TODO`.
    - Priority defaults to `MEDIUM` if unspecified.
    - Automatically sets `createdBy` to the authenticated user ID.
    - Emits a real-time `task:created` WebSocket broadcast.
- **US-2.2 (Task Status Updates):** *As an assignee or creator, I want to transition a task between `TODO`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`.*
  - **Acceptance Criteria:**
    - Dedicated lightweight PATCH endpoint `/api/tasks/:id/status`.
    - Version is incremented upon each update.
    - Emits `task:statusChanged` with payload `{ taskId, status, updatedBy, version }`.
    - Real-time notification dispatched to creator/assignee.
- **US-2.3 (Task Concurrency Protection):** *As a user editing a task, I want to be notified if another team member saved changes while I was editing.*
  - **Acceptance Criteria:**
    - Client passes `version` on PUT/PATCH.
    - If incoming `version` $\neq$ database `version`, server returns `409 Conflict` (`TASK_MODIFIED`).
    - Client displays inline banner: *"⚠️ This task was modified by another user."* with a *[View Latest Version]* action button.

### Epic 3: Search, Filtering & Organization
- **US-3.1 (Search & Filter):** *As a user, I want to quickly locate tasks by keyword, status, priority, assignment, and due date.*
  - **Acceptance Criteria:**
    - Search queries match task `title`, `description`, or assigned user name.
    - Search input is debounced (300ms) on the client side.
    - Filters support combined criteria (e.g., `status=IN_PROGRESS&priority=HIGH&assignment=MY_TASKS`).
    - Due date presets: `Today`, `Tomorrow`, `This Week`, `Overdue`.
- **US-3.2 (Sorting):** *As a user, I want to sort tasks by `Newest`, `Oldest`, `Priority`, `Due Date`, and `Recently Updated`.*

### Epic 4: Collaborative Comments & Activity Timeline
- **US-4.1 (Task Comments):** *As a team member, I want to leave comments on a task to discuss progress and blockers.*
  - **Acceptance Criteria:**
    - Comment text is validated (non-empty, max 1000 characters).
    - Populates author details (name, avatar, ID).
    - Real-time broadcast `comment:added` to all clients viewing that task.
- **US-4.2 (Audit Timeline):** *As a user, I want to view an immutable timeline of all actions taken on a task.*
  - **Acceptance Criteria:**
    - Logs creation, assignment changes, status transitions, and priority modifications.
    - Formats timestamps cleanly with relative time (e.g., *"10 minutes ago"*).

### Epic 5: Real-Time Notifications & Presence
- **US-5.1 (Real-Time Notifications):** *As a user, I want to receive immediate alerts when I am assigned a task or when my task is updated/completed.*
  - **Acceptance Criteria:**
    - Notification bell with dynamic badge count of unread notifications.
    - Dropdown with actions: *Mark as Read*, *Mark All as Read*, and *View Task*.
    - Non-blocking toast alert pops up when a new notification arrives.
- **US-5.2 (User Presence):** *As a collaborator, I want to see which team members are currently online.*
  - **Acceptance Criteria:**
    - Socket connection binds authenticated user ID to active socket registry.
    - Emits `user:online` and `user:offline` events.
    - Displays green indicator (🟢) for online and gray (⚫) for offline users.

### Epic 6: Dashboard & Analytics
- **US-6.1 (Live Metrics):** *As a user, I want to view summary cards of Total, Pending, In Progress, Completed, Overdue, and High Priority tasks that update in real time.*
  - **Acceptance Criteria:**
    - Metric counts update instantly on incoming WebSocket events without full-page reloads.

---

## 5. Functional Requirements (FR)

### FR-1: Authentication & Authorization
- **FR-1.1:** System shall provide JWT-based stateless authentication with token expiration set to 24 hours.
- **FR-1.2:** System shall protect API endpoints using a bearer token validation middleware.
- **FR-1.3:** System shall provide role-based middleware (`requireAdmin`, `requireTaskOwnershipOrAssignee`).
- **FR-1.4:** Registration shall strictly validate schema fields: `name`, `email`, `password`, `confirmPassword`.
- **FR-1.5:** Passwords must be hashed using `bcryptjs` with salt round $\ge 10$.

### FR-2: Task Management & Workflow
- **FR-2.1:** System shall enforce valid Task Status transitions: `TODO` $\leftrightarrow$ `IN_PROGRESS` $\leftrightarrow$ `COMPLETED` $\leftrightarrow$ `CANCELLED`.
- **FR-2.2:** System shall support 4 Priority levels: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- **FR-2.3:** System shall validate and store ISO-8601 UTC due dates.
- **FR-2.4:** System shall automatically generate an activity log entry for every status, priority, or assignee change.
- **FR-2.5:** System shall restrict task deletion to the Task Creator and Admins.

### FR-3: Real-Time Engine (Socket.IO)
- **FR-3.1:** Socket server shall authenticate connections during the handshake using the JWT token.
- **FR-3.2:** System shall implement room-based event delivery:
  - User-specific room: `user:<userId>` (for direct notifications, assignments).
  - Task-specific room: `task:<taskId>` (for task details, active comments, editing events).
  - Global channel: `tasks:global` (for dashboard metrics and list changes).
- **FR-3.3:** System shall emit standardized events: `task:created`, `task:updated`, `task:deleted`, `task:statusChanged`, `task:assigned`, `comment:added`, `notification:new`, `user:online`, `user:offline`.

### FR-4: Collaborative Comments
- **FR-4.1:** Authenticated users can submit comments on any accessible task.
- **FR-4.2:** Users can edit or delete only their own comments (Admins can delete any comment).
- **FR-4.3:** Comment creation shall trigger a notification to the task creator and assignee (if different from the commenter).

### FR-5: Notification Engine
- **FR-5.1:** Persists notifications in MongoDB with fields: `userId`, `taskId`, `message`, `type`, `isRead`, `createdAt`.
- **FR-5.2:** Supported notification types: `TASK_ASSIGNED`, `STATUS_CHANGED`, `COMMENT_ADDED`, `DEADLINE_APPROACHING`, `TASK_COMPLETED`.
- **FR-5.3:** Provides REST endpoints to query notifications, mark individual items as read, and batch mark all as read.

### FR-6: Search, Filter, and Sort Engine
- **FR-6.1:** Case-insensitive search on `title` and `description` using MongoDB regex/text indices.
- **FR-6.2:** Multi-faceted filtering by `status`, `priority`, `assignedTo`, `createdBy`, and `dueDate` range.
- **FR-6.3:** Server-side pagination with default `limit=10`, returning `page`, `totalPages`, `totalRecords`, and `data`.

### FR-7: Dashboard Analytics
- **FR-7.1:** Aggregate metrics calculated per user and globally for admins.
- **FR-7.2:** Real-time incremental client-side cache updates or lightweight delta recalculation upon receiving socket events.

### FR-8: User Presence Tracker
- **FR-8.1:** In-memory socket mapping (`userId -> Set<socketId>`) on the server.
- **FR-8.2:** Emits `user:online` when user connects their first active socket; emits `user:offline` when all sockets for that user disconnect.

---

## 6. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
- **API Response Time:** 95% of standard CRUD API requests must respond in $< 150\text{ ms}$.
- **Real-Time Delivery:** Socket.IO events must be broadcast and received by clients within $< 100\text{ ms}$ of database write confirmation.
- **Client Rendering:** Client initial bundle size must remain $< 350\text{ KB}$ gzipped through code splitting and Vite tree-shaking.

### NFR-2: Security & Data Protection
- **Injection Prevention:** Parameterized Mongoose queries; no raw string concatenation in queries.
- **XSS & Header Hardening:** `helmet` middleware enabled on Express; input sanitized against malicious HTML tags.
- **CORS Policy:** Strict origin whitelisting allowing only authorized client URLs.
- **Rate Limiting:** `express-rate-limit` restricting auth endpoints (max 10 attempts per 15 minutes per IP) and standard API endpoints (max 100 requests per minute).
- **Secrets Management:** Zero hardcoded tokens or connection strings; all configured via `.env`.

### NFR-3: Reliability, Availability & Error Handling
- **Graceful Error Handling:** Central Express error handling middleware ensuring no unhandled promise rejections or raw stack traces leak to the client.
- **Standardized Error Envelope:** Every API error returns `{ success: false, message: string, error: { code, details } }`.
- **Socket Heartbeats:** Automatic ping/pong reconnects with fallback backoff strategy.

### NFR-4: Concurrency & Data Consistency
- **Optimistic Concurrency Control:** Task model maintains integer `version` field. Updates check `version` match and increment atomically (`$inc: { version: 1 }`).

### NFR-5: Usability & Accessibility (a11y)
- **WCAG 2.1 AA Compliance:** Minimum color contrast ratio $\ge 4.5:1$ for normal text.
- **Keyboard Navigation:** Full focus management for modals, dropdowns, and task forms.
- **Semantic HTML:** `<main>`, `<nav>`, `<aside>`, `<header>`, `<article>`, `<button>` properly utilized.

---

## 7. System Architecture & Modular Design

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT TIER                                      |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                          React 18 + Vite SPA                                |  |
|  |                                                                             |  |
|  |  +------------------+  +-------------------+  +--------------------------+  |  |
|  |  |  Pages / Views   |  | Reusable UI Atoms |  | Global State / Context   |  |  |
|  |  | (Dashboard, Task,|  | (Cards, Modals,   |  | (AuthContext,            |  |  |
|  |  |  Admin, Profile) |  |  Badges, Skeletons|  |  SocketContext,          |  |  |
|  |  +--------+---------+  +---------+---------+  |  TaskContext)            |  |  |
|  |           |                      |            +------------+-------------+  |  |
|  |           +----------------------+-------------------------+                |  |
|  |                                  |                                          |  |
|  |        +-------------------------v-------------------------+                |  |
|  |        |      Service Layer (Axios HTTP + Socket Client)   |                |  |
|  |        +-------------------------+-------------------------+                |  |
|  +----------------------------------|------------------------------------------+  |
+-------------------------------------|---------------------------------------------+
                                      | HTTP REST / WebSocket (WS)
+-------------------------------------v---------------------------------------------+
|                                  SERVER TIER                                      |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           Express.js Application                            |  |
|  |                                                                             |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | Security Pipeline: Helmet | CORS | Rate-Limiter | Body-Parser | Auth  |  |  |
|  |  +-----------------------------------+-----------------------------------+  |  |
|  |                                      |                                      |  |
|  |        +-----------------------------v-----------------------------+        |  |
|  |        |                       Route Handlers                      |        |  |
|  |        |   (/api/auth, /api/tasks, /api/comments, /api/notifications)     |  |  |
|  |        +-----------------------------+-----------------------------+        |  |
|  |                                      |                                      |  |
|  |        +-----------------------------v-----------------------------+        |  |
|  |        |                       Controller Layer                    |        |  |
|  |        |             (Input validation & orchestration)            |        |  |
|  |        +-------------------+--------------------+------------------+        |  |
|  |                            |                    |                           |  |
|  |        +-------------------v---+            +---v------------------+        |  |
|  |        |     Service Layer     |            |  Socket.IO Gateway   |        |  |
|  |        |  (Business logic &    |            | (Event broadcasting, |        |  |
|  |        |   OCC verification)   |            |  rooms & presence)   |        |  |
|  |        +-------------------+---+            +----------------------+        |  |
|  |                            |                                                |  |
|  |        +-------------------v---------------------------------------+        |  |
|  |        |           Data Access / Persistence Abstraction           |        |  |
|  |        |            (Mongoose Repositories & Schemas)              |        |  |
|  |        +-------------------+---------------------------------------+        |  |
|  +----------------------------|------------------------------------------------+  |
+-------------------------------|---------------------------------------------------+
                                |
+-------------------------------v---------------------------------------------------+
|                                 DATABASE TIER                                     |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                              MongoDB Database                               |  |
|  |                                                                             |  |
|  |  [users]      [tasks]      [comments]      [notifications]  [activitylogs]  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 7.1 Modular Decoupling for Future Database Portability
To satisfy the requirement that MongoDB is not permanently hardcoded into business logic, the server follows the **Repository / Service Pattern**:
1. **Controller Layer:** Parses HTTP requests, validates syntax, calls Services.
2. **Service Layer:** Executes domain rules, validates permissions, checks concurrency version, and triggers Socket broadcasts.
3. **Repository / Model Interface:** Encapsulates data persistence calls. Swapping Mongoose for PostgreSQL (Prisma/TypeORM) or SQLite only requires implementing the repository interface without altering controllers or socket logic.

---

## 8. Database Schema & Data Models

### 8.1 Collection Specifications & Indexes

#### 1. `users` Collection
| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique User Identifier |
| `name` | String | Required, Trim, Max 50 | Full display name |
| `email` | String | Required, Unique, Lowercase, Indexed | Login email address |
| `password` | String | Required, Min 8 | Hashed password via bcrypt |
| `role` | String | Enum: `['USER', 'ADMIN']`, Default: `'USER'` | Access authorization role |
| `avatar` | String | Optional, Default placeholder | Profile image URL |
| `createdAt` | Date | Timestamp, Auto | Account creation time |
| `updatedAt` | Date | Timestamp, Auto | Last account profile update |

*Indexes:* `{ email: 1 }` (Unique).

#### 2. `tasks` Collection
| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique Task Identifier |
| `title` | String | Required, Trim, Max 100, Indexed | Task title |
| `description`| String | Optional, Max 2000 | Task details |
| `status` | String | Enum: `['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']`, Default: `'TODO'`, Indexed | Workflow status |
| `priority` | String | Enum: `['LOW', 'MEDIUM', 'HIGH', 'URGENT']`, Default: `'MEDIUM'`, Indexed | Urgency level |
| `createdBy` | ObjectId | Ref: `'User'`, Required, Indexed | Task creator |
| `assignedTo` | ObjectId | Ref: `'User'`, Optional, Indexed | Assignee |
| `dueDate` | Date | Optional, Indexed | Target completion date |
| `version` | Number | Default: `1`, Required | Concurrency version tag |
| `createdAt` | Date | Timestamp, Auto | Creation timestamp |
| `updatedAt` | Date | Timestamp, Auto | Last modification timestamp |

*Indexes:* `{ title: "text", description: "text" }`, `{ status: 1, priority: 1 }`, `{ assignedTo: 1 }`, `{ createdBy: 1 }`, `{ dueDate: 1 }`.

#### 3. `comments` Collection
| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique Comment Identifier |
| `taskId` | ObjectId | Ref: `'Task'`, Required, Indexed | Target task |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Comment author |
| `text` | String | Required, Trim, Max 1000 | Comment body |
| `createdAt` | Date | Timestamp, Auto | Creation timestamp |
| `updatedAt` | Date | Timestamp, Auto | Edit timestamp |

*Indexes:* `{ taskId: 1, createdAt: 1 }`.

#### 4. `notifications` Collection
| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique Notification ID |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Recipient user |
| `taskId` | ObjectId | Ref: `'Task'`, Optional, Indexed | Related task |
| `message` | String | Required, Max 255 | Notification text |
| `type` | String | Enum: `['TASK_ASSIGNED', 'STATUS_CHANGED', 'COMMENT_ADDED', 'TASK_COMPLETED']` | Category |
| `isRead` | Boolean | Default: `false`, Indexed | Read state |
| `createdAt` | Date | Timestamp, Auto | Dispatch timestamp |

*Indexes:* `{ userId: 1, isRead: 1, createdAt: -1 }`.

#### 5. `activity_logs` Collection
| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key, Auto | Unique Activity Log ID |
| `taskId` | ObjectId | Ref: `'Task'`, Required, Indexed | Target task |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Actor |
| `action` | String | Required | Verb (e.g., `'STATUS_CHANGED'`) |
| `metadata` | Object | Optional | Snapshot (`{ from: 'TODO', to: 'IN_PROGRESS' }`) |
| `createdAt` | Date | Timestamp, Auto | Event timestamp |

*Indexes:* `{ taskId: 1, createdAt: -1 }`.

---

## 9. RESTful API Specification

### 9.1 Standard Envelope Formats

#### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

#### Error Response (`400`, `401`, `403`, `404`, `409`, `500`)
```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": {
    "code": "ERROR_CODE_STRING",
    "details": []
  }
}
```

### 9.2 API Endpoint Directory

#### Authentication & User Endpoints (`/api/auth`, `/api/users`)
| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (role forced to `USER`) | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & return JWT | `200`, `400`, `401` |
| `GET` | `/api/auth/me` | User | Fetch currently logged in user profile | `200`, `401` |
| `GET` | `/api/users` | User | List all users (id, name, email, avatar) for assignment | `200`, `401` |

#### Task Management Endpoints (`/api/tasks`)
| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/tasks` | User | Create a new task (auto-sets `createdBy`, version=1) | `201`, `400`, `401` |
| `GET` | `/api/tasks` | User | List tasks with search, filter, pagination, sorting | `200`, `401` |
| `GET` | `/api/tasks/:id` | User | Get complete task details, comments & activity | `200`, `401`, `404` |
| `PUT` | `/api/tasks/:id` | User/Admin | Update task full details (enforces OCC version check) | `200`, `400`, `403`, `404`, `409` |
| `DELETE`| `/api/tasks/:id` | Creator/Admin | Delete task permanently | `200`, `403`, `404` |
| `PATCH`| `/api/tasks/:id/status` | User | Fast status update (`status`, `version`) | `200`, `400`, `404`, `409` |
| `PATCH`| `/api/tasks/:id/assign` | User | Update task assignment (`assignedTo`, `version`) | `200`, `400`, `404`, `409` |
| `PATCH`| `/api/tasks/:id/priority` | User | Update priority level (`priority`, `version`) | `200`, `400`, `404`, `409` |

#### Task Comments Endpoints (`/api/tasks/:id/comments`)
| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/tasks/:id/comments` | User | Add comment to task | `201`, `400`, `404` |
| `GET` | `/api/tasks/:id/comments` | User | List comments for task | `200`, `404` |
| `DELETE`| `/api/comments/:commentId` | Author/Admin | Delete comment | `200`, `403`, `404` |

#### Notifications Endpoints (`/api/notifications`)
| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/notifications` | User | List notifications for authenticated user | `200`, `401` |
| `PATCH`| `/api/notifications/:id/read` | User | Mark single notification as read | `200`, `404` |
| `PATCH`| `/api/notifications/read-all` | User | Batch mark all notifications as read | `200`, `401` |

#### Dashboard & Admin Endpoints (`/api/dashboard`, `/api/admin`)
| Method | Endpoint | Auth | Description | Status Codes |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/dashboard/stats` | User | Fetch personalized dashboard statistics | `200`, `401` |
| `GET` | `/api/admin/stats` | Admin | Fetch system-wide metrics and user totals | `200`, `403` |
| `GET` | `/api/admin/users` | Admin | Fetch user management directory | `200`, `403` |
| `DELETE`| `/api/admin/users/:id` | Admin | Deactivate/remove a user account | `200`, `403`, `404` |

---

## 10. Real-Time WebSocket & Socket.IO Architecture

### 10.1 Socket.IO Event Contracts

#### Client-to-Server Events
| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `join:task` | `{ taskId: string }` | Client joins room `task:<taskId>` to receive live comments and granular edits |
| `leave:task`| `{ taskId: string }` | Client leaves room `task:<taskId>` |
| `typing:comment` | `{ taskId: string, userName: string }` | Dispatches temporary typing indicator to task room |

#### Server-to-Client Events
| Event Name | Target Room / Audience | Payload Structure | Description |
| :--- | :--- | :--- | :--- |
| `task:created` | `tasks:global` | `{ task: TaskObject }` | Dispatched when any new task is created |
| `task:updated` | `tasks:global`, `task:<id>` | `{ task: TaskObject }` | Dispatched when task details/priority change |
| `task:deleted` | `tasks:global`, `task:<id>` | `{ taskId: string }` | Dispatched when task is removed |
| `task:statusChanged` | `tasks:global`, `task:<id>` | `{ taskId: string, status: string, version: number, updatedBy: UserRef }` | Status badge and board column update |
| `task:assigned` | `user:<assignedToId>` | `{ taskId: string, taskTitle: string, assignedBy: UserRef }` | Direct alert to newly assigned user |
| `comment:added` | `task:<taskId>` | `{ comment: CommentObject }` | Real-time comment stream append |
| `notification:new`| `user:<recipientId>` | `{ notification: NotificationObject }` | Increment badge count & trigger toast |
| `user:online` | Broadcast (All) | `{ userId: string }` | Turns user presence badge green (🟢) |
| `user:offline` | Broadcast (All) | `{ userId: string }` | Turns user presence badge gray (⚫) |

---

## 11. Optimistic Concurrency Control (OCC) Specification

### 11.1 Problem Statement
When two users (User A and User B) open the same task simultaneously and submit competing updates, traditional last-write-wins approaches silently overwrite User A's changes with User B's payload.

### 11.2 OCC Implementation Strategy
1. **Schema Requirement:** The `tasks` collection contains an integer `version` field (defaults to `1` on creation).
2. **Client Submission:** Any `PUT` or `PATCH` request to `/api/tasks/:id` must include `{ ...updates, version: currentLocalVersion }`.
3. **Server Validation Logic:**
   ```javascript
   const task = await Task.findById(id);
   if (!task) return res.status(404).json({ success: false, message: "Task not found" });
   
   if (task.version !== req.body.version) {
     return res.status(409).json({
       success: false,
       error: "TASK_MODIFIED",
       message: "This task was modified by another user.",
       currentTask: task
     });
   }

   // Update fields and increment version atomically
   Object.assign(task, req.body);
   task.version += 1;
   await task.save();
   ```
4. **Client-Side Resolution Flow:**
   - Client catches `409 Conflict`.
   - Form disables submit and renders warning: *"⚠️ This task was modified by another user."*
   - Offers user two actions:
     - **[View Latest Version]:** Discards local unsaved edits and syncs with `currentTask`.
     - **[Compare & Overwrite]:** Shows a diff modal allowing the user to merge or force-overwrite by adopting the latest version number.

---

## 12. User Interface & Page Specifications

```
+-----------------------------------------------------------------------------------+
| Top Navigation Bar (Logo | Global Search | Notifications Bell (3) | Profile Menu) |
+------------------+----------------------------------------------------------------+
| Sidebar Nav      | Main Workspace Header (Page Title, Quick Action Buttons)       |
| - Dashboard      +----------------------------------------------------------------+
| - My Tasks       | Stat Cards Row                                                 |
| - All Tasks      | [ Total: 24 ]  [ In Progress: 8 ]  [ Completed: 12 ] [ Overdue: 2 ]|
| - Team Feed      +----------------------------------------------------------------+
| - Admin Console  | Controls Bar: Filter [Status v] [Priority v] Sort [Newest v]  |
|                  +----------------------------------------------------------------+
| Presence Panel   | Task Grid / List View                                          |
| Ujjwal (🟢)      | +-----------------------------+  +---------------------------+ |
| Rahul  (🟢)      | | Build Authentication API    |  | Design Dashboard UI       | |
| Amit   (⚫)      | | Status: IN_PROGRESS         |  | Status: TODO              | |
|                  | | Priority: HIGH              |  | Priority: MEDIUM          | |
|                  | | Assigned: Ujjwal Singh      |  | Assigned: Rahul Kumar     | |
|                  | | Due: 25 Sep 2026 | 💬 5      |  | Due: 28 Sep 2026 | 💬 1    | |
|                  | +-----------------------------+  +---------------------------+ |
+------------------+----------------------------------------------------------------+
```

### 12.1 Detailed Page Directory

1. **Landing Page (`/`):** Clean SaaS hero section, core feature highlights, real-time collaboration preview, and direct CTA buttons (*Get Started*, *Sign In*).
2. **Login Page (`/login`):** Email & password form, validation hints, toggle password visibility, link to Register.
3. **Registration Page (`/register`):** Name, email, password, confirm password form with real-time password strength meter.
4. **Main Dashboard (`/dashboard`):** Real-time aggregate metric counters, assigned tasks carousel, urgent deadlines alert box, and recent activity log feed.
5. **Task Explorer / List View (`/tasks`):**
   - Search bar (with live debounced querying).
   - Filter chips (Status, Priority, Assignee, Due Date).
   - View mode toggle (Grid Cards vs. Compact Data Table).
   - Quick Status dropdown right on the card.
6. **Task Details Page (`/tasks/:id`):**
   - Editable Title & Markdown Description.
   - Status & Priority Selector controls.
   - Assignee avatar with instant reassignment dropdown.
   - Due Date picker.
   - Activity History audit trail.
   - Live Comment Stream with author badges and real-time append.
7. **Create Task Modal / View (`/tasks/new`):** Clean form modal with validation and instant optimistic card insertion.
8. **Notifications Center (`/notifications`):** Full-page view with history, unread filters, and *Mark all as read* bulk action.
9. **User Profile & Preferences (`/profile`):** Update display name, view assigned tasks summary, and change password.
10. **Admin Console (`/admin`):**
    - Platform-wide statistics (Total Users, Active Sessions, Total Tasks, Completion Rates).
    - User Management Table (Search, inspect roles, delete/deactivate users).
    - Task Moderation Table (Audit and remove orphan/stale tasks).
11. **404 Not Found & 500 Error Pages:** Polished empty states with routing recovery buttons.

### 12.2 Task Card Design Specification
Each Task Card rendered in grid views must present:
- **Header:** Priority Badge (`URGENT`: Red, `HIGH`: Orange, `MEDIUM`: Blue, `LOW`: Gray) + Action Menu (Edit / Delete for authorized users).
- **Body:** Task Title (truncated at 2 lines) + Description preview.
- **Metadata Strip:** Due Date indicator (highlighted in red if overdue) + Comment count icon (`💬 5`).
- **Footer:** Assignee Avatar & Name + Status selector pill (`TODO`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).

### 12.3 Responsive Breakpoint Behaviors
- **Desktop ($\ge 1024\text{ px}$):** Fixed left navigation sidebar (240px) + fluid main content grid (3-column task layout).
- **Tablet ($768\text{ px} - 1023\text{ px}$):** Collapsible icon-only sidebar + 2-column task layout.
- **Mobile ($< 768\text{ px}$):** Off-canvas slide-out hamburger drawer or bottom tab bar navigation + single-column card layout with touch-friendly tap targets ($\ge 44\text{ px}$).

---

## 13. UI States & User Experience Architecture

### 13.1 Loading States
- **Skeleton Screens:** Reusable `<TaskCardSkeleton />` and `<DashboardStatsSkeleton />` matching exact layout geometries to eliminate layout shift (CLS = 0).
- **In-flight Buttons:** Submit buttons enter disabled state with an embedded SVG spinner and descriptive text (e.g., *"Saving changes..."*).

### 13.2 Empty States
- **Empty Task List:** *"No tasks found. Get started by creating your first team task!"* with a prominent `[+ Create Task]` button.
- **Search Zero-State:** *"No tasks match your filter criteria."* with a *[Clear Filters]* button.
- **Empty Notifications:** *"You're all caught up! No unread notifications."*

---

## 14. Project Directory & File Structure

```
task-management-application/
├── client/                                 # React + Vite Frontend Application
│   ├── public/                             # Static assets, favicon, robots.txt
│   ├── src/
│   │   ├── assets/                         # SVG icons, illustrations, logo
│   │   ├── components/                     # Reusable UI component library
│   │   │   ├── common/                     # Buttons, Badges, Modals, Skeletons, Dropdowns
│   │   │   ├── layout/                     # Navbar, Sidebar, MobileNav, Footer
│   │   │   ├── tasks/                      # TaskCard, TaskGrid, TaskFilter, StatusPill, TaskForm
│   │   │   ├── comments/                   # CommentList, CommentItem, CommentInput
│   │   │   ├── notifications/              # NotificationDropdown, NotificationItem
│   │   │   └── dashboard/                  # StatCard, ActivityFeed, UrgentTasksWidget
│   │   ├── context/                        # Global state providers
│   │   │   ├── AuthContext.jsx             # User identity, login, logout, token handling
│   │   │   ├── SocketContext.jsx           # Socket.IO connection & event dispatchers
│   │   │   └── TaskContext.jsx             # Real-time task cache & CRUD operations
│   │   ├── hooks/                          # Custom React hooks
│   │   │   ├── useTasks.js                 # Task querying & optimistic mutations
│   │   │   ├── useDebounce.js              # Search input debounce timer
│   │   │   ├── usePresence.js              # Active online teammates state
│   │   │   └── useNotifications.js         # Unread badge & audio/toast trigger
│   │   ├── layouts/                        # AppLayout, AuthLayout, AdminLayout
│   │   ├── pages/                          # Application Route Views
│   │   │   ├── LandingPage.jsx             # Public SaaS landing page
│   │   │   ├── LoginPage.jsx               # Sign In
│   │   │   ├── RegisterPage.jsx            # Sign Up
│   │   │   ├── DashboardPage.jsx           # Main Analytics & Overview
│   │   │   ├── TasksPage.jsx               # Task Explorer (Cards/Table)
│   │   │   ├── TaskDetailsPage.jsx         # Full Task View, Comments & Audit
│   │   │   ├── CreateTaskPage.jsx          # New Task Creator View
│   │   │   ├── ProfilePage.jsx             # User Profile Settings
│   │   │   ├── AdminDashboardPage.jsx      # Admin Oversight & Stats
│   │   │   ├── AdminUsersPage.jsx          # Admin User Directory
│   │   │   ├── NotFoundPage.jsx            # 404 Error Screen
│   │   │   └── ErrorPage.jsx               # 500 General Error Boundary
│   │   ├── routes/                         # React Router route definitions
│   │   │   ├── AppRoutes.jsx               # Master route tree
│   │   │   ├── ProtectedRoute.jsx          # Auth guard component
│   │   │   └── AdminRoute.jsx              # Admin RBAC guard component
│   │   ├── services/                       # API Integration Layer
│   │   │   ├── api.js                      # Axios instance with auth interceptor
│   │   │   ├── authService.js              # Login, register, profile calls
│   │   │   ├── taskService.js              # Task CRUD and status endpoints
│   │   │   ├── commentService.js           # Comment submission & deletion
│   │   │   └── notificationService.js      # Notification queries & read status
│   │   ├── utils/                          # Helper functions
│   │   │   ├── dateUtils.js                # Relative timestamps & formatters
│   │   │   ├── constants.js                # Status and priority enums & color mappings
│   │   │   └── validators.js               # Client-side form validation rules
│   │   ├── App.jsx                         # App entry wrapper & providers
│   │   ├── main.jsx                        # React DOM root render
│   │   └── index.css                       # Tailwind CSS directives & base typography
│   ├── index.html                          # HTML5 template
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── tailwind.config.js                  # Tailwind design system configuration
│   ├── postcss.config.js                   # PostCSS plugins
│   └── vite.config.js                      # Vite bundler configuration & proxy setup
│
├── server/                                 # Node.js + Express + Socket.IO Backend
│   ├── config/                             # Core server configuration
│   │   ├── db.js                           # MongoDB Mongoose connection manager
│   │   ├── socket.js                       # Socket.IO initialization & handshake auth
│   │   └── constants.js                    # Global enums, error codes & role strings
│   ├── controllers/                        # Request controllers
│   │   ├── authController.js               # Register, login, current user
│   │   ├── taskController.js               # Task CRUD, status, priority, assignments
│   │   ├── commentController.js            # Comment creation & deletion
│   │   ├── notificationController.js       # Notification retrieval & read mutations
│   │   ├── dashboardController.js          # User statistics & aggregated metrics
│   │   └── adminController.js              # Admin system stats & user management
│   ├── middleware/                         # Express middleware pipeline
│   │   ├── authMiddleware.js               # JWT verification & req.user injection
│   │   ├── roleMiddleware.js               # RBAC validation (Admin checks)
│   │   ├── errorMiddleware.js              # Global centralized error handler
│   │   ├── validateMiddleware.js           # express-validator schema evaluator
│   │   └── rateLimitMiddleware.js          # Rate limiter instances (Auth / API)
│   ├── models/                             # Mongoose Schema definitions
│   │   ├── User.js                         # User schema & password hashing hooks
│   │   ├── Task.js                         # Task schema with version tracking & indexes
│   │   ├── Comment.js                      # Comment schema & relations
│   │   ├── Notification.js                 # Notification schema & indexes
│   │   └── ActivityLog.js                  # Audit log schema
│   ├── routes/                             # Express REST API Routes
│   │   ├── authRoutes.js                   # /api/auth endpoints
│   │   ├── taskRoutes.js                   # /api/tasks endpoints
│   │   ├── commentRoutes.js                # /api/tasks/:id/comments endpoints
│   │   ├── notificationRoutes.js           # /api/notifications endpoints
│   │   ├── dashboardRoutes.js              # /api/dashboard endpoints
│   │   └── adminRoutes.js                  # /api/admin endpoints
│   ├── services/                           # Business logic & repository bridge
│   │   ├── taskService.js                  # Task logic, OCC checks & activity logs
│   │   ├── notificationService.js          # Notification creation & dispatch
│   │   └── activityService.js              # Activity logging helper
│   ├── socket/                             # Socket.IO Event Handlers & State
│   │   ├── socketHandler.js                # Master socket event orchestrator
│   │   ├── presenceHandler.js              # Online/offline tracker map
│   │   └── taskSocketEmitter.js            # Helper methods to broadcast task events
│   ├── utils/                              # Utility helpers
│   │   ├── logger.js                       # Structured console logging
│   │   └── apiResponse.js                  # Standardized JSON response helpers
│   ├── package.json                        # Backend dependencies & start scripts
│   └── server.js                           # Express app entry & HTTP/WS server listener
│
├── .env.example                            # Root environment template
├── .gitignore                              # Git ignore rules (node_modules, .env, dist)
└── README.md                               # Project documentation & execution guide
```

---

## 15. Security Architecture & Threat Mitigation

### 15.1 Authentication & Credential Hygiene
- **JWT Storage & Transmission:** Tokens transmitted via standard `Authorization: Bearer <token>` header. Token secret signed with `HS256` utilizing $\ge 256$-bit random secret.
- **Bcrypt Hash Rounds:** Salt work factor configured to 10 rounds, striking an optimal balance between brute-force resistance ($~100\text{ ms/hash}$) and server throughput.
- **Admin Privilege Escalation Protection:** The `role` property in `POST /api/auth/register` is explicitly ignored and overridden to `'USER'`.

### 15.2 Input Validation & Sanitization
- **Strict Schema Validation:** All endpoints validate incoming data payloads using `express-validator`.
- **NoSQL Injection Defense:** All query selectors use strict object typing; no un-sanitized `$where` or regex injection vectors are permitted.
- **XSS Defense:** Task descriptions and comments are escaped; frontend React JSX avoids `dangerouslySetInnerHTML`.

### 15.3 Rate Limiting & DoS Protection
- **Auth Rate Limiter:** Max 10 attempts per 15 minutes per IP.
- **Standard API Rate Limiter:** Max 100 requests per minute per IP.

---

## 16. Multi-User Real-Time Testing & Verification Scenarios

### 16.1 Test Suite Breakdown

| Test Suite | Focus Area | Verification Strategy |
| :--- | :--- | :--- |
| **Unit Tests** | Helper functions, password validators, date formatters | Jest / Vitest unit tests |
| **API Integration**| Auth endpoints, Task CRUD, RBAC restrictions | Supertest against test database |
| **Socket Integration**| Connection handshake, room dispatch, event broadcasts | Socket.IO client integration test |
| **OCC Collision** | Simultaneous update on identical task version | Concurrency test asserting `409 Conflict` |
| **E2E Multi-User** | Two active browser sessions validating live state synchronization | Dual-browser manual & Playwright automated flow |

---

## 17. Deployment & Environment Configuration

### 17.1 Environment Variables Specification (`.env.example`)

#### Backend (`server/.env.example`)
```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager

# Security & Authentication
JWT_SECRET=super_secret_jwt_key_replace_in_production_min_32_chars
JWT_EXPIRE=24h

# Client Application URL (for CORS and Socket Handshake)
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env.example`)
```ini
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api

# Backend Socket.IO URL
VITE_SOCKET_URL=http://localhost:5000
```

### 17.2 Deployment Strategy
- **Frontend:** Hosted on **Vercel** with single-page application rewrite rule (`vercel.json`) pointing all routes to `index.html`.
- **Backend:** Deployed on **Render / Railway** with auto-restart worker and WebSocket support enabled.
- **Database:** Provisioned on **MongoDB Atlas** (Free M0 Cluster) with IP access restrictions.

---

## 18. Success Criteria & Feature Traceability Checklist

| # | Requirement / Criterion | Scope | Status Target |
| :-: | :--- | :---: | :---: |
| 1 | User Registration with password complexity validation | IAM | Complete |
| 2 | User Login & Stateless JWT token issue | IAM | Complete |
| 3 | User Logout & Token eviction | IAM | Complete |
| 4 | Client-side Protected Routes & Admin Route Guards | IAM | Complete |
| 5 | Role-Based Access Control (User vs. Admin) | Security | Complete |
| 6 | Create Task with Title, Description, Priority, Due Date | Task Core | Complete |
| 7 | View Tasks in responsive Grid and List layouts | Task Core | Complete |
| 8 | Update Task full details & inline status changes | Task Core | Complete |
| 9 | Delete authorized tasks (Creator & Admin only) | Task Core | Complete |
| 10 | Task Assignment to any registered team member | Task Core | Complete |
| 11 | Task Status transitions (`TODO`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) | Task Core | Complete |
| 12 | Task Priority levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) | Task Core | Complete |
| 13 | Debounced fast search by title, description & assignee | Search | Complete |
| 14 | Multi-faceted filtering (Status, Priority, Assignment, Date) | Filter | Complete |
| 15 | Multi-column sorting (Newest, Oldest, Priority, Due Date) | Sort | Complete |
| 16 | Task Comment stream with author badges and timestamps | Collab | Complete |
| 17 | Real-time Task updates across connected clients (Socket.IO) | Real-Time | Complete |
| 18 | Real-time Comment delivery without page reload | Real-Time | Complete |
| 19 | Real-time Push Notifications (bell count & toast alerts) | Real-Time | Complete |
| 20 | Online / Offline User Presence tracking (🟢 / ⚫) | Real-Time | Complete |
| 21 | Dashboard Statistics dynamically recalculating in real-time | Analytics | Complete |
| 22 | Optimistic Concurrency Control (OCC) conflict detection (409) | Reliability | Complete |
| 23 | Activity history timeline logging every task action | Audit | Complete |
| 24 | Fully responsive layout across Desktop, Tablet & Mobile | UI/UX | Complete |
| 25 | Comprehensive UI States (Skeletons, Spinners, Empty States) | UI/UX | Complete |
| 26 | Robust Error Handling with user-friendly error banners | Quality | Complete |
| 27 | Clean Modular Architecture with decoupled database layer | Architecture| Complete |
| 28 | Zero external paid APIs, production deployable | DevOps | Complete |

---

## 19. Future Roadmap & Extensibility Hooks (V2+)

While strictly excluded from the V1 implementation to keep the core project focused, the codebase architecture incorporates extension points for:
- **Kanban Drag-and-Drop Board:** Pre-structured status columns allow drop-in integration of `@hello-pangea/dnd`.
- **File & Asset Attachments:** Storage interface ready for local multer or S3-compatible bucket plugins.
- **Email Notifications:** Event hook in `notificationService.js` ready for Nodemailer / SMTP workers.
- **Custom Task Tags & Labels:** Model schema structured to accept string array tags.
- **Dark Mode / Theme Engine:** Tailwind configuration structured with `class` strategy for zero-friction theme toggling.
- **Calendar & Gantt Timeline View:** Structured ISO due dates permit direct calendar plotting.
