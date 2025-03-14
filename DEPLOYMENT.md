# Deployment Guide for Task Manager Application

This document provides detailed instructions for deploying the Task Manager application to cloud platforms.

## Table of Contents
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Database Deployment (PlanetScale)](#database-deployment-planetscale)
- [Connecting Components](#connecting-components)
- [Troubleshooting](#troubleshooting)

## Frontend Deployment (Vercel)

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
   
   ![Vercel Signup](https://i.imgur.com/example-vercel-signup.png)

### Step 2: Import Your GitHub Repository
1. Click "Add New..." and select "Project"
2. Connect your GitHub account if not already connected
3. Select your task-manager-app repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `.next`
   
   ![Import Repository](https://i.imgur.com/example-vercel-import.png)

### Step 3: Configure Environment Variables
1. Expand the "Environment Variables" section
2. Add the following variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: Your backend API URL
   
   ![Environment Variables](https://i.imgur.com/example-vercel-env.png)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Once deployed, Vercel will provide you with a URL for your frontend application
   
   ![Deployment Complete](https://i.imgur.com/example-vercel-deployed.png)

## Backend Deployment (Render)

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

## Database Deployment (PlanetScale)

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

## Connecting Components

### Step 1: Update Frontend API URL
1. Go to your Vercel project settings
2. Update the `NEXT_PUBLIC_API_URL` environment variable with your actual Render backend URL
3. Redeploy your frontend application

### Step 2: Configure CORS on Backend
1. Ensure your Spring Boot application has CORS configured to accept requests from your Vercel domain
2. Update the SecurityConfig.java file with the following configuration:
   ```java
   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration configuration = new CorsConfiguration();
       configuration.setAllowedOrigins(Arrays.asList("https://your-vercel-app-url.vercel.app"));
       configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
       configuration.setAllowedHeaders(Arrays.asList("*"));
       configuration.setAllowCredentials(true);
       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
       source.registerCorsConfiguration("/**", configuration);
       return source;
   }
   ```

## Troubleshooting

### Common Issues and Solutions

#### Frontend Deployment Issues
- **Build Fails**: Ensure all dependencies are correctly installed and there are no TypeScript errors
- **API Connection Fails**: Check that the `NEXT_PUBLIC_API_URL` is correctly set and the backend is running

#### Backend Deployment Issues
- **Application Fails to Start**: Check the logs in Render for specific error messages
- **Database Connection Issues**: Verify your database credentials and connection string

#### Database Issues
- **Connection Timeout**: Ensure your database is in the same region as your backend for better performance
- **Authentication Failures**: Double-check your database username and password

### Getting Help
If you encounter issues not covered here, please:
1. Check the error logs in the respective platforms
2. Consult the documentation for [Vercel](https://vercel.com/docs), [Render](https://render.com/docs), or [PlanetScale](https://planetscale.com/docs)
3. Search for solutions on Stack Overflow
```

## Step 3: Add Actual Screenshots

For a more helpful guide:

1. Take screenshots of each step as you deploy your application
2. Upload these screenshots to an image hosting service like Imgur
3. Replace the placeholder image URLs in the DEPLOYMENT.md file with your actual screenshot URLs

## Step 4: Commit and Push

After creating the file:

1. If you created it locally, commit and push it to GitHub:
```bash
git add DEPLOYMENT.md
git commit -m "Add detailed deployment documentation"
git push origin main
