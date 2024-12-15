mkdir ticket-system
cd ticket-system

# Backend setup
mkdir backend
cd backend
npm init -y

# Install necessary dependencies
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken socket.io
npm install --save-dev nodemon

# Development dependencies
npm install --save-dev jest supertest 