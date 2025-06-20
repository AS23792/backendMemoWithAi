const mongoose = require('mongoose');
const User = require('./models/userModel');
const Memo = require('./models/memoModel');

// 连接数据库
async function connectDB () {
    try {
        await mongoose.connect('mongodb://root:lpk5d757@test-db-mongodb.ns-sdllvr4b.svc:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB 连接成功');
    } catch (error) {
        console.error('❌ MongoDB 连接失败:', error);
        process.exit(1);
    }
}

// 查看所有用户
async function viewUsers () {
    try {
        console.log('\n📋 用户列表:');
        console.log('='.repeat(50));

        const users = await User.find({}).select('-password');

        if (users.length === 0) {
            console.log('暂无用户数据');
            return;
        }

        users.forEach((user, index) => {
            console.log(`${index + 1}. 用户ID: ${user._id}`);
            console.log(`   用户名: ${user.username}`);
            console.log(`   创建时间: ${user.createdAt}`);
            console.log(`   更新时间: ${user.updatedAt}`);
            console.log('-'.repeat(30));
        });

        console.log(`总计: ${users.length} 个用户`);
    } catch (error) {
        console.error('查看用户失败:', error);
    }
}

// 查看所有备忘录
async function viewMemos () {
    try {
        console.log('\n📝 备忘录列表:');
        console.log('='.repeat(50));

        const memos = await Memo.find({})
            .populate('user', 'username')
            .sort({ updateTime: -1 });

        if (memos.length === 0) {
            console.log('暂无备忘录数据');
            return;
        }

        memos.forEach((memo, index) => {
            console.log(`${index + 1}. 备忘录ID: ${memo._id}`);
            console.log(`   标题: ${memo.title}`);
            console.log(`   内容: ${memo.content.substring(0, 50)}${memo.content.length > 50 ? '...' : ''}`);
            console.log(`   用户: ${memo.user.username} (${memo.user._id})`);
            console.log(`   创建时间: ${memo.createTime}`);
            console.log(`   更新时间: ${memo.updateTime}`);
            console.log('-'.repeat(30));
        });

        console.log(`总计: ${memos.length} 条备忘录`);
    } catch (error) {
        console.error('查看备忘录失败:', error);
    }
}

// 查看特定用户的备忘录
async function viewUserMemos (userId) {
    try {
        console.log(`\n📝 用户 ${userId} 的备忘录:`);
        console.log('='.repeat(50));

        const memos = await Memo.find({ user: userId })
            .populate('user', 'username')
            .sort({ updateTime: -1 });

        if (memos.length === 0) {
            console.log('该用户暂无备忘录');
            return;
        }

        memos.forEach((memo, index) => {
            console.log(`${index + 1}. 备忘录ID: ${memo._id}`);
            console.log(`   标题: ${memo.title}`);
            console.log(`   内容: ${memo.content}`);
            console.log(`   创建时间: ${memo.createTime}`);
            console.log(`   更新时间: ${memo.updateTime}`);
            console.log('-'.repeat(30));
        });

        console.log(`总计: ${memos.length} 条备忘录`);
    } catch (error) {
        console.error('查看用户备忘录失败:', error);
    }
}

// 查看数据库统计信息
async function viewStats () {
    try {
        console.log('\n📊 数据库统计信息:');
        console.log('='.repeat(50));

        const userCount = await User.countDocuments();
        const memoCount = await Memo.countDocuments();

        console.log(`用户总数: ${userCount}`);
        console.log(`备忘录总数: ${memoCount}`);

        // 按用户统计备忘录数量
        const memoStats = await Memo.aggregate([
            {
                $group: {
                    _id: '$user',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            }
        ]);

        console.log('\n各用户备忘录数量:');
        memoStats.forEach(stat => {
            const username = stat.userInfo[0]?.username || '未知用户';
            console.log(`  ${username}: ${stat.count} 条`);
        });

    } catch (error) {
        console.error('查看统计信息失败:', error);
    }
}

// 主函数
async function main () {
    await connectDB();

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'users':
            await viewUsers();
            break;
        case 'memos':
            await viewMemos();
            break;
        case 'user-memos':
            const userId = args[1];
            if (!userId) {
                console.log('请提供用户ID: node db-viewer.js user-memos <userId>');
                break;
            }
            await viewUserMemos(userId);
            break;
        case 'stats':
            await viewStats();
            break;
        case 'all':
            await viewUsers();
            await viewMemos();
            await viewStats();
            break;
        default:
            console.log(`
🔍 数据库查看工具

使用方法:
  node db-viewer.js users          - 查看所有用户
  node db-viewer.js memos          - 查看所有备忘录
  node db-viewer.js user-memos <id> - 查看特定用户的备忘录
  node db-viewer.js stats          - 查看数据库统计信息
  node db-viewer.js all            - 查看所有信息

示例:
  node db-viewer.js users
  node db-viewer.js user-memos 60d21b4667d0d8992e610c85
            `);
    }

    await mongoose.disconnect();
    console.log('\n✅ 数据库连接已关闭');
}

// 运行程序
main().catch(console.error); 