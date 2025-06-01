# Library API

A RESTful API for task management built with Node.js, Express, and PostgreSQL.

## Description

A RESTful API for managing library resources including books, categories, and users. The API supports file uploads for book covers and PDFs, with authentication and error handling middleware.

## Technology Stack

- **Backend**: Node.js

- **Database**: Prisma ORM with SQL database

- **File Storage**: Local file system (uploads directory)

- **Authentication**: JWT (JSON Web Tokens)

## Features

- Create, read, update, and delete books

- Search books by title or description

- RESTful API design

- Error handling middleware

- Database integration with Prisma ORM

## Installation

1. Clone the repository:

```bash

git clone <repository-url>
cd project-folder

```

2. Install dependencies:

```bash

npm install

```

3. Create a `.env` file in the root directory with the following content:

   DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"

   PORT=4000

   JWT_SECRET="your_jwt_secret_key"

   JWT_EXPIRATION_TIME="expired_in"

   NODE_ENV=development

4. Generate Prisma client:

```bash

npm run prisma:generate

```

5. Run database migrations:

```bash

npm run prisma:migrate

```

6. Start the development server:

```bash

npm run dev

```

## API Endpoints

- `GET /api/books` - Get all tasks (with optional filtering)

- `GET /api/books/:id` - Get a specific task

- `POST /api/books` - Create a new task

- `PUT /api/books/:id` - Update a task

- `DELETE /api/books/:id` - Delete a task

## Scripts

- `npm run dev` - Start the development server with hot reload

- `npm run prisma:generate` - Generate Prisma client

- `npm run prisma:migrate` - Run database migrations

- `npm run prisma:studio` - Open Prisma Studio to manage database

- `npm run test` - Run tests
