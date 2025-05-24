🚀 Revel Project

Welcome to the Revel Project! This guide will get you up and running with both the backend server and the frontend application.
💻 Prerequisites

Before you begin, ensure you have the following installed on your system:

    Node.js (LTS version recommended)

    PostgreSQL

⚙️ Setup and Installation

Follow these steps to set up and get the project running on your local machine.
1. Environment Configuration

Create a file named .env in the root directory of your project (where package.json is located). Add your database credentials to this file:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_database_password
    DB_DATABASE=bus_booking # Don't forget your database name!
    PORT=3000 # Or your desired backend port

Important: Never commit your .env file to version control. It contains sensitive information. We recommend adding .env to your .gitignore file.
2. Install Dependencies

Open your terminal in the root directory of the project and run the following command to install dependencies for both the frontend and backend:

npm run setup

This command first installs root-level dependencies (if any).
▶️ Running the Application
1. Start the Backend Server

Navigate into the server directory and start the backend:

cd server
npm run server

The server should start on the port specified in your .env file (e.g., http://localhost:3000).
2. Run One-Time Backend Initialization

After the backend server is running, you must visit the following URL in your browser (or use Postman) to explicitly trigger database initialization and seeding:

http://localhost:3000/api/init

3. Start the Frontend App

Open a new terminal window (keep the backend server running in the first one), navigate back to the root directory of your project, and start the frontend:

npm run dev

Your frontend application should now be accessible in your web browser, typically at http://localhost:5173 (or similar, depending on your frontend framework's default development port).