# Blog Management REST API

A REST API for a Blog Management Application built with Node.js and Express. The API supports user registration and authentication, role-based authorization for users and admins, profile and password management, blog CRUD operations, and public blog search and filtering.

## Features

- User registration and JWT login
- Active and inactive user accounts
- Admin-only user management
- Profile and password updates
- Blog creation, update, and deletion
- Users can manage their own blogs
- Admins can manage any blog
- Public blog listing, title search, category filtering, and detail view
- Password hashing with bcrypt
- Validation for required fields, email, passwords, and IDs
- Automatic creation of the `blogdb` database and tables on startup

## Technologies

- Node.js
- Express 5
- MySQL
- Sequelize ORM
- JSON Web Token (`jsonwebtoken`)
- Bcrypt
- Dotenv
- Nodemon for development

## Prerequisites

Install the following before running the project:

- Node.js 18 or later
- npm
- MySQL Server
- A tool such as Postman for testing the API

Make sure the MySQL server is running and the configured database user has permission to create databases and tables.

## Clone the Project

```bash
git clone <repository-url>
cd rest-api-development
```

Replace `<repository-url>` with the URL of this repository.

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DB_NAME=blogdb
DB_USER=root
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=replace-with-a-secure-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
```

Update the database values to match your local MySQL configuration. Do not commit `.env` to source control.

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are used on startup to create an active admin account if it does not already exist. If the account already exists, the application ensures that its role is `admin` and its status is active.

## Setup and Run

Start the project in development mode:

```bash
npm run dev
```

Start the project normally:

```bash
npm start
```

The API will be available at:

```text
http://localhost:5000/api
```

On startup, the application creates the `blogdb` database if needed, connects to MySQL, synchronizes the `users` and `blogs` tables, and prepares the configured admin account.

## Usage Instructions

### Register a User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

```json
{
	"firstname": "John",
	"lastname": "Doe",
	"email": "john@example.com",
	"password": "password123"
}
```

### Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

```json
{
	"email": "admin@example.com",
	"password": "password123"
}
```

Copy the returned token and send it with protected requests:

```http
Authorization: Bearer <token>
```

### API Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/blogs` | Public | Get all blogs |
| GET | `/api/blogs?title=playwright` | Public | Search blogs by title |
| GET | `/api/blogs?category=Testing` | Public | Filter blogs by category |
| GET | `/api/blogs/:id` | Public | Get a blog by ID |
| POST | `/api/blogs/create` | User/Admin | Create a blog |
| PUT | `/api/blogs/update/:id` | User/Admin | Update an owned blog; admins can update any blog |
| DELETE | `/api/blogs/:id` | User/Admin | Delete an owned blog; admins can delete any blog |
| GET | `/api/users/profile` | User/Admin | Get the logged-in user's profile |
| PUT | `/api/users/profile/update` | User/Admin | Update the logged-in user's profile |
| PATCH | `/api/users/password` | User/Admin | Update the logged-in user's password |
| GET | `/api/users` | Admin | Get all users without passwords |
| GET | `/api/users/:id` | Admin | Get a user by ID |
| PATCH | `/api/users/:id/status` | Admin | Activate or deactivate a user |

### Create a Blog

```http
POST http://localhost:5000/api/blogs/create
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
	"blogTitle": "Introduction to API Testing",
	"blog": "This article explains the fundamentals of API testing.",
	"category": "Testing"
}
```

The blog owner ID is taken from the authenticated token. It must not be sent by the client.

### Search and Filter Blogs

Title and category filters can be used separately or together:

```text
GET /api/blogs?title=playwright
GET /api/blogs?category=Testing
GET /api/blogs?title=playwright&category=Testing
```

## Authorization

- Guests can register, log in, and access public blog endpoints.
- Authenticated users can manage their own profile, password, and blogs.
- Admins can manage users and any blog.
- Passwords are hashed before storage and are never returned by the API.
- Protected endpoints require a valid JWT in the `Authorization` header.

## Project Structure

```text
config/       Database configuration
controller/   Request and response handlers
middlewares/  Authentication and authorization middleware
models/       Sequelize models
routes/       API route definitions
services/     Business logic and validation
utils/        Shared validation utilities
app.js        Express application setup
server.js     Database startup and server entry point
```

## Common HTTP Status Codes

- `200` Request completed successfully
- `201` Resource created successfully
- `400` Invalid request data
- `401` Missing or invalid authentication
- `403` Authenticated but not authorized
- `404` User or blog not found
- `409` Duplicate email or conflicting resource
- `500` Internal server error

## API Documentation
https://documenter.getpostman.com/view/26267787/2sBYB2q6z3