const Memo = require('../models/memoModel');

// @desc    Get all memos for a user with pagination
// @route   GET /api/memo/list
// @access  Private
const getMemoList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        // Find memos for the logged-in user
        const total = await Memo.countDocuments({ user: req.user._id });
        const memos = await Memo.find({ user: req.user._id })
            .sort({ updateTime: -1 })
            .skip(skip)
            .limit(pageSize);

        // Format memos for response
        const formattedMemos = memos.map(memo => ({
            id: memo._id,
            title: memo.title,
            content: memo.content.substring(0, 100) + (memo.content.length > 100 ? '...' : ''), // content summary
            createTime: memo.createTime,
            updateTime: memo.updateTime
        }));

        res.json({
            code: 200,
            message: 'success',
            data: {
                total,
                list: formattedMemos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

// @desc    Get single memo by ID
// @route   GET /api/memo/detail/:id
// @access  Private
const getMemoDetail = async (req, res) => {
    try {
        const memo = await Memo.findById(req.params.id);

        // Check if memo exists
        if (!memo) {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }

        // Check if user owns the memo
        if (memo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                code: 403,
                message: '没有权限访问此备忘录',
                data: null
            });
        }

        res.json({
            code: 200,
            message: 'success',
            data: {
                id: memo._id,
                title: memo.title,
                content: memo.content,
                createTime: memo.createTime,
                updateTime: memo.updateTime
            }
        });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

// @desc    Create a new memo
// @route   POST /api/memo/create
// @access  Private
const createMemo = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                code: 400,
                message: '标题和内容不能为空',
                data: null
            });
        }

        // Create new memo
        const memo = await Memo.create({
            title,
            content,
            user: req.user._id
        });

        res.status(201).json({
            code: 200,
            message: '创建成功',
            data: {
                id: memo._id,
                title: memo.title,
                content: memo.content,
                createTime: memo.createTime,
                updateTime: memo.updateTime
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

// @desc    Update a memo
// @route   PUT /api/memo/update/:id
// @access  Private
const updateMemo = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                code: 400,
                message: '标题和内容不能为空',
                data: null
            });
        }

        // Find memo
        let memo = await Memo.findById(req.params.id);

        // Check if memo exists
        if (!memo) {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }

        // Check if user owns the memo
        if (memo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                code: 403,
                message: '没有权限修改此备忘录',
                data: null
            });
        }

        // Update memo
        memo.title = title;
        memo.content = content;
        await memo.save();

        res.json({
            code: 200,
            message: '更新成功',
            data: {
                id: memo._id,
                title: memo.title,
                content: memo.content,
                createTime: memo.createTime,
                updateTime: memo.updateTime
            }
        });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

// @desc    Delete a memo
// @route   DELETE /api/memo/delete/:id
// @access  Private
const deleteMemo = async (req, res) => {
    try {
        // Find memo
        const memo = await Memo.findById(req.params.id);

        // Check if memo exists
        if (!memo) {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }

        // Check if user owns the memo
        if (memo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                code: 403,
                message: '没有权限删除此备忘录',
                data: null
            });
        }

        // Delete memo
        await Memo.deleteOne({ _id: memo._id });

        res.json({
            code: 200,
            message: '删除成功',
            data: null
        });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                code: 404,
                message: '备忘录不存在',
                data: null
            });
        }
        res.status(500).json({
            code: 500,
            message: '服务器内部错误',
            data: null
        });
    }
};

module.exports = {
    getMemoList,
    getMemoDetail,
    createMemo,
    updateMemo,
    deleteMemo
}; 