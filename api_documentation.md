# 备忘录应用 API 接口文档

## 基础信息

- **基础 URL**: `https://xubapwweknjk.sealosbja.site/api`
- **数据格式**: JSON
- **认证方式**: JWT Token (通过 Authorization 请求头传递)

## 1. 用户认证接口

### 1.1 用户注册

- **请求方法**: `POST`
- **接口路径**: `/user/register`
- **请求参数**:

```json
{
  "username": "用户名",
  "password": "用户密码",
  "confirmPassword": "确认密码"
}
```

- **成功响应** (状态码: 201):

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "60d21b4667d0d8992e610c85",
    "username": "用户名"
  }
}
```

- **失败响应**:

```json
// 参数错误 (状态码: 400)
{
  "code": 400,
  "message": "两次输入的密码不一致",
  "data": null
}

// 用户名已存在 (状态码: 400)
{
  "code": 400,
  "message": "用户名已存在",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

### 1.2 用户登录

- **请求方法**: `POST`
- **接口路径**: `/user/login`
- **请求参数**:

```json
{
  "username": "用户名/手机号",
  "password": "用户密码",
  "remember": true // 是否记住登录状态
}
```

- **成功响应** (状态码: 200):

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "60d21b4667d0d8992e610c85",
    "username": "用户名"
  }
}
```

- **失败响应**:

```json
// 登录失败 (状态码: 401)
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 2. 备忘录接口

> **注意**: 所有备忘录接口都需要在请求头中包含 JWT Token
>
> ```
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> ```

### 2.1 获取备忘录列表

- **请求方法**: `GET`
- **接口路径**: `/memo/list`
- **请求参数** (Query 参数):
  - `page`: 页码，从1开始 (默认: 1)
  - `pageSize`: 每页条数 (默认: 10)

- **成功响应** (状态码: 200):

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 28,
    "list": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "title": "备忘录标题",
        "content": "备忘录内容摘要...",
        "createTime": "2023-05-20T12:30:45.000Z",
        "updateTime": "2023-05-21T09:15:22.000Z"
      },
      // 更多备忘录...
    ]
  }
}
```

- **失败响应**:

```json
// 未授权 (状态码: 401)
{
  "code": 401,
  "message": "Not authorized, token failed",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

### 2.2 获取备忘录详情

- **请求方法**: `GET`
- **接口路径**: `/memo/detail/:id`
- **路径参数**:
  - `id`: 备忘录 ID

- **成功响应** (状态码: 200):

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "备忘录标题",
    "content": "备忘录完整内容...",
    "createTime": "2023-05-20T12:30:45.000Z",
    "updateTime": "2023-05-21T09:15:22.000Z"
  }
}
```

- **失败响应**:

```json
// 备忘录不存在 (状态码: 404)
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}

// 没有权限 (状态码: 403)
{
  "code": 403,
  "message": "没有权限访问此备忘录",
  "data": null
}

// 未授权 (状态码: 401)
{
  "code": 401,
  "message": "Not authorized, token failed",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

### 2.3 创建备忘录

- **请求方法**: `POST`
- **接口路径**: `/memo/create`
- **请求参数**:

```json
{
  "title": "新备忘录标题",
  "content": "新备忘录内容"
}
```

- **成功响应** (状态码: 201):

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "新备忘录标题",
    "content": "新备忘录内容",
    "createTime": "2023-05-22T15:30:00.000Z",
    "updateTime": "2023-05-22T15:30:00.000Z"
  }
}
```

- **失败响应**:

```json
// 参数错误 (状态码: 400)
{
  "code": 400,
  "message": "标题和内容不能为空",
  "data": null
}

// 未授权 (状态码: 401)
{
  "code": 401,
  "message": "Not authorized, token failed",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

### 2.4 更新备忘录

- **请求方法**: `PUT`
- **接口路径**: `/memo/update/:id`
- **路径参数**:
  - `id`: 备忘录 ID
- **请求参数**:

```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

- **成功响应** (状态码: 200):

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "更新后的标题",
    "content": "更新后的内容",
    "createTime": "2023-05-20T12:30:45.000Z",
    "updateTime": "2023-05-22T16:45:30.000Z"
  }
}
```

- **失败响应**:

```json
// 参数错误 (状态码: 400)
{
  "code": 400,
  "message": "标题和内容不能为空",
  "data": null
}

// 备忘录不存在 (状态码: 404)
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}

// 没有权限 (状态码: 403)
{
  "code": 403,
  "message": "没有权限修改此备忘录",
  "data": null
}

// 未授权 (状态码: 401)
{
  "code": 401,
  "message": "Not authorized, token failed",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

### 2.5 删除备忘录

- **请求方法**: `DELETE`
- **接口路径**: `/memo/delete/:id`
- **路径参数**:
  - `id`: 备忘录 ID

- **成功响应** (状态码: 200):

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

- **失败响应**:

```json
// 备忘录不存在 (状态码: 404)
{
  "code": 404,
  "message": "备忘录不存在",
  "data": null
}

// 没有权限 (状态码: 403)
{
  "code": 403,
  "message": "没有权限删除此备忘录",
  "data": null
}

// 未授权 (状态码: 401)
{
  "code": 401,
  "message": "Not authorized, token failed",
  "data": null
}

// 服务器错误 (状态码: 500)
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 3. 错误码说明

| 错误码 | 描述               |
| ------ | ------------------ |
| 200    | 成功               |
| 400    | 请求参数错误       |
| 401    | 未授权或登录已过期 |
| 403    | 权限不足           |
| 404    | 资源不存在         |
| 500    | 服务器内部错误     |

## 4. 前端调用示例

### 登录示例

```javascript
// 前端调用示例
const loginUser = async (username, password, remember) => {
  try {
    const response = await fetch('https://xubapwweknjk.sealosbja.site/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        remember,
      }),
    });

    const result = await response.json();
    if (result.code === 200) {
      // 登录成功，存储token
      localStorage.setItem('token', result.data.token);
      return result.data;
    } else {
      // 处理错误
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};
```

### 获取备忘录列表示例

```javascript
// 前端调用示例
const getMemoList = async (page = 1, pageSize = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `https://xubapwweknjk.sealosbja.site/api/memo/list?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('获取备忘录列表失败:', error);
    throw error;
  }
};
```

### 创建备忘录示例

```javascript
// 前端调用示例
const createMemo = async (title, content) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://xubapwweknjk.sealosbja.site/api/memo/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    const result = await response.json();
    if (result.code === 200) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('创建备忘录失败:', error);
    throw error;
  }
};
``` 