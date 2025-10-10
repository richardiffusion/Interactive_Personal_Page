import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 在 ES 模块中获取 __dirname 的等效方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 服务前端静态文件 - 确保路径正确
app.use(express.static(path.join(__dirname, '../dist')));

// 添加一个中间件来移除可能的安全头
app.use((req, res, next) => {
  // 移除可能存在的 CSP 头
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  res.removeHeader('X-WebKit-CSP');
  next();
});

// 简单的认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const validToken = process.env.ADMIN_TOKEN || 'your-secret-admin-token';
  
  if (token === validToken) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// 数据文件路径
const dataFilePath = path.join(__dirname, 'data','profile.json');

// 确保数据目录存在
const ensureDataDirectory = () => {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 健康检查端点 - 新增
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Backend API',
    timestamp: new Date().toISOString(),
    profileFileExists: fs.existsSync(dataFilePath)
  });
});

// API 路由
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

// 管理登录路由
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === adminPassword) {
    const token = process.env.ADMIN_TOKEN || 'your-secret-admin-token';
    console.log('POST /api/admin/login - Success');
    res.json({ token });
  } else {
    console.log('POST /api/admin/login - Invalid password');
    res.status(401).json({ error: 'Invalid password' });
  }
});

// 处理 SPA 路由 - 所有非API请求返回前端
app.get('*', (req, res) => {
  // 只有非API请求才返回前端HTML
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // 对于未定义的API路由返回404
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Full-stack server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Profile API: http://localhost:${PORT}/api/profile`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/`);
  console.log(`🌐 Public Access: http://YOUR_PUBLIC_IP:${PORT}/`);
});

export default app;