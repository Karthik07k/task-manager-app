# Task Manager Application

A full-stack task management application built with Next.js and Spring Boot.

![image](https://github.com/user-attachments/assets/87d5d51e-a38f-4693-9f57-20ffb0b3bd80)


## Features

- User authentication (signup, login)
- Create, read, update, and delete tasks
- Assign categories to tasks
- Set priority levels (High, Medium, Low)
- Mark tasks as completed or pending
- Filter tasks by category or completion status
- Search tasks by title
- Dashboard with task statistics
- Due date reminders and notifications

## Tech Stack

### Frontend
- Next.js with TypeScript
- Material UI for component design
- React Hooks for state management
- Axios for API communication

### Backend
- Spring Boot 3.4.3
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL database
- Java 17

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- Java 17
- MySQL
- Git

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. The frontend will be available at `http://localhost:3000`

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a MySQL database named `taskmanager`

3. Update `application.properties` with your database credentials:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Build the application:
   ```
   ./mvnw clean package
   ```

5. Run the application:
   ```
   java -jar target/taskmanager-0.0.1-SNAPSHOT.jar
   ```

6. The backend API will be available at `http://localhost:8080`

## Deployment

### Frontend Deployment (Vercel)
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate to the frontend directory and run:
   ```
   vercel
   ```
4. Follow the prompts to deploy your application
5. Set the environment variable `NEXT_PUBLIC_API_URL` to your deployed backend URL

### Backend Deployment (Render)
1. Create a Render account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command: `cd backend && ./mvnw clean package`
5. Set the start command: `cd backend && java -jar target/taskmanager-0.0.1-SNAPSHOT.jar`
6. Add environment variables for database connection

### Database Deployment (PlanetScale)
1. Create a PlanetScale account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection details and update your backend configuration

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Task Endpoints
- `GET /api/tasks` - Get all tasks for the authenticated user
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /api/tasks/category/{category}` - Get tasks by category
- `GET /api/tasks/status/{status}` - Get tasks by status

## Challenges Faced and Solutions

1. **JWT Authentication Implementation**
   - Challenge: Implementing secure JWT authentication
   - Solution: Used Spring Security with JWT libraries for token generation and validation

2. **Responsive Design**
   - Challenge: Making the application work well on both mobile and desktop
   - Solution: Used Material UI's responsive grid system and media queries

3. **Task Notifications**
   - Challenge: Implementing due date reminders
   - Solution: Created a notification system that checks for due tasks on dashboard load

## Future Enhancements

1. Task sharing with other users
2. Email notifications for upcoming tasks
3. Dark mode support
4. Task analytics and reporting
5. Subtasks and task dependencies
