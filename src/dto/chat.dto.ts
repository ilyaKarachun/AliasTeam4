class ChatDto {
  id: string;
  messages?: {
    timestamp: string;
    sender: string;
    type: 'description' | 'message';
    content: string;
  }[];

  constructor({ id, messages }: ChatDto) {
    this.id = id;
    this.messages = messages;
  }
}

export { ChatDto };
