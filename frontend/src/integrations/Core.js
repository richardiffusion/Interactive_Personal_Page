// API 基础 URL - 从环境变量读取
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 在您的 integrations/Core.js 中添加流式支持
export const InvokeLLMStream = async ({ prompt, model }) => {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    return response; // 返回原始的response对象供处理
  } catch (error) {
    console.error('Stream API Error:', error);
    throw error;
  }
};



export const InvokeLLM = async ({ prompt, model = 'general' }) => {
  try {
    console.log(`Calling backend API for model: ${model}`);
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model
      })
    });

    // 20251015修改调用log
    console.log('📨 Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Bad Response:', errorText);
      throw new Error(`API Require Fail: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response Success:', data);
    return data.response;

  } catch (error) {
    console.error('🔴 API Config Error:', error);
    throw error;
  }
};
// 修改完毕

// 获取可用模型
export const GetAvailableModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/models`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return { models: ['general'], prompts: {} };
  }
};