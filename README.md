# UpTask API - Project Management Backend

UpTask API is the backend service that powers the UpTask project management platform.
It exposes a RESTful REST API for authentication, project management, task workflows, and team collaboration.

The service is built with Node.js, Express, and TypeScript, and connects to MongoDB Atlas for persistent storage.

Authentication is handled through JSON Web Tokens (JWT), and routes are protected via middleware-based authorization.

The backend also includes a production-ready transactional email system for account confirmation and password recovery flows, integrated through [Brevo SMTP](https://app.brevo.com/).

The service is deployed independently from the frontend and configured through environment variables for cloud environments.

## Core Features

#### Authentication

- User registration with email verification
- JWT-based login flow
- Password recovery and reset via email
- Token validation middleware
- Protected user profile route
- Secure password hashing with bcrypt

#### Project & Team Management

- CRUD operations for projects
- Collaborator invitations via email
- Role-based permissions (manager vs collaborator)
- Server-side authorization checks
- Secure project-level access enforcement

### Task Workflow Engine

- Create and assign tasks to project
- Status transitions with audit history
- Task updates and deletion
- Activity log per task
- Notes and comments system

#### Security & Middleware

- JWT verification middleware
- Route-level authentication enforcement
- Centralized error handler
- CORS configuration for production
- HTTP request logging with Morgan

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
- Brevo SMTP

## Key Technologies Explained

- **Express** provides modular routing and middleware composition.
- **MongoDB Atlas** offers a scalable cloud database for document storage.
- **JWT** enables stateless authentication between client and server.
- **Mongoose** enforces schemas and relations across collections.
- **bcrypt** secures stored passwords.
- **Nodemailer** handles SMTP-based email delivery.
- **Ethereal** is used for development and testing because it allows email flows to be verified without sending real messages.
- **Brevo SMTP** powers production-grade transactional email flows.
- **cors** allows controlled frontend access.

## Frontend Integration

This backend connects directly to the frontend repository:

[UpTask Client Repository](https://github.com/wichofly/upTask-client)

## Deployment

Frontend deployed on Vercel:

[UpTask Client](https://up-task-client-two.vercel.app)

Backend deployed on Render:

[Backend API](https://uptask-server-4lcj.onrender.com)
