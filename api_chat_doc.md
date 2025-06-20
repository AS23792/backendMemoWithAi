# AI 聊天接口文档

## 基本信息

- **接口地址**：`/api/chat`
- **请求方式**：POST
- **请求类型**：application/json
- **接口描述**：前端发送用户输入内容，后端转发到讯飞星火大模型，返回 AI 回复内容。

---

## 请求参数

| 参数名  | 类型   | 是否必填 | 说明               |
| ------- | ------ | -------- | ------------------ |
| content | string | 是       | 用户输入的消息内容 |

**请求体示例：**

```json
{
  "content": "你好，AI"
}
```

---

## 响应参数

| 参数名  | 类型   | 说明                           |
| ------- | ------ | ------------------------------ |
| content | string | AI 回复的内容                  |
| error   | string | 错误信息（可选，仅出错时返回） |

**成功响应示例：**

```json
{
  "content": "你好，有什么可以帮您？"
}
```

**失败响应示例：**

```json
{
  "error": "内容不能为空"
}
```

---

## 前端调用示例

### axios 示例

```js
import axios from 'axios'

async function chatWithAI(userInput) {
  const res = await axios.post('/api/chat', { content: userInput })
  if (res.data.content) {
    console.log('AI:', res.data.content)
  } else if (res.data.error) {
    console.error('Error:', res.data.error)
  }
}
```

### fetch 示例

```js
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: '你好，AI' }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.content) {
      console.log('AI:', data.content)
    } else if (data.error) {
      console.error('Error:', data.error)
    }
  })
```

---

## 备注

- 请确保后端已正确配置讯飞星火大模型的 API 密钥（环境变量 `SPARK_API_KEY`）。
- 若遇到 `error` 字段，前端可根据提示做相应处理。

---

如需补充其他内容或有特殊对接需求，请随时联系开发者。

### 认证

所有聊天相关的 API 都需要通过 `Bearer Token` 进行身份验证。在请求头中加入：

`Authorization: Bearer <YOUR_JWT_TOKEN>`

---

### 1. 发送消息（创建或继续会话）

此端点用于与 AI 进行对话。如果提供了 `sessionId`，则会将消息添加到现有会话中。否则，将创建一个新会话。

- **URL**: `/api/chat`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body**:

  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "你好，AI！"
      }
    ],
    "model": "x1", // 可选，默认为 'x1'
    "sessionId": "60c72b2f9b1d8c001f8e4a3c" // 可选，用于继续现有对话
  }
  ```

- **Success Response (200 OK)**:

  ```json
  {
    // ... 讯飞星火 API 返回的原始数据
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "你好！有什么可以帮助你的吗？"
        }
      }
    ],
    "sessionId": "60c72b2f9b1d8c001f8e4a3c" // 返回当前或新创建的会话ID
  }
  ```

- **Error Response (400 Bad Request)**:

  ```json
  {
    "error": "messages 不能为空且必须为数组"
  }
  ```

---

### 2. 获取所有会话列表

检索当前用户的所有聊天会话，按更新时间倒序排列。

- **URL**: `/api/chat/sessions`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Success Response (200 OK)**:

  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4a3c",
      "title": "关于Vue3的问题",
      "user": "60c72b1a9b1d8c001f8e4a3b",
      "createTime": "2023-10-27T10:00:00.000Z",
      "updateTime": "2023-10-27T10:05:00.000Z"
    },
    {
      "_id": "60c72b3a9b1d8c001f8e4a3d",
      "title": "项目开发讨论",
      "user": "60c72b1a9b1d8c001f8e4a3b",
      "createTime": "2023-10-26T15:30:00.000Z",
      "updateTime": "2023-10-26T16:00:00.000Z"
    }
  ]
  ```

---

### 3. 获取单个会话详情

根据会话 ID 获取完整的会话内容，包括所有消息。

- **URL**: `/api/chat/sessions/:id`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Success Response (200 OK)**:

  ```json
  {
    "_id": "60c72b2f9b1d8c001f8e4a3c",
    "title": "关于Vue3的问题",
    "user": "60c72b1a9b1d8c001f8e4a3b",
    "messages": [
      {
        "role": "user",
        "content": "Vue3有什么新特性？"
      },
      {
        "role": "assistant",
        "content": "Vue3引入了Composition API、Teleport和Fragments等新特性。"
      }
    ],
    "createTime": "2023-10-27T10:00:00.000Z",
    "updateTime": "2023-10-27T10:05:00.000Z"
  }
  ```

- **Error Response (404 Not Found)**:

  ```json
  {
    "message": "Session not found"
  }
  ```

---

### 4. 更新会话标题

根据会话 ID 更新会话的标题。

- **URL**: `/api/chat/sessions/:id`
- **Method**: `PUT`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Body**:

  ```json
  {
    "title": "Vue3核心问题"
  }
  ```

- **Success Response (200 OK)**:

  ```json
  {
    "_id": "60c72b2f9b1d8c001f8e4a3c",
    "title": "Vue3核心问题",
    "user": "60c72b1a9b1d8c001f8e4a3b"
    // ...
  }
  ```

---

### 5. 删除会话

根据会话 ID 删除一个会话。

- **URL**: `/api/chat/sessions/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Success Response (200 OK)**:

  ```json
  {
    "message": "Session deleted successfully"
  }
  ```

- **Error Response (404 Not Found)**:

  ```json
  {
    "message": "Session not found"
  }
  ```
