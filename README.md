# Task Manager Application

A full-stack task management application built with Next.js and Spring Boot.

![Dashboard Screenshot](https://i.imgur.com/example-screenshot.png)

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```

### Step 2: Add Screenshots to Your README
1. Take screenshots of your application:
   - Login/Signup page
   - Dashboard
   - Task creation form
   - Task list view
2. Upload these screenshots to an image hosting service like Imgur
3. Replace the placeholder URLs in the README with your actual screenshot URLs

![README with Screenshots](https://i.imgur.com/example-readme.png)

## Part 3: Deploying to Vercel (Frontend)

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

![Vercel Signup](https://i.imgur.com/JQGjbJm.png)

### Step 2: Import Your GitHub Repository
1. Click "Add New..." and select "Project"
2. Connect your GitHub account if not already connected
3. Select your task-manager-app repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `.next`

![Import Repository](https://i.imgur.com/pnFLKXG.png)

### Step 3: Configure Environment Variables
1. Expand the "Environment Variables" section
2. Add the following variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your backend API URL (use a placeholder like `https://your-backend-url.com` for now)

![Environment Variables](https://i.imgur.com/7ZQCfWD.png)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Once deployed, Vercel will provide you with a URL for your frontend application

![Deployment Complete](https://i.imgur.com/example-deployed.png)

## Part 4: Deploying to Render (Backend)

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

![Render Signup](https://i.imgur.com/example-render-signup.png)

### Step 2: Create a New Web Service
1. Click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: task-manager-backend
   - Root Directory: backend
   - Build Command: `./mvnw clean package`
   - Start Command: `java -jar target/taskmanager-0.0.1-SNAPSHOT.jar`
   - Select the Free plan

![Create Web Service](https://i.imgur.com/example-render-config.png)

### Step 3: Configure Environment Variables
1. Scroll down to the "Environment" section
2. Add the following variables:
   - `SPRING_DATASOURCE_URL`: Your database URL
   - `SPRING_DATASOURCE_USERNAME`: Your database username
   - `SPRING_DATASOURCE_PASSWORD`: Your database password
   - `JWT_SECRET`: A secure random string for JWT signing

![Environment Variables](https://i.imgur.com/example-render-env.png)

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Once deployed, Render will provide you with a URL for your backend API

## Part 5: Deploying to PlanetScale (Database)

### Step 1: Create a PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up for an account

![PlanetScale Signup](https://i.imgur.com/example-planetscale-signup.png)

### Step 2: Create a New Database
1. Click "Create database"
2. Name your database: task-manager-db
3. Select a region close to your users
4. Click "Create"

![Create Database](https://i.imgur.com/example-planetscale-create.png)

### Step 3: Create a Database Password
1. Go to the "Passwords" tab
2. Click "New password"
3. Name your password: backend-connection
4. Click "Create password"
5. Save the connection details securely

![Create Password](https://i.imgur.com/example-planetscale-password.png)

### Step 4: Update Your Backend Configuration
1. Go back to your Render web service
2. Update the environment variables with your PlanetScale connection details
3. Redeploy your backend application

## Part 6: Connecting Everything Together

### Step 1: Update Frontend API URL
1. Go to your Vercel project settings
2. Update the `NEXT_PUBLIC_API_URL` environment variable with your actual Render backend URL
3. Redeploy your frontend application

### Step 2: Configure CORS on Backend
1. Ensure your Spring Boot application has CORS configured to accept requests from your Vercel domain
2. Update the CORS configuration in your SecurityConfig.java file

### Step 3: Test the Deployed Application
1. Open your Vercel frontend URL in a browser
2. Test user registration and login
3. Test creating, updating, and deleting tasks
4. Verify all features are working correctly

## Part 7: Updating Your GitHub Repository

### Step 1: Update the README with Deployment Information
1. Update the README.md with your actual deployment URLs
2. Add any additional setup instructions based on your deployment experience

### Step 2: Commit and Push the Changes
```bash
git add README.md
```
```bash
git commit -m "Update README with deployment instructions"
```
```bash
git push origin main