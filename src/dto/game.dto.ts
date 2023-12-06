class GameDto {
  id: string;
  status: string;
  name: string;
  team_size: number;
  team_1: string[];
  team_2: string[];
  level: string;
  chat_id: string;
  words: string[];
  score: [{ team1: number; team2: number }];
  won?: string;
  messageHistory: {
    timestamp: string;
    sender: string;
    content: string;
  }[];

  constructor({
    id,
    status,
    name,
    team_size,
    team_1,
    team_2,
    level,
    chat_id = '',
    words,
    score,
    won,
    messageHistory = [],
  }: GameDto) {
    this.id = id;
    this.status = status;
    this.name = name;
    this.team_size = team_size;
    this.team_1 = team_1;
    this.team_2 = team_2;
    this.level = level;
    this.chat_id = chat_id;
    this.words = words;
    this.score = score;
    this.won = won;
    this.messageHistory = messageHistory;
  }
}

export { GameDto };
