const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
    static async register(req, res) {
        try {
            const { username, password, role, email } = req.body;
            
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const userId = await User.create(username, password, role, email);
            
            const token = jwt.sign(
                { userId, username, role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({ token, userId, role });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error during registration' });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValid = await User.validatePassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, userId: user.id, role: user.role });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    }
}

module.exports = AuthController; 