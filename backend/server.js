import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 在 ES 模块中获取 __dirname 的等效方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 静态文件目录路径 - 统一使用 dist 目录
const frontendDistPath = path.join(__dirname, '../frontend/dist');

// 静态文件服务
console.log('静态文件目录:', frontendDistPath);
app.use(express.static(frontendDistPath));

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use('/api/', limiter);


// 数据文件路径 (Portfolio 功能)
const dataFilePath = path.join(__dirname, 'data', 'profile.json');

// 确保数据目录存在
const ensureDataDirectory = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 简单的认证中间件 (Portfolio 功能)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const validToken = process.env.ADMIN_TOKEN || 'your-secret-admin-token';
  
  if (token === validToken) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// ========== API 路由 ==========

// 导入路由
import chatRouter from './routes/chat.js';

// AI Chatbox 路由
app.use('/api/chat', chatRouter);

// Portfolio 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Full-stack Backend API',
    timestamp: new Date().toISOString(),
    profileFileExists: fs.existsSync(dataFilePath),
    environment: process.env.NODE_ENV || 'development'
  });
});

// AI Chatbox 健康检查端点 (保持兼容性)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Portfolio API 路由
app.get('/api/profile', (req, res) => {
  try {
    ensureDataDirectory();
    
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      console.log('GET /api/profile - Success, data length:', data.length);
      res.json(JSON.parse(data));
    } else {
      console.log('GET /api/profile - File not found, returning default data');
      // 返回默认数据
      res.json({
        full_name: "Your Name",
        headline: "Your Professional Headline",
        bio: "Your bio goes here...",
        current_role: "",
        current_company: "",
        current_status: "Currently employed",
        location: "",
        email: "",
        phone: "",
        profile_image_url: "",
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        social_links: {}
      });
    }
  } catch (error) {
    console.error('Error reading profile:', error);
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

app.put('/api/profile', authenticate, (req, res) => {
  try {
    ensureDataDirectory();
    
    const profileData = req.body;
    fs.writeFileSync(dataFilePath, JSON.stringify(profileData, null, 2));
    console.log('PUT /api/profile - Success');
    
    res.json(profileData);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// 管理登录路由 (Portfolio 功能)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (password === adminPassword) {
    const token = process.env.ADMIN_TOKEN || 'your-secret-admin-token';
    console.log('POST /api/admin/login - Success');
    res.json({ token });
  } else {
    console.log('POST /api/admin/login - Invalid password');
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ========== 统一的路由处理 ==========

// SPA 路由处理 - 所有非API请求返回前端
app.get('*', (req, res) => {
  // 排除 API 路由
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // 如果请求的是文件路径（包含扩展名），让静态文件中间件处理
  if (req.path.includes('.') && !req.path.endsWith('/')) {
    return res.status(404).send('Not found');
  }
  
  // 否则返回前端应用
  console.log(`📄 发送 index.html 对于路径: ${req.path}`);
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});


// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 统一后端服务器运行在端口 ${PORT}`);
  console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🔗 兼容性健康检查: http://localhost:${PORT}/health`);
  console.log(`👤 Portfolio API: http://localhost:${PORT}/api/profile`);
  console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🌐 前端: http://localhost:${PORT}/`);
  console.log(`📁 静态文件目录: ${frontendDistPath}`);
});

export default app;