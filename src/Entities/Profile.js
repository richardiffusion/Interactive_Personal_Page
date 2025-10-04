export class Profile {
  static async list() {
    try {
      // 检查本地存储
      const savedProfile = localStorage.getItem('profile');
      console.log('Saved profile from localStorage:', savedProfile); // 添加日志
      
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        console.log('Parsed profile data:', profileData); // 添加日志
        return [profileData];
      }
      
      // 如果没有数据，返回空数组
      console.log('No profile found in localStorage'); // 添加日志
      return [];
    } catch (error) {
      console.error('Error loading profile:', error);
      return [];
    }
  }

  static async save(profileData) {
    try {
      console.log('Saving profile:', profileData); // 添加日志
      localStorage.setItem('profile', JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }
}