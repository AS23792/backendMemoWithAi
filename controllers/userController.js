const User = require('../models/userModel');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                code: 400,
                message: '两次输入的密码不一致',
                data: null
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                code: 400,
                message: '用户名已存在',
                data: null
            });
        }

        // Create new user
        const user = await User.create({
            username,
            password
        });

        if (user) {
            res.status(201).json({
                code: 200,
                message: '注册成功',
                data: {
                    userId: user._id,
                    username: user.username
                }
            });
        } else {
            res.status(400).json({
                code: 400,
                message: '用户数据无效',
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

// @desc    Login user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { username, password, remember } = req.body;
        console.log('收到登录请求', req.body);
        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists and password is correct
        if (user && await user.comparePassword(password)) {
            // Generate token
            const token = generateToken(user._id);

            res.json({
                code: 200,
                message: '登录成功',
                data: {
                    token,
                    userId: user._id,
                    username: user.username
                }
            });
        } else {
            res.status(401).json({
                code: 401,
                message: '用户名或密码错误',
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

module.exports = {
    registerUser,
    loginUser
}; 