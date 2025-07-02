const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');


// Import routes
const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/memo', memoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:lpk5d757@test-db-mongodb.ns-sdllvr4b.svc:27017';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});