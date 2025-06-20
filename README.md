# AI 聊天接口

## 环境变量

请在启动服务前设置讯飞星火大模型的 API 密钥：

```
export SPARK_API_KEY=你的讯飞API密钥
```

## API 文档

### POST /api/chat

- 请求体：
  - content (string): 用户输入的消息内容

- 响应体：
  - content (string): AI 回复的内容
  - error (string, 可选): 错误信息

#### 示例

请求：
```
POST /api/chat
Content-Type: application/json
{
  "content": "你好，AI"
}
```

响应：
```
{
  "content": "你好，有什么可以帮您？"
}
```

如遇错误：
```
{
  "error": "内容不能为空"
}
``` 