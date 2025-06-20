const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// JWT secret key
const JWT_SECRET = 'memo-app-secret-key';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d' // Token expires in 30 days
    });
};

// Protect routes middleware
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Find user by id
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    message: 'Not authorized, token failed',
                    data: null
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                code: 401,
                message: 'Not authorized, token failed',
                data: null
            });
        }
    }

    if (!token) {
        res.status(401).json({
            code: 401,
            message: 'Not authorized, no token',
            data: null
        });
    }
};

module.exports = { generateToken, protect }; 