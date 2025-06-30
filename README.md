# NexCall VAC - MEAN Stack Real-Time Communication Platform

> ** Showcasing expertise in full-stack engineering, scalable architecture, and real-time systems with a robust MEAN (MongoDB, Express, Angular, Node.js) solution for modern communication needs.

---

## 🚀 Project Overview
![next_call_connect](https://github.com/user-attachments/assets/80c1d86d-50bc-4bd9-91b4-e352cfb4db81)



**NexCall VAC** is a production-grade, real-time voice, audio, and chat communication platform built with the MEAN stack. It demonstrates end-to-end expertise in modern web development, scalable microservice design, and state-of-the-art real-time features using WebSockets and WebRTC.

- **Backend:** Node.js (Express), MongoDB (Mongoose), JWT authentication, Socket.io for real-time comms, and robust REST API structure.
- **Frontend:** Angular, RxJS, Angular Material, modular feature-first architecture, and responsive UI/UX.
- **DevOps:** Dockerized services, environment-based configs, API docs with Swagger/OpenAPI, and scalable deployment readiness.

---

## 🧑‍💻 Key Features & My Expertise

### 1. Real-Time Communication
- **1-to-1 and Group Calls:** Audio/video powered by WebRTC and Socket.io.
- **Instant Messaging (IM):** Private and group chat with dynamic presence and unread message tracking.
- **User Presence:** Live user/member lists, robust group management (create/join/leave).

### 2. Secure Auth & Authorization
- **JWT-based Auth:** Secure registration, login, and route protection with Express middleware.
- **Role-based Access:** Guards for authenticated user actions and granular API permissions.

### 3. Scalable & Maintainable Codebase
- **Feature Modules (Angular):** Auth, Call, Chat, Dashboard, and Settings—each isolated for testability and scaling.
- **Service Layer (Node.js):** Clear controller/service separation, RESTful APIs, socket event handlers, and validation.
- **Reusable Shared Components:** UI elements, pipes, directives for DRY and clean code.

### 4. DevOps and Documentation
- **Config-driven:** Environment configs, Docker for easy local and cloud deployment.
- **OpenAPI Docs:** Self-documented APIs for seamless integration/extension.
- **Logging & Error Handling:** Centralized error middleware and log utilities.

---

## 🏗️ Project Structure

### Frontend (`NextCall_UI/`)
- `core/` – Singleton services, guards, interceptors
- `features/`
  - `auth/` – Login/Register/OTP
  - `dashboard/` – User home/dashboard
  - `call/` – Call controls (group, single)
  - `chat/` – Chat UI and logic
  - `settings/` – Profile, theme, notifications
- `layout/` – Header, sidebar, theme switcher

### Backend (`NextCall_api/`)
- `config/` – Env, DB, socket, passport-jwt configs
- `controllers/` – Domain logic (call, auth)
- `routes/` – REST/Socket API definitions
- `services/` – Business/data logic (JWT, password hash)
- `middleware/` – Auth, error handling
- `models/` – MongoDB schemas (user, call, token)
- `sockets/` – Real-time event listeners
- `validations/` – Input validation (Joi/Zod)
- `docs/` – Swagger/OpenAPI YAML

---

## 🛠️ Technologies & Skills Demonstrated

- **Node.js & Express, Socket.io, JWT, MongoDB (Mongoose)**
- **Angular, RxJS, Angular Material, Modular SPA design**
- **WebRTC integration for media streaming**
- **Docker, REST, OpenAPI/Swagger, DevOps best practices**
- **Code organization, reusability, and scalable architecture**
- **Unit & integration testing, error handling, logging**

---

## 📦 Quick Start

```bash
# Backend
cd NextCall_api
npm install
npm run dev

# Frontend
cd ../NextCall_UI
npm install
ng serve
```
- For MongoDB, use Docker:  
  `docker run -d --name my-mongo -p 27017:27017 mongo:latest`

---

## 👨‍💼 About the Author

Developed by [AGuptaWorks01](https://github.com/AGuptaWorks01) — Full-stack engineer passionate about scalable, maintainable, and robust web solutions.  
*Contact me for collaboration or questions!*

---
