# ProPulse — Mini Project Management System

Enterprise-grade Mini Project Management System built with **Java 21**, **Spring Boot 3.3.4**, **MySQL 8.0**, **Spring Security + JWT**, and a **React 18 (Vite)** frontend.

Designed for live academic practical examinations and production demonstration with full Role-Based Access Control (RBAC), real-time project lifecycle tracking, strict validation, and zero browser alert popups.

---

## 1. Database Configuration & Fix Summary

### Root Cause of the Database Issue:
1. In earlier runs, the database connection failed because the local MySQL 8.0 instance required authentication (`root` password `Harish@892`).
2. The previous configuration attempted blank or standard placeholder passwords, causing connection rejection (`Access denied for user 'root'@'localhost'`).
3. The database `mini_project_db` was not yet initialized in the local MySQL instance.

### Solution Implemented:
1. Connected to local MySQL 8.0 service and executed `CREATE DATABASE IF NOT EXISTS mini_project_db;`.
2. Configured `application.properties` with the validated credentials and resilient fallback defaults:
   ```properties
   spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/mini_project_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
   spring.datasource.username=${DB_USERNAME:root}
   spring.datasource.password=${DB_PASSWORD:Harish@892}
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```
3. Added **In-Memory H2 fallback profile** (`application-h2.properties`) so if MySQL is ever unavailable or stopped, the system can run immediately with `--spring.profiles.active=h2`.
   > **Note on H2 Fallback**: H2 stores data strictly in RAM (`jdbc:h2:mem:mini_project_db`). Any data created during an H2 session will disappear when the application restarts. The default MySQL configuration ensures permanent disk storage.

---

## 2. Credentials for Live Demonstration

The application seeds initial users and demo projects automatically on startup:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@project.com` | `Admin@123` | Full access: all projects, user directory, global stats |
| **Standard User** | `user@project.com` | `User@123` | Workspace: view projects, edit/delete own projects only |

> **Quick Demo**: On the login page, you can click the **"Fill Admin"** or **"Fill User"** preset buttons to populate credentials instantly.

---

## 3. Terminal Run Commands

### Terminal 1: Backend (Spring Boot)
```powershell
cd c:\Users\harish\Desktop\mini3\backend
mvn spring-boot:run
```
*(Or run the pre-built standalone jar directly:)*
```powershell
java -jar target/mini-project-management-1.0.0.jar
```

### To run with H2 In-Memory Fallback:
```powershell
java -jar target/mini-project-management-1.0.0.jar --spring.profiles.active=h2
```

### Terminal 2: Frontend (React + Vite)
```powershell
cd c:\Users\harish\Desktop\mini3\frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 4. Key Features & Question 20 Compliance

| Requirement | Implementation Details |
| :--- | :--- |
| **Project Fields** | ID, Name, Description, Start Date, Deadline, Status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), Created By, Created At |
| **Add Project** | Clean modal with name, description, start date, deadline, status picker |
| **Display Projects** | Glassmorphic cards with status badges and deadline countdowns |
| **Update Project** | Update modal allowing editing of all fields |
| **Quick Status Update** | Dropdown directly on each project card for one-click status transitions |
| **Delete Project** | Custom confirmation modal with zero browser `alert()` or `confirm()` dialogs |
| **Filters** | Filter tabs for *All Projects*, *Not Started*, *In Progress*, and *Completed* |
| **Search** | Real-time search bar filtering projects by name |
| **Date Validation** | Prohibits deadline earlier than start date (enforced in frontend and backend) |
| **Deadline Display** | Visual pills showing *Overdue by X days*, *Due Today*, or *X days left* |
| **Security & RBAC** | BCrypt password hashing, stateless JWT authentication, Spring Security method security |
| **User vs Admin** | Users can only modify/delete projects they created; Admin can manage all projects and view registered users |

---

## 5. REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new account (assigned `ROLE_USER` by default)
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Projects
- `GET /api/projects` — Fetch projects (optional `?status=...&search=...`)
- `POST /api/projects` — Create a new project
- `GET /api/projects/{id}` — Fetch project by ID
- `PUT /api/projects/{id}` — Update project details (owner or admin only)
- `PATCH /api/projects/{id}/status` — Update project status (owner or admin only)
- `DELETE /api/projects/{id}` — Delete project (owner or admin only)
- `GET /api/projects/stats` — Dashboard metrics (total, not started, in progress, completed, users)

### Administration
- `GET /api/admin/users` — View all registered users and their created projects count (`ROLE_ADMIN` only)
