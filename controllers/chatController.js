const axios = require('axios');
const ChatSession = require('../models/chatSessionModel');

// 讯飞星火大模型 API 配置
const SPARK_API_URL = 'https://spark-api-open.xf-yun.com/v2/chat/completions';
const SPARK_API_KEY_LIST = [
    'DOwGUSzdkdZHJfOwVoLb:NAwIJGMYmJHvqwtnPifC',
    'hjveRpBpQxAaNWtlImdE:vYOxOvLUsfRdTblZYMcI',
    'kcYbDghUDDvLLzpJNXEP:FTqRsOwwfWhzKReHbegc',
    'DqThxYJFBIYjWWLuUFqP:clEaaVhhcquhnoTRdIDu',
    'lgatuILJTVfujhsjnuIR:xZYHfBZhXAbpPytXbbza',
    'DcZuZWOqljJmRtLAjuad:JkgnXRpVWsBjtTCywsje',
    'FUTnljpZKCaHwbIMbNxX:xPjedgWaQwQtqtwSmhQz'
];

// 轮询计数器
let currentKeyIndex = 0;

// 获取下一个API密钥的函数
function getNextApiKey () {
    const key = SPARK_API_KEY_LIST[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % SPARK_API_KEY_LIST.length;
    return key;
}

exports.chat = async (req, res) => {
    const { messages, model = 'x1', sessionId, ...rest } = req.body;
    // Assuming user ID is available from auth middleware
    const userId = req.user.id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages 不能为空且必须为数组' });
    }

    try {
        const currentApiKey = getNextApiKey();

        const sparkPayload = {
            model,
            messages,
            stream: false,
            ...rest
        };

        const response = await axios.post(
            SPARK_API_URL,
            sparkPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentApiKey}`
                }
            }
        );

        const aiMessage = response.data.choices[0].message;

        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, user: userId });
            if (session) {
                session.messages.push(...messages.slice(session.messages.length));
                session.messages.push(aiMessage);
                await session.save();
            }
        } else {
            const title = messages[0].content.substring(0, 20);
            session = await ChatSession.create({
                user: userId,
                title: title,
                messages: [...messages, aiMessage]
            });
        }

        res.json({ ...response.data, sessionId: session._id });

    } catch (error) {
        console.error('讯飞API请求失败:', error.response?.data || error.message)
        const errMsg = error.response?.data || { message: error.message } || { message: '请求 AI 服务失败' };
        res.status(500).json({ error: errMsg });
    }
};

// 获取会话列表
exports.getChatSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({ user: req.user.id }).sort({ updateTime: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat sessions' });
    }
};

// 获取单个会话
exports.getChatSession = async (req, res) => {
    try {
        const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat session' });
    }
};

// 删除会话
exports.deleteChatSession = async (req, res) => {
    try {
        const session = await ChatSession.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat session' });
    }
};

// 更新会话
exports.updateChatSession = async (req, res) => {
    const { title } = req.body;
    try {
        const session = await ChatSession.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error updating chat session' });
    }
}; 