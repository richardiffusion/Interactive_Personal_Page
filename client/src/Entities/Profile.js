const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SHOW_EDIT_BUTTON = import.meta.env.VITE_SHOW_EDIT_BUTTON === 'true';

export class Profile {
  static async list() {
    try {
      // 开发环境从 localStorage 获取，生产环境从 API 获取
      if (import.meta.env.PROD) {
        // 生产环境：从 API 获取
        console.log('Production: Loading profile from API...');
        const response = await fetch(`${API_BASE_URL}/profile`);
        if (response.ok) {
          const data = await response.json();
          return [data];
        }
        throw new Error('Failed to fetch profile from API');
      } else {
        // 开发环境：从 localStorage 获取
        console.log('Development: Loading profile from localStorage...');
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
          return [JSON.parse(savedProfile)];
        }
        return [];
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // 生产环境 API 失败时，返回空数据结构避免页面崩溃
      if (import.meta.env.PROD) {
        return [{
          full_name: "",
          headline: "",
          bio: "",
          current_role: "",
          current_company: "",
          current_status: "",
          location: "",
          email: "",
          phone: "",
          profile_image_url: "",
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          social_links: {}
        }];
      }
      
      return [];
    }
  }

  static async save(profileData) {
    try {
      if (import.meta.env.PROD) {
        // 生产环境：保存到 API（需要认证）
        console.log('Production: Saving profile to API...');
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: JSON.stringify(profileData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save profile to API');
        }
        
        return await response.json();
      } else {
        // 开发环境：保存到 localStorage
        console.log('Development: Saving profile to localStorage...');
        localStorage.setItem('profile', JSON.stringify(profileData));
        return profileData;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  // 检查是否有编辑权限
  static canEdit() {
    if (import.meta.env.PROD) {
      // 生产环境：检查是否有管理员 token
      return !!localStorage.getItem('admin_token');
    } else {
      // 开发环境：始终可以编辑
      return true;
    }
  }

  // 管理员登录
  static async adminLogin(password) {
    if (import.meta.env.PROD) {
      // 生产环境：调用 API 登录
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('admin_token', token);
        return true;
      }
      return false;
    } else {
      // 开发环境：模拟登录成功
      localStorage.setItem('admin_token', 'dev-token');
      return true;
    }
  }

  // 登出
  static logout() {
    localStorage.removeItem('admin_token');
  }
}