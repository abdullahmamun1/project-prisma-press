# Prisma Press

A RESTful blogging platform API built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** backed by **PostgreSQL**. It supports user registration, JWT-based authentication, blog post management, and a comment system with admin moderation.

---

## Tech Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Runtime          | Node.js (ESM)                 |
| Framework        | Express 5                     |
| Language         | TypeScript 6                  |
| ORM              | Prisma 7                      |
| Database         | PostgreSQL                    |
| Auth             | JWT (access + refresh tokens) |
| Password hashing | bcryptjs                      |
| Dev runner       | tsx (watch mode)              |

---

## Project Structure

```
project-prisma-press/
├── src/
│   ├── server.ts               # Entry point — connects DB and starts server
│   ├── app.ts                  # Express app setup, middleware, route mounting
│   ├── config/
│   │   └── index.ts            # Centralised env config
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton
│   ├── middleware/
│   │   └── auth.ts             # JWT auth middleware with role enforcement
│   ├── modules/
│   │   ├── auth/               # Login & token refresh
│   │   ├── user/               # Registration & profile management
│   │   ├── post/               # Post CRUD + stats
│   │   └── comment/            # Comments + admin moderation
│   └── utils/
│       ├── jwt.ts              # Token create/verify helpers
│       ├── sendResponse.ts     # Standardised JSON response wrapper
│       └── catchAsync.ts       # Async error handler wrapper
├── prisma/
│   ├── schema/                 # Split schema files (user, post, comment, profile, enums)
│   └── migrations/             # Migration history
├── generated/
│   └── prisma/                 # Prisma-generated client (TypeScript)
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Data Models

### User

- `id`, `name`, `email`, `password` (hashed)
- `role`: `USER | ADMIN | AUTHOR`
- `activeStatus`: `ACTIVE | BLOCKED`
- One-to-one `Profile` (bio, profile photo)

### Post

- `id`, `title`, `content`, `thumbnail`, `tags[]`, `views`
- `status`: `DRAFT | PUBLISHED | ARCHIVED`
- `isFeatured` flag
- Belongs to a `User`; has many `Comment`s

### Comment

- `id`, `content`
- `status`: `APPROVED | REJECTED`
- Belongs to a `Post` and a `User`

### Profile

- `profilePhoto`, `bio`
- One-to-one with `User`

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path             | Description                                                      |
| ------ | ---------------- | ---------------------------------------------------------------- |
| POST   | `/login`         | Login with email & password; sets access + refresh token cookies |
| POST   | `/refresh-token` | Issue a new access token from the refresh token cookie           |

### Users — `/api/users`

| Method | Path          | Auth        | Description                                      |
| ------ | ------------- | ----------- | ------------------------------------------------ |
| POST   | `/register`   | Public      | Create a new user account (profile auto-created) |
| GET    | `/me`         | USER, ADMIN | Get own profile (password omitted)               |
| PUT    | `/my-profile` | USER, ADMIN | Update name, email, bio, profile photo           |

### Posts — `/api/posts`

| Method | Path        | Auth        | Description                                                |
| ------ | ----------- | ----------- | ---------------------------------------------------------- |
| GET    | `/`         | Public      | List all posts with author and comments                    |
| GET    | `/:postId`  | Public      | Get a single post (increments view count via transaction)  |
| GET    | `/my-posts` | USER, ADMIN | Get the authenticated user's posts                         |
| GET    | `/stats`    | ADMIN       | Aggregated stats: post counts, comment counts, total views |
| POST   | `/`         | USER, ADMIN | Create a new post                                          |
| PATCH  | `/:postId`  | USER, ADMIN | Update a post (owners or admins only)                      |
| DELETE | `/:postId`  | USER, ADMIN | Delete a post (owners or admins only)                      |

### Comments — `/api/comments`

| Method | Path                   | Auth        | Description                           |
| ------ | ---------------------- | ----------- | ------------------------------------- |
| POST   | `/`                    | USER, ADMIN | Add a comment to a post               |
| GET    | `/author/:authorId`    | Public      | Get all comments by a specific author |
| GET    | `/:commentId`          | Public      | Get a single comment                  |
| PATCH  | `/:commentId`          | USER, ADMIN | Update own comment                    |
| DELETE | `/:commentId`          | USER, ADMIN | Delete own comment                    |
| PATCH  | `/:commentId/moderate` | ADMIN       | Approve or reject a comment           |

---

## Authentication

Tokens are issued as **httpOnly cookies** on login. The auth middleware also accepts a `Bearer <token>` in the `Authorization` header as a fallback.

- **Access token**: short-lived, used for protected routes
- **Refresh token**: longer-lived (7 days), used to rotate access tokens

The middleware verifies the token, checks that the user still exists, and that their account is not `BLOCKED` before passing the request through.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database

### Installation

```bash
git clone <repo-url>
cd project-prisma-press
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/prisma_press"
APP_URL="http://localhost:3000"
PORT=5000

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate
```

### Running the Server

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build
npm start
```

The server starts on `http://localhost:5000` by default.

---

## Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start with `tsx` in watch mode   |
| `npm run build` | Compile TypeScript to `dist/`    |
| `npm start`     | Run compiled output from `dist/` |
