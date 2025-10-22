import { Profile } from '../Entities/Profile.js';

// 使用环境变量配置API基础URL
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  static async list() {
    try {
      console.log("Loading profile from:", `${baseUrl}/profile`);
      const response = await fetch(`${baseUrl}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Profile data loaded:", data);
      return new Profile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  static async update(profileData) {
    try {
      console.log("Updating profile at:", `${baseUrl}/profile`);
      const response = await fetch(`${baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Profile updated successfully:", data);
      return new Profile(data);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  static async create(profileData) {
    try {
      console.log("Creating profile at:", `${baseUrl}/profile`);
      const response = await fetch(`${baseUrl}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Profile created successfully:", data);
      return new Profile(data);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  }

  static async delete() {
    try {
      console.log("Deleting profile at:", `${baseUrl}/profile`);
      const response = await fetch(`${baseUrl}/profile`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("Profile deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  }

  // 健康检查
  static async healthCheck() {
    try {
      const response = await fetch(`${baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
}

export default ApiService;