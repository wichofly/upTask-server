# UpTask API - Project Management Backend

UpTask API is the backend service that powers the UpTask project management platform.
It exposes a RESTful API for authentication, project management, task workflows, and team collaboration.

The service is built with Node.js and Express and connects to MongoDB Atlas for data persistence.
Authentication is handled through JSON Web Tokens (JWT), and routes are protected with middleware.

The API also includes a transactional email system used for account confirmation and password recovery flows.
Emails are generated using Nodemailer and sent through [Ethereal](https://ethereal.email/) for development and testing purposes.

The backend is deployed independently from the frontend and configured for production using environment variables.

## Core Features

#### Authentication

- User registration with email verification
- Login endpoint issuing JWT tokens
- Password recovery and reset flow
- Token validation middleware
- Protected user profile route
- Secure password hashing with bcrypt

#### Project & Team Management

- CRUD operations for projects
- Assign collaborators by email
- Role-based permissions (manager vs collaborator)
- Server-side authorization checks
- Secure project access enforcement

### Task Workflow Engine

- Create and assign tasks to project
- Status transitions with audit history
- Task deletion and updates
- Activity log per task
- Notes/comments system

#### Security & Middleware

- JWT verification middleware
- Route-level authentication enforcement
- Centralized error handler
- CORS configuration for production
- Request logging with Morgan

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- dotenv
- cors
- Morgan
- Nodemailer
- Ethereal Email

## Key Technologies Explained

- **Express** keeps routing modular and simple.
- **MongoDB Atlas** provides a scalable cloud database for project documents.
- **JWT** enables stateless authentication between services.
- **Mongoose** enforces schemas and relations across collections.
- **bcrypt** secures stored passwords.
- **Nodemailer** handles SMTP communication and transactional emails.
- **Ethereal** is used for development and testing because it allows email flows to be verified without sending real messages.
- **cors** allows controlled frontend access.

## Frontend Integration

This backend is directly connected to the frontend repository at: [UpTask Client](https://github.com/wichofly/upTask-client)

## Deployment

Frontend:
Project deployed at Vercel: [UpTask Client](https://up-task-client-two.vercel.app)

Backend:
Project deployed at Render: [Backend API](https://uptask-server-4lcj.onrender.com)
