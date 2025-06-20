const express = require('express');
const router = express.Router();
const {
    getMemoList,
    getMemoDetail,
    createMemo,
    updateMemo,
    deleteMemo
} = require('../controllers/memoController');
const { protect } = require('../middleware/authMiddleware');

// All memo routes are protected
router.use(protect);

// Memo routes
router.get('/list', getMemoList);
router.get('/detail/:id', getMemoDetail);
router.post('/create', createMemo);
router.put('/update/:id', updateMemo);
router.delete('/delete/:id', deleteMemo);

module.exports = router; 