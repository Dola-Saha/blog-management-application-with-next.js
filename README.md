# Blog Management Application

## Project overview

A full-stack blog management application with a Next.js frontend and an Express REST API. Users can discover and manage blog posts, while administrators can manage users and all blog content. The backend stores users and blogs in MySQL.

## Main features

- User registration and JWT-based login.
- Public blog listing and individual blog pages.
- Search blogs by title and filter by category.
- Create, edit, and delete blog posts.
- User profile editing, profile image uploads, and password changes.
- Forgot/reset password flow.
- Admin dashboard for viewing users and activating or deactivating accounts.
- Admins can manage all blog posts; regular users can manage their own posts.

## Technologies

- **Frontend:** Next.js 16, React 19, Axios, Tailwind CSS 4, Lucide React.
- **Backend:** Node.js, Express 5, Sequelize, MySQL2, JSON Web Tokens, bcrypt, Multer.
- **Database:** MySQL.
- **Development:** npm, Nodemon, Concurrently.

## Installation

### Prerequisites

- Node.js and npm.
- A running MySQL server.
- A MySQL account with permission to create a database and tables.

### Install dependencies

Run these commands from the project root:

```sh
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### Configure environment variables

Create the backend environment file from the example:

```sh
cp backend/.env.example backend/.env
```

Set the values in `backend/.env` for your local MySQL server and application. The backend creates the configured database and synchronizes its tables at startup.

Create the frontend environment file from the example:

```sh
cp frontend/.env.example frontend/.env
```

Do not commit `.env` or `.env.local` files. Use a unique, strong value for `JWT_SECRET`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port. Defaults to `5000`. |
| `DB_HOST` | MySQL server hostname. |
| `DB_PORT` | MySQL server port, commonly `3306`. |
| `DB_USER` | MySQL username. |
| `DB_PASSWORD` | MySQL password. |
| `DB_NAME` | Database name. Defaults to `blogdb`. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. Set a strong, private value. |
| `JWT_EXPIRES_IN` | JWT lifetime. Defaults to `24h`. |
| `GMAIL` | Email address used as the initial administrator account. |
| `GMAIL_APP_PASSWORD` | Initial administrator's login password in the current implementation; use a strong password. |
| `FRONTEND_URL` | Frontend base URL used to build password-reset links. Defaults to `http://localhost:3000`. |

If both `GMAIL` and `GMAIL_APP_PASSWORD` are set, the backend creates an administrator account on startup when that email does not exist. If the account already exists, it is assigned the admin role and activated.

### Frontend (`frontend/.env`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL used by the browser. Defaults to `http://localhost:5000/api`. |

**Password reset note:** The current backend logs the reset link to its console; it does not send the link by email.

## How to run the application

Configure both environment files and make sure MySQL is running. From the project root, start the frontend and backend together:

```sh
npm run dev
```

- Frontend: <http://localhost:3000>
- Backend health/info endpoint: <http://localhost:5000/>
- REST API base path: `http://localhost:5000/api`

You can also start either service separately from the project root:

```sh
npm run dev:backend
npm run dev:frontend
```

Build the frontend with `npm run build`. To run the backend test suite, use:

```sh
cd backend
npm test
```

## Backend dependencies

The backend's dependencies are declared in `backend/package.json`:

- `express` and `cors` for the HTTP API.
- `sequelize` and `mysql2` for MySQL access.
- `jsonwebtoken` and `bcrypt` for authentication and password hashing.
- `multer` for profile image uploads.
- `dotenv` for backend environment configuration.
- `nodemon` for backend development.

## Application routes

### Frontend pages

| Route | Purpose |
| --- | --- |
| `/` | Public blog home page. |
| `/blogs/[id]` | View a blog post. |
| `/register` | Create an account. |
| `/login` | Sign in. |
| `/forgot-password` | Request a password reset. |
| `/reset-password/[token]` | Set a new password using a reset token. |
| `/dashboard` | User or administrator dashboard. |
| `/dashboard/blogs` | Manage the current user's blogs; admins can view all blogs. |
| `/dashboard/blogs/create` | Create a blog post. |
| `/dashboard/blogs/[id]/edit` | Edit a blog post. |
| `/dashboard/profile` | View and update the user's profile. |
| `/dashboard/change-password` | Change the current user's password. |
| `/dashboard/search` | Search dashboard content. |
| `/admin/users` | Admin user-management page. |

### Backend REST API

Protected routes require a JWT in the `Authorization: Bearer <token>` header. Routes marked **Admin** additionally require the administrator role.

| Method | API route | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/auth/forgot-password` | Public |
| `PATCH` | `/api/auth/reset-password/:token` | Public |
| `GET` | `/api/blogs` | Public; accepts optional `title` and `category` query parameters |
| `GET` | `/api/blogs/:id` | Public |
| `POST` | `/api/blogs/create` | Authenticated |
| `PUT` | `/api/blogs/update/:id` | Authenticated; own blog or Admin |
| `DELETE` | `/api/blogs/delete/:id` | Authenticated; own blog or Admin |
| `DELETE` | `/api/blogs/:id` | Authenticated; own blog or Admin |
| `GET` | `/api/users` | Admin |
| `GET` | `/api/users/:id` | Admin |
| `PATCH` | `/api/users/:id/status` | Admin |
| `GET` | `/api/users/profile` | Authenticated |
| `PUT` | `/api/users/profile/update` | Authenticated |
| `PATCH` | `/api/users/profile/image` | Authenticated; multipart field name: `image` |
| `PATCH` | `/api/users/password` | Authenticated |
| `GET` | `/uploads/:filename` | Public; serves uploaded profile images |

## User and Admin functionality

### User

- Register, sign in, and request a password reset.
- Browse, search, and filter public blog posts.
- Create, edit, and delete their own blog posts.
- Update their name, profile image, and password.
- View their dashboard and blog-management pages.

### Admin

- Use the dashboard to review blog and user information.
- View and manage all blog posts, including posts created by other users.
- View the user list and activate or deactivate accounts. Inactive users cannot log in.

The admin account is provisioned at backend startup using `GMAIL` and `GMAIL_APP_PASSWORD`, as described in the environment-variable section.

