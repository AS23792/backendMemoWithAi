const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');


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
const http = require('http');
const WebSocket = require('ws');
const { handleChatStream } = require('./controllers/chatController'); // 路径按实际调整
function verifyTokenAndGetUserId (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded', decoded);
        return decoded.id;
    } catch (e) {
        console.error('token verify error', e);
        return null;
    }
}

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// WebSocket服务监听 /ws/chat 路径
const wss = new WebSocket.Server({ server, path: '/ws/chat' });

wss.on('connection', (ws, req) => {
    // 1. 解析 token
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('authHeader', authHeader)
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        userId = verifyTokenAndGetUserId(token);
    }
    // 2. 没有 userId，直接返回未登录
    if (!userId) {
        ws.send(JSON.stringify({ error: '暂未登录' }));
        ws.close();
        return;
    }
    ws.userId = userId;
    ws.on('message', (message) => {
        handleChatStream(ws, message);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP/WS server is running on port ${PORT}`);
});



