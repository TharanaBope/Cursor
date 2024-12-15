# Ticket System Application

## Getting Started

### Prerequisites
- Node.js installed
- MySQL server running
- Required environment variables set in `.env` files

### Starting the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install        # Only needed first time or when dependencies change
   npm start         # Or: node server.js
   ```
   The backend server will start on port 5001

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm install        # Only needed first time or when dependencies change
   npm start
   ```
   The frontend application will start on port 3001

### Environment Configuration

#### Backend (.env)
Make sure these environment variables are set in `backend/.env`:
```
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=...
DB_NAME=ticket_system
JWT_SECRET=ticket_system_secret_key
```

#### Frontend (.env)
Make sure these environment variables are set in `frontend/.env`:
```
PORT=3001
REACT_APP_API_URL=http://localhost:5001
```

### Using the Application

1. Open your browser and navigate to `http://localhost:3001`
2. Log in or register a new account
3. Configure the ticket system:
   - Set number of producers
   - Set number of consumers
   - Set total tickets
   - Set release and retrieval rates
4. Click "Save Configuration"
5. Click "Start System" to begin the simulation

### Stopping the Application

1. In the terminal running the frontend, press `Ctrl + C`
2. In the terminal running the backend, press `Ctrl + C`

### Troubleshooting

If you encounter issues:

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials in `backend/.env`
   - Ensure the database exists

2. **Port Conflicts**
   - Make sure nothing else is running on ports 3001 and 5001
   - If needed, change ports in the .env files

3. **Socket Connection Issues**
   - Check that both frontend and backend are running
   - Verify the REACT_APP_API_URL in frontend .env matches the backend port
