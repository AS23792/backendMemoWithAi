const { generateToken } = require('../middleware/authMiddleware');
const AuthUser = require('../models/authUserModel');
const axios = require('axios');
// 伪缓存，生产环境请用Redis等
const sceneCache = new Map();
const appid = process.env.WECHAT_APPID;
const secret = process.env.WECHAT_APPSECRET;

// 1.1 获取微信扫码二维码
exports.getWxQrcode = async (req, res) => {
    // TODO: 调用微信API生成二维码，获取scene/uuid
    const scene = 'scene_' + Date.now();
    const qrCodeUrl = 'https://wx.qlogo.cn/xxx/' + scene + '.png';
    sceneCache.set(scene, { status: 'pending', user: null });
    res.json({ qrCodeUrl, scene });
};

// 1.2 轮询扫码状态
exports.getWxQrcodeStatus = async (req, res) => {
    const { scene } = req.query;
    const record = sceneCache.get(scene);
    if (!record || record.status !== 'scanned') {
        return res.json({ success: false, message: '等待扫码' });
    }
    // 已扫码，返回token等
    const { user } = record;
    const token = generateToken(user._id);
    return res.json({ success: true, token, userId: user._id, username: user.username });
};

// 1.3 微信扫码回调（H5扫码后由微信服务器回调）
exports.wxQrCallback = async (req, res) => {
    const { code, state } = req.query;
    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_APPSECRET;

    if (!sceneCache.has(state)) {
        return res.status(400).send('Invalid state');
    }

    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    try {
        const wxRes = await axios.get(url);
        const { openid, access_token } = wxRes.data;
        if (!openid) {
            return res.status(400).send('微信授权失败');
        }

        // 获取用户信息（可选）
        const userinfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`;
        const userinfoRes = await axios.get(userinfoUrl);
        const { nickname } = userinfoRes.data;

        let user = await AuthUser.findOne({ wxOpenId: openid });
        if (!user) {
            user = await AuthUser.create({ username: nickname || '微信用户', wxOpenId: openid });
        }

        sceneCache.set(state, { status: 'scanned', user });

        // 重定向到前端页面，带scene参数
        res.redirect(`${process.env.WECHAT_QR_FRONTEND_REDIRECT}?scene=${state}`);
    } catch (error) {
        res.status(500).send('微信API请求失败');
    }
};

// 2.1 小程序登录
exports.wxMpLogin = async (req, res) => {
    const { code } = req.body;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
        const wxRes = await axios.get(url);
        const { openid, errcode, errmsg } = wxRes.data;
        console.log(wxRes.data);
        if (!openid) {
            return res.status(400).json({ code: 400, message: errmsg || '微信登录失败', data: null });
        }
        let user = await AuthUser.findOne({ wxOpenId: openid });
        if (!user) {
            user = await AuthUser.create({ username: '微信用户', wxOpenId: openid });
        }
        const token = generateToken(user._id);
        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ code: 500, message: '微信API请求失败', data: null });
    }
};

// 3.1 App 微信登录
exports.wxAppLogin = async (req, res) => {
    const { code } = req.body;
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;

    try {
        const wxRes = await axios.get(url);
        const { openid, errcode, errmsg } = wxRes.data;
        if (!openid) {
            return res.status(400).json({ code: 400, message: errmsg || '微信登录失败', data: null });
        }
        let user = await AuthUser.findOne({ wxOpenId: openid });
        if (!user) {
            user = await AuthUser.create({ username: '微信用户', wxOpenId: openid });
        }
        const token = generateToken(user._id);
        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ code: 500, message: '微信API请求失败', data: null });
    }
}; 