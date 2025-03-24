Apollonia Employee Management App

This is a simple full-stack web application for managing employees and departments at a dental clinic called Apollonia.

Technology Stack:
- Backend: Node.js, Express, MongoDB with Mongoose
- Frontend: HTML, CSS, JavaScript
- Authentication: Basic Auth using middleware
- Containerization: Docker, Docker Compose
- Testing: Jest, Supertest

Main Features:
- Add, edit, delete employees
- Assign employees to one or more departments
- Create, update, and delete departments
- Search employees by name
- Login with basic authentication
- Protected routes for employee operations
- Dockerized with persistent volume for MongoDB
- Seed script to populate test data
- Unit tests for employee and department APIs

Project Structure:
- models/ -> Mongoose schemas for Department and Employee
- controllers/ -> Logic for handling routes
- routes/ -> Express routers for departments and employees
- middleware/ -> Auth middleware
- public/ -> Frontend files (HTML, CSS, JS)
- tests/ -> Unit tests for APIs
- server.js -> Main entry point of the server
- seed.js -> Script to populate database with sample data
- Dockerfile, docker-compose.yml -> For containerization

How to Run:

1. Clone the project
2. Create a `.env` file in root with:

   BASIC_USER=admin
   BASIC_PASS=secret123
   MONGO_URI=mongodb://mongo:27017/apollonia
   PORT=3000

3. Build and run with Docker Compose:

   docker-compose up --build

4. Optionally seed the database:

   docker exec -it apollonia-app bash
   node seed.js

5. Access the app in your browser at:

   http://localhost:3000

6. Login using:

   Username: admin
   Password: secret123

7. Use the app to manage employees and departments.

Note:
- You must be logged in to add, edit, or delete employees.
- Credentials are stored in browser localStorage.
- Use `npm run test` to run unit tests.

License: Free for learning and educational use.