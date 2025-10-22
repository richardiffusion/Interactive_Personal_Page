export function createPageUrl(page) {
  // 简单的路由映射
  const routes = {
    'editprofile': '/edit-profile',
    'portfolio': '/'
  };
  
  return routes[page.toLowerCase()] || `/${page.toLowerCase()}`;
}

// 其他工具函数可以在这里添加
export const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};