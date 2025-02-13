
# Appointment Scheduling API

## Overview

The **Appointment Scheduling API** is a backend system built using the **PERN** stack (PostgreSQL, Express.js, React, Node.js) to manage user appointments efficiently. It provides functionalities for user authentication, appointment booking, and staff availability management. The system supports JWT authentication, Prisma ORM for database interactions, and Swagger API documentation.

## Features

-   **User Authentication**: Secure sign-up and login with JWT-based authentication.
-   **Appointment Management**: Users can book, reschedule, and cancel appointments.
-   **Availability Slots**: Staff can set and manage their availability.
-   **Role-Based Access Control**: Admins and staff have different permissions.
-   **API Documentation**: Integrated with Swagger for easy API exploration.
-   **Prisma ORM**: Manages database models and migrations.
-   **Email/SMS Notifications**: Reminders for upcoming appointments.

## Technologies Used

-   **Backend**: Express.js, Node.js
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: JWT (JSON Web Tokens)
-   **Documentation**: Swagger UI
-   **Containerization**: Docker (Optional for PostgreSQL setup)

----------

## How to Run the Project

### Prerequisites

-   **Node.js** (v16 or higher)
-   **Docker** (for optional database containerization)
-   **Docker Compose** (for multi-container management)
-   **PostgreSQL** (If not using Docker for DB)

### 1. Clone the Repository

```bash
git clone https://github.com/aman75way/Appointment-Scheduling-Backend
cd appointment-scheduling-backend

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Docker Setup (Optional)

If you want to run PostgreSQL via Docker, use:

```bash
docker-compose up -d

```

This will start a PostgreSQL container accessible on `localhost:5430`.

### 4. Set Up Environment Variables

Create a `.env` file at the root of the project and add:

```bash
JWT_SECRET=<your-secret-key>
DATABASE_URL=postgresql://postgres:admin@localhost:5430/appointments?schema=public

```

### 5. Prisma Database Setup

Run the following Prisma commands to set up the database:

```bash
npx prisma migrate dev
npx prisma generate

```

### 6. Running the Application

-   **Development Mode**:

```bash
npm run dev

```
----------
-   **Production Mode**:

```bash
npm run build
npm start

```

### 7. Accessing the Application

-   **Backend API**: `http://localhost:5000`
-   **Swagger API Documentation**: `http://localhost:5000/api-docs`

----------

## Swagger UI API Documentation

Access Swagger UI at:

```
http://localhost:5000/api-docs

```

This provides details on all available routes for user management, appointment scheduling, and availability management.

----------

## Running Tests

If tests are set up, run them using:

```bash
npm test

```

----------

## License

This project is licensed under the ISC License.

## Acknowledgements

-   **Prisma ORM**: Database management.
-   **PostgreSQL**: Database service.
-   **JWT**: Secure authentication.
-   **Docker**: Containerization of the database.

----------

## File Structure

```markdown
.
├── app
│   ├── common
│   │   ├── dto
│   │   ├── helpers
│   │   ├── middlewares
│   │   ├── types
│   │   └── services
│   ├── appointment
│   │   ├── appointment.controller.ts
│   │   ├── appointment.dto.ts
│   │   ├── appointment.routes.ts
│   │   ├── appointment.service.ts
│   │   ├── appointment.validation.ts
│   ├── availability
│   │   ├── availability.controller.ts
│   │   ├── availability.dto.ts
│   │   ├── availability.routes.ts
│   │   ├── availability.service.ts
│   │   ├── availability.validation.ts
│   ├── user
│   │   ├── user.controller.ts
│   │   ├── user.dto.ts
│   │   ├── user.routes.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   └── routes.ts
├── prisma
│   ├── migrations
│   └── schema.prisma
├── .env
├── package.json
├── package-lock.json
├── postman-test.json
├── docker-compose.yml
├── tsconfig.json
├── swagger.json
├── README.md
└── index.ts

```

## Explanation of Key Folders and Files

-   **app/**: Contains business logic for users, appointments, and availability.
-   **common/**: Reusable DTOs, helpers, middlewares, and services.
-   **appointment/**: Handles appointment-related functionality.
-   **availability/**: Manages staff availability.
-   **user/**: Handles authentication and user management.
-   **prisma/**: Database schema and migrations.
-   **swagger.json**: API documentation.
-   **docker-compose.yml**: PostgreSQL setup for containerization.
-   **index.ts**: Main entry point for the application.
