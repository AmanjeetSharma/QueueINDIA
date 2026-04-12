# 🇮🇳 QueueINDIA

> **Smart Appointment & Queue Management Platform for Public Services**

QueueINDIA is a full-stack appointment and queue management platform for public-facing departments and service centers. Citizens can discover departments, book service slots, upload documents, track booking status, and manage appointments online, while admins and department officers can manage departments, services, staff, queues, and booking workflows from role-based dashboards.

---

## 🌐 Live Services

| Service | URL |
|--------|-----|
| User Service | https://queueindia-user.onrender.com |
| Department Service | https://queueindia-department.onrender.com |
| API Gateway | https://queueindia-api-gateway.onrender.com |
| Frontend | https://queue-india.vercel.app |

---

## 📦 Project Structure

```text
QueueINDIA/
├── frontend/                    # React + Vite client
├── backend/
│   ├── api-gateway/            # Gateway that proxies frontend API traffic
│   ├── user-service/           # Auth, users, profiles, sessions, email flows
│   ├── department-service/     # Departments, services, bookings, queue ops
│   ├── 1-QueueINDIA-pingbot/   # Optional utility to ping deployed services
│   └── package.json            # Runs the backend services concurrently

## Core Features

- Citizen-facing department and service discovery
- Multi-step appointment booking flow with date, time, and details steps
- Role-based access for `USER`, `ADMIN`, `DEPARTMENT_OFFICER`, and `SUPER_ADMIN`
- Google login plus password-based authentication
- Profile management, session handling, password reset, and account recovery
- Department and service management for admins and super admins
- Queue and booking operations for department officers
- Booking lifecycle states such as `PENDING_DOCS`, `DOCS_SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `COMPLETED`, and `REJECTED`
- Optional document upload requirements per service
- Priority booking support for senior citizens, pregnant women, and differently abled users
- Shared API gateway for frontend-to-service communication
- Optional ping bot for keeping deployed Render services warm during demos

## Architecture Overview

The frontend talks to the API gateway, and the gateway proxies requests to the backend services.

```text
Frontend (Vite / React)
        |
        v
API Gateway
  |- /api/v1/auth
  |- /api/v1/users
  |- /api/v1/oauth2
  |- /api/v1/reset-password
  |      -> User Service
  |
  |- /api/v1/departments
  \- /api/v1/officer
         -> Department Service
```

### Service Responsibilities

`frontend/`
- React 19 + Vite SPA
- Uses `VITE_API_BASE_URL` for API requests
- Wraps the app in `GoogleOAuthProvider`
- Includes public pages, booking flow, user dashboard, and admin/officer panels

`backend/api-gateway/`
- Express gateway
- Handles CORS, cookies, and request proxying
- Routes user/auth traffic to the user service
- Routes department/queue traffic to the department service

`backend/user-service/`
- Registration, login, token refresh, logout
- Google OAuth login
- User profile and account settings
- Password reset and verification email flows
- Session tracking
- User role and department linkage

`backend/department-service/`
- Department CRUD
- Embedded service definitions per department
- Booking creation and status transitions
- Slot windows and token management
- Department staff assignment and operational metadata

`backend/1-QueueINDIA-pingbot/`
- Small Node utility that periodically pings deployed services
- Useful for interviews, demos, or showcase sessions

## Tech Stack

### Frontend

- ReactJS
- Vite
- React Router
- Tailwind CSS 4
- Framer Motion
- Axios

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT-based auth
- Google Auth Library
- Nodemailer-compatible email flow using Brevo API
- Cloudinary for file/media handling
- Multer for uploads

## Local Development

### 1. Clone and install dependencies

Install dependencies in each runnable package:

```powershell
cd frontend
npm install

cd ..\backend
npm install

cd api-gateway
npm install

cd ..\user-service
npm install

cd ..\department-service
npm install

cd ..\1-QueueINDIA-pingbot
npm install
```

### 2. Create environment files

Create `.env` files in:

- `frontend/.env`
- `backend/api-gateway/.env`
- `backend/user-service/.env`
- `backend/department-service/.env`

The ping bot does not currently read any required environment values from code.

### 3. Minimum environment variables

#### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

#### `backend/api-gateway/.env`

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
USER_SERVICE_URL=http://localhost:3001
DEPARTMENT_SERVICE_URL=http://localhost:3002
```

#### `backend/user-service/.env`

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGO_URI=your_mongodb_connection_string_without_db_name
DB_NAME=queueindia
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_oauth_client_id
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
BREVO_API_KEY=your_brevo_api_key
EMAIL_SENDER_NAME=QueueINDIA
EMAIL_SENDER_ADDRESS=your_verified_sender_email
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DEPARTMENT_SERVICE_URL=http://localhost:3002
```

#### `backend/department-service/.env`

```env
PORT=3002
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGO_URI=your_mongodb_connection_string_without_db_name
DB_NAME=queueindia
USER_SERVICE_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Running The App

### Start the frontend

```powershell
cd frontend
npm run dev
```

The frontend will normally run on `http://localhost:5173`.

### Start all backend services together

```powershell
cd backend
npm run dev
```

This starts:

- API Gateway on `http://localhost:3000`
- User Service on `http://localhost:3001`
- Department Service on `http://localhost:3002`

### Start services individually

```powershell
cd backend\api-gateway
npm run dev
```

```powershell
cd backend\user-service
npm run dev
```

```powershell
cd backend\department-service
npm run dev
```

### Optional: run the ping bot

```powershell
cd backend\1-QueueINDIA-pingbot
npm run start
```

By default it pings the deployed Render URLs every 10 minutes and stops automatically after 2 hours.

## Default Local Ports

| App | Default Port |
| --- | --- |
| Frontend | `5173` |
| API Gateway | `3000` |
| User Service | `3001` |
| Department Service | `3002` |

## Data Model Notes

- Both backend services connect to MongoDB using `MONGO_URI` + `DB_NAME`
- The user service stores users, auth state, sessions, verification state, and role metadata
- The department service stores departments, embedded services, booking records, staff assignments, queue settings, and service token rules
- Services are embedded in departments, so department management and service management are closely tied together

## Main User Flows

### Citizens

1. Register or log in
2. Browse departments
3. Open a department and choose a service
4. Select date and slot
5. Add booking details
6. Confirm booking
7. Upload documents if required
8. Track booking status from the my bookings tab

### Staff and Admin Roles

- `SUPER_ADMIN` can manage users, departments, and department work areas (Access to everything)
- `ADMIN` can manage department-level data and staff operations
- `DEPARTMENT_OFFICER` can operate queue and booking workflows only

## Deployment Notes

- The repo includes `frontend/vercel.json`, which suggests the frontend is intended for Vercel deployment
- Ping bot helps in periodically sending requests to the backend, preventing cold start delays on Render’s free tier and ensuring faster response times.
- When deploying, make sure `CORS_ORIGIN`, `FRONTEND_URL`, `BACKEND_URL`, `USER_SERVICE_URL`, and `DEPARTMENT_SERVICE_URL` all point to the correct public URLs
