const express = require('express');
const router = express.Router();
const { chat, getChatSessions, getChatSession, deleteChatSession, updateChatSession } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/chat
// @desc    与AI对话
// @access  Private
router.post('/', protect, chat);

// @route   GET /api/chat/sessions
// @desc    获取用户的会话列表
// @access  Private
router.get('/sessions', protect, getChatSessions);

// @route   GET /api/chat/sessions/:id
// @desc    获取单个会话
// @access  Private
router.get('/sessions/:id', protect, getChatSession);

// @route   DELETE /api/chat/sessions/:id
// @desc    删除单个会話
// @access  Private
router.delete('/sessions/:id', protect, deleteChatSession);

// @route   PUT /api/chat/sessions/:id
// @desc    更新单个会話
// @access  Private
router.put('/sessions/:id', protect, updateChatSession);

module.exports = router; 