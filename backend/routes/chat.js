import express from 'express';
import axios from 'axios';

// 20251016 添加调入代码（移动到最上面可以使用）
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// AI API 配置
const AI_CONFIG = {
  deepseek: {
    url: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  },
  openai: {
    url: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
  },
  anthropic: {
    url: process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages',
    key: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
  },
  // 支持所有前端模型
  general: {
    url: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  },
  creative: {
    url: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  },
  technical: {
    url: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  }
};

// 从环境变量读取模型提示词，如果没有则使用默认值
const getModelPrompts = () => {
  // 从环境变量读取
  const envPrompts = {
    deepseek: process.env.DEEPSEEK_PROMPT,
    creative: process.env.CREATIVE_PROMPT,
    technical: process.env.TECHNICAL_PROMPT,
    general: process.env.GENERAL_PROMPT,
  };

  // 默认提示词（当环境变量没有设置时使用）
  const defaultPrompts = {
    deepseek: "You are Richard Li, an AI Project Development Engineer with 8 years of software development experience. Provide thorough, well-reasoned responses with clear logical steps, drawing from your expertise in AI agents, Python, JavaScript, and full-stack development.",
    creative: "You are Richard Li, a creative AI engineer who combines technical expertise with innovative thinking. Be imaginative and expressive in your responses, particularly when discussing AI agent development, project management, or technology solutions.",
    technical: "You are Richard Li, a technical expert specializing in AI agents, Python, JavaScript, React, and Node.js. Provide clear, practical solutions with code examples when relevant, leveraging your 8 years of software development experience.",
    general: "You are Richard Li, a helpful and professional AI engineer with extensive experience in AI project development and management. Provide balanced, informative responses that reflect your background in software engineering and AI technologies.",
  };

  // 合并：如果环境变量有值则使用，否则使用默认值
  const mergedPrompts = {};
  Object.keys(defaultPrompts).forEach(key => {
    mergedPrompts[key] = envPrompts[key] || defaultPrompts[key];
  });

  return mergedPrompts;
};

// 聊天接口
router.post('/', async (req, res) => {
  try {
    
    // 20251016测试代码
    console.log('🔧 收到聊天请求:', req.body);
    console.log('🔧 MOCK_MODE:', process.env.MOCK_MODE);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    
    const { prompt, model: modelType = 'general' } = req.body;
    
    console.log('🔧 请求模型:', modelType);
    console.log('🔧 AI_CONFIG 检查:', {
      general: {
        hasKey: !!AI_CONFIG.general.key,
        key: AI_CONFIG.general.key ? '已设置' : '未设置',
        keyValue: AI_CONFIG.general.key ? AI_CONFIG.general.key.substring(0, 10) + '...' : '空'
      }
    });
    // 测试代码止

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 检查是否启用模拟模式
    const MOCK_MODE = process.env.MOCK_MODE === 'true';
    if (MOCK_MODE) {
      console.log(`🤖 模拟模式: 使用模型 ${modelType} 回复`);
      const mockResponses = {
        general: `这是对"${prompt}"的通用回复。当前使用通用助手模式。`,
        creative: `🎨 创意模式回复 "${prompt}"：让我用富有想象力的方式回答这个问题...`,
        technical: `⚙️ 技术模式回复 "${prompt}"：从技术角度分析，这个问题涉及...`,
        deepseek: `🤔 DeepSeek 深度分析 "${prompt}"：让我用逻辑推理来解答...`
      };
      
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return res.json({ 
        response: mockResponses[modelType] || mockResponses.general,
        model: modelType,
        timestamp: new Date().toISOString(),
        mock: true
      });
    }

    const config = AI_CONFIG[modelType];
    if (!config) {
      return res.status(400).json({ error: `Unsupported model: ${modelType}` });
    }

    // 20251016：修改这部分代码 - 更宽松的检查
    if (!config.key || config.key.includes('your_') || config.key === 'your_deepseek_api_key_here') {
      return res.status(500).json({ 
        error: `API key for ${modelType} is not configured`,
        message: 'Please set MOCK_MODE=true or configure API keys in .env file'
      });
    }

    // 动态获取提示词
    const MODEL_PROMPTS = getModelPrompts();
    const systemPrompt = MODEL_PROMPTS[modelType] || MODEL_PROMPTS.general;
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`;

    console.log(`📝 使用提示词 (${modelType}):`, systemPrompt.substring(0, 100) + '...');

    let response;
    
    if (modelType === 'anthropic') {
      // Anthropic API 格式
      response = await axios.post(config.url, {
        model: config.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: fullPrompt }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.key,
          'anthropic-version': '2023-06-01'
        }
      });
    } else {
      // OpenAI 兼容格式 (DeepSeek, OpenAI)
      response = await axios.post(config.url, {
        model: config.model,
        messages: [{ role: 'user', content: fullPrompt }],
        stream: false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.key}`
        }
      });
    }

    let aiResponse;
    
    if (modelType === 'anthropic') {
      aiResponse = response.data.content[0].text;
    } else {
      aiResponse = response.data.choices[0].message.content;
    }

    res.json({ 
      response: aiResponse,
      model: modelType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error?.message || 'Failed to get response from AI service';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'production' ? undefined : error.response?.data
    });
  }
});


// 20251016修改
// 获取可用模型
router.get('/models', (req, res) => {
  const MOCK_MODE = process.env.MOCK_MODE === 'true';
  
  // 在模拟模式下，所有模型都可用
  const availableModels = MOCK_MODE 
    ? Object.keys(AI_CONFIG)
    : Object.keys(AI_CONFIG).filter(model => 
        AI_CONFIG[model].key && AI_CONFIG[model].key !== 'your_deepseek_api_key_here'
      );
  
  // 获取当前使用的提示词
  const MODEL_PROMPTS = getModelPrompts();
  
  res.json({ 
    models: availableModels,
    prompts: MODEL_PROMPTS,
    mockMode: MOCK_MODE
  });
});

// // 获取可用模型和当前提示词
// router.get('/models', (req, res) => {
//   const availableModels = Object.keys(AI_CONFIG).filter(model => 
//     AI_CONFIG[model].key && AI_CONFIG[model].key !== 'your_api_key_here'
//   );
  
//   // 获取当前使用的提示词
//   const MODEL_PROMPTS = getModelPrompts();
  
//   res.json({ 
//     models: availableModels,
//     prompts: MODEL_PROMPTS
//   });
// });


// 添加环境变量检查
console.log('🔧 环境变量检查:');
console.log('MOCK_MODE:', process.env.MOCK_MODE);
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '已设置' : '未设置');
console.log('NODE_ENV:', process.env.NODE_ENV);



export default router;