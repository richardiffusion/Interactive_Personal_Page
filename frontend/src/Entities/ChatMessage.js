export class ChatMessage {
  static async create(messageData) {
    // Save message to localStorage
    const message = {
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      ...messageData
    }
    
    const existingMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    existingMessages.push(message)
    localStorage.setItem('chatMessages', JSON.stringify(existingMessages))
    
    return message
  }

  static async filter(filters = {}, sortBy = 'created_date', limit = 100) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]')

    // Apply filters
    if (filters.conversation_id) {
      messages = messages.filter(msg => msg.conversation_id === filters.conversation_id)
    }

    // Sort
    messages.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]))

    // Limit results
    return messages.slice(0, limit)
  }
}