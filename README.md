# Authentication Project

Welcome to the **Authentication Project**! This project demonstrates a user authentication system built with Next.js, showcasing a full-stack approach to secure user login, signup, and session handling.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
  - [Signup](#signup)
  - [Login](#login)
  - [Session Handling and Authorization](#session-handling-and-authorization)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

## Overview

This project implements a basic authentication system that includes:
- **User Signup**: Allows new users to register by creating an account.
- **User Login**: Existing users can log in with their credentials.
- **Session Management**: Authenticated sessions are handled using JSON Web Tokens (JWT) stored in the browser's `localStorage`.
- **Redirection and Access Control**: After successful authentication, users are redirected to the homepage.

## Technologies Used

- **Next.js**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Node.js and Express**: Backend server
- **MongoDB**: Database for user data
- **JWT**: JSON Web Tokens for secure session handling
- **CSS (Tailwind)**: For styling the UI

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/beki-kel/Authentication_project.git
   cd Authentication_project
2. Install dependencies:
   ```bash
     npm install

### Environment Variables:
     Create a .env file in the root directory with the following environment variables:
      ```bash
            MONGO_URI= "YOUR_API_KEY"
              PORT= 5000
              ACCESS_TOKEN_SECRET=aa80ac0c73b02909386f6ffed1b44c616baed40b5ad48caa3a368aa2329fe338
              REFRESH_TOKEN_SECRET=4511aa0a628a90f685b3858e120872fd5716abb27fe6fa360688753fd53d8629
              NODE_ENV=development
              CLIENT_URL=http://localhost:3000
              GEMINI_API_KEY="YOUR_API_KEY"
## Authentication Flow

### Signup
The **Signup** flow allows new users to register by providing their name, email, and password. The frontend sends a POST request to the backend `/auth/register` endpoint, which performs the following steps:

1. **Validates** user input (e.g., ensures email is unique) and password must be length of 8, one uppercase , symbol ,and digit is must.
2. **Hashes** the password before saving the user data to the database.
3. Returns a **success response**, redirecting the user to the login page with the email pre-filled in the login form.

### Login
The **Login** flow handles user authentication with an email and password. On form submission:

1. The frontend sends a POST request to the `/auth/login` endpoint.
2. If credentials match, the backend generates a **JWT** for session management, which is returned in the response.
3. there will be **two** cookies on is refresh token which is HTTPONLY and the other is an access token
4. the access expires  every 6 mins while the refresh takes 7 days to expire
5. The user is **redirected** to the homepage or intended page upon successful login.

### chat

1. When a user sends a request to the backend with a prompt, a middleware checks the authentication tokens.
2. If the access token has expired, the middleware uses the refresh token to generate a new access token.
3. upon successful authentication the prompt is sent to the route which uses the Gemini API to generate a response

### Session Handling and Authorization
The session is handled using JWTs to secure and verify user identity. Key details include:

Token Storage: Tokens are stored in cookies. the refresh token is an HTTP-only cookie while the other can be accessed by the client
Route Protection: Protected routes check for the presence of the token. Absence or invalidity results in redirecting the user to the login page.

### Usage
After setting up the project:
1. Start the Next.js development server:
    ```bash
           npm run dev
2. start the client
      ```bash
                 cd front
                 npm run dev

_________________________________________________________________________________________________________________________________________________________________________________________________
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
