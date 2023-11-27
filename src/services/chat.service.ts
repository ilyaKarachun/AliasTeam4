class ChatService {
  sendMessage(connections: any[], msg: string, prefix?: () => string) {
    Object.values(connections).forEach((conn) => {
      (conn as any).send(`${prefix ? prefix() : ''}${msg}`);
    });
  }
}

const chatService = new ChatService();

export { ChatService, chatService };
