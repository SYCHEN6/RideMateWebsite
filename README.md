# RideMateWebsite - 智能骑行社交平台前端

## 项目概述

**RideMate** 是一个面向骑行爱好者的智能社交平台，提供路线推荐、伙伴匹配、知识问答等服务。本项目是RideMate的前端部分，基于React 18开发，采用响应式设计，支持各种分辨率和设备。

## 技术栈

- **前端框架**：React 18
- **路由**：React Router DOM 6
- **HTTP客户端**：Axios
- **UI组件库**：Ant Design 5
- **样式**：Styled Components
- **构建工具**：Vite 5
- **开发语言**：JavaScript/JSX

## 功能模块

### 核心功能

#### 1. 骑行知识库
- 知识分类浏览
- 智能问答界面
- 文档搜索功能
- 支持图文混排的知识详情

#### 2. 路线管理
- 路线列表展示
- 路线搜索与筛选
- 路线详情查看
- 路线分享功能

#### 3. 用户系统
- 匿名使用支持
- 用户信息管理
- 个人偏好设置

### 计划功能

#### 4. AI路线优化
- 路线推荐界面
- 路线优化参数设置
- 优化结果可视化

#### 5. 骑行搭子匹配
- 匹配条件设置
- 匹配结果展示
- 搭子联系功能

## 项目结构

```
RideMateWebsite/
├── src/
│   ├── components/          # 通用组件
│   ├── hooks/              # 自定义Hooks
│   ├── pages/              # 页面组件
│   │   ├── Home/           # 首页
│   │   ├── Knowledge/      # 知识库
│   │   ├── Routes/         # 路线
│   │   └── User/           # 用户
│   ├── services/           # API服务
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   ├── App.jsx             # 应用主组件
│   └── main.jsx            # 应用入口
├── public/                 # 静态资源
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
└── README.md               # 项目说明
```

## 环境要求

- Node.js 18+
- npm 9+

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/SYCHEN6/RideMateWebsite.git
cd RideMateWebsite
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置API地址

修改`src/services/api.js`文件，配置后端API地址：

```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
```

### 4. 启动开发服务器

```bash
npm run dev
```

开发服务器将在`http://localhost:5173`启动。

## 开发指南

### 代码规范

- 使用函数组件和Hooks
- 遵循React最佳实践
- 组件命名采用PascalCase
- 支持响应式设计，适配不同屏幕尺寸

### 页面开发

1. 在`src/pages`目录下创建新的页面组件
2. 在`src/App.jsx`中配置路由
3. 使用Ant Design组件构建UI
4. 通过`src/services`调用后端API

### 样式开发

- 使用Styled Components进行组件样式设计
- 全局样式定义在`src/styles/global.css`
- 主题配置在`src/styles/theme.js`

## 构建与部署

### 构建生产版本

```bash
npm run build
```

构建产物将生成在`dist`目录中。

### 预览生产版本

```bash
npm run preview
```

### 部署

将`dist`目录中的文件部署到Nginx或其他静态文件服务器。

示例Nginx配置：

```nginx
server {
    listen 80;
    server_name example.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 测试

### 单元测试

```bash
npm run test
```

### 代码检查

```bash
npm run lint
```

## 许可证

[MIT License](LICENSE)
