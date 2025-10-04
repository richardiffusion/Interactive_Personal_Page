

export class User {
  static async me() {
    // 模拟获取当前用户信息
    return {
      id: 1,
      name: 'Current User',
      email: 'user@example.com'
    };
  }
}