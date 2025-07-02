# 微信授权登录后端 API 接口文档

## 1. H5 端：微信扫码登录

### 1.1 获取微信扫码二维码

- **接口**：`POST /api/auth/wx/qrcode`
- **描述**：生成微信扫码登录二维码，返回二维码图片 URL 和唯一标识（scene/uuid）。
- **请求参数**：无
- **响应示例**：

```json
{
  "qrCodeUrl": "https://wx.qlogo.cn/xxx/xxx.png",
  "scene": "unique_scene_id"
}
```

---

### 1.2 轮询扫码状态

- **接口**：`GET /api/auth/wx/qrcode/status`
- **描述**：前端轮询，查询二维码是否被扫码并授权。
- **请求参数**：
  - `scene`：二维码唯一标识
- **响应示例**（未扫码/未授权）：

```json
{
  "success": false,
  "message": "等待扫码"
}
```

- **响应示例**（扫码并授权成功）：

```json
{
  "success": true,
  "token": "jwt_token",
  "userId": "123",
  "username": "张三"
}
```

---

## 2. 小程序端：微信授权登录

### 2.1 小程序登录

- **接口**：`POST /api/auth/wx/mp-login`
- **描述**：小程序端通过 `uni.login` 获取 code，后端用 code 换取 openid 并登录/注册。
- **请求参数**：

```json
{
  "code": "wx_code"
}
```

- **响应示例**：

```json
{
  "token": "jwt_token",
  "userId": "123",
  "username": "张三"
}
```

---

## 3. App 端：微信授权登录

### 3.1 App 微信登录

- **接口**：`POST /api/auth/wx/app-login`
- **描述**：App 端通过微信 SDK 获取 code，后端用 code 换取 openid 并登录/注册。
- **请求参数**：

```json
{
  "code": "wx_code"
}
```

- **响应示例**：

```json
{
  "token": "jwt_token",
  "userId": "123",
  "username": "张三"
}
```

---

## 4. 通用说明

- **token**：建议为 JWT 或自定义 session token，前端存储后用于免登录。
- **用户信息**：可根据业务返回更多字段。
- **安全性**：所有接口建议使用 HTTPS。
- **扫码登录流程**：
  1. 前端请求二维码，后端生成 scene 并缓存（如 Redis），返回二维码 URL 和 scene。
  2. 用户用微信扫码，微信回调后端，后端将 scene 与用户绑定，生成 token。
  3. 前端轮询 status 接口，获取 token 后完成登录。

---

## 5. 伪代码流程（扫码登录）

```mermaid
sequenceDiagram
    participant 前端
    participant 后端
    participant 微信

    前端->>后端: POST /api/auth/wx/qrcode
    后端->>微信: 获取二维码
    微信-->>后端: 返回二维码URL
    后端-->>前端: 返回二维码URL和scene

    前端->>用户: 展示二维码
    用户->>微信: 扫码授权
    微信->>后端: 回调带scene和用户信息
    后端: 生成token, 绑定scene

    loop 轮询
        前端->>后端: GET /api/auth/wx/qrcode/status?scene=xxx
        alt 未扫码
            后端-->>前端: success: false
        else 已扫码
            后端-->>前端: success: true, token
        end
    end
```

---

## 6. 依赖

- 需在微信开放平台/小程序后台配置好相关回调和 AppID/Secret。
- 需后端实现微信 API 对接（如获取 access_token、openid、session_key 等）。

---

### 1. 新建 `.env` 文件（项目根目录）

```
WECHAT_APPID=wx37c9c09240209b50
WECHAT_APPSECRET=4d15ebdee800cefd146390157c92c093
```

---

### 2. 确保 `.env` 文件已加入 `.gitignore`，防止泄露

在 `.gitignore` 文件中添加：

```
.env
```

---

### 3. 在 Node.js 项目入口（如 `hello.js`）顶部引入 dotenv

```js
require('dotenv').config()
```

---

### 4. 在需要用到微信 AppID/Secret 的地方这样获取

```js
const appid = process.env.WECHAT_APPID
const secret = process.env.WECHAT_APPSECRET
```

---

### 5. 对接微信 API 时使用

以小程序 code 换 openid 为例：

```js
const axios = require('axios')
const code = req.body.code
const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`

const wxRes = await axios.get(url)
const { openid, session_key } = wxRes.data
// 用 openid 查找/注册用户
```

---

如需对接微信扫码登录、网页授权、或其它端的完整后端代码示例，请随时告知！  
如果你需要我帮你直接补充某个 controller 的微信 API 对接代码，也可以直接说明。
