const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        // First, try to connect without database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD
        });
        
        console.log('Successfully connected to MySQL!');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ticket_system'}`);
        console.log('Database created or already exists');
        
        // Use the database
        await connection.query(`USE ${process.env.DB_NAME || 'ticket_system'}`);
        
        // Import schema
        const schema = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('vendor', 'customer', 'admin') NOT NULL,
            email VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

        -- Configurations table
        CREATE TABLE IF NOT EXISTS configurations (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            num_producers INT NOT NULL,
            num_consumers INT NOT NULL,
            total_tickets INT NOT NULL,
            ticket_release_rate INT NOT NULL,
            customer_retrieval_rate INT NOT NULL,
            max_ticket_capacity INT NOT NULL,
            status ENUM('active', 'inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        -- System logs table
        CREATE TABLE IF NOT EXISTS system_logs (
            id INT PRIMARY KEY AUTO_INCREMENT,
            configuration_id INT,
            action_type ENUM('PRODUCER', 'CONSUMER', 'SYSTEM') NOT NULL,
            message TEXT NOT NULL,
            tickets_available INT,
            tickets_sold INT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (configuration_id) REFERENCES configurations(id)
        );

        -- Tickets table
        CREATE TABLE IF NOT EXISTS tickets (
            id INT PRIMARY KEY AUTO_INCREMENT,
            configuration_id INT,
            status ENUM('AVAILABLE', 'SOLD') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (configuration_id) REFERENCES configurations(id)
        );`;
        
        await connection.query(schema);
        console.log('Schema imported successfully');
        
        // Test querying the users table
        const [rows] = await connection.query('SELECT * FROM users');
        console.log('Current users:', rows);
        
        await connection.end();
    } catch (error) {
        console.error('Database connection/setup error:', error);
    }
}

testConnection();
