

export class User {
  static async me() {
    // Current logged-in user info
    return {
      id: 1,
      name: 'Current User',
      email: 'user@example.com'
    };
  }
}