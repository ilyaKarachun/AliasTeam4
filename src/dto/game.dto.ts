class GameDto {
  id: string;
  status: string;
  team_size: number;
  team_1: string[];
  team_2: string[];
  level: string;
  chat_id: string;
  words: string[];
  score: [{ team1: number; team2: number }];
  won?: string;

  constructor({
    id,
    status,
    team_size,
    team_1,
    team_2,
    level,
    chat_id = '',
    words,
    score,
    won,
  }: GameDto) {
    this.id = id;
    this.status = status;
    this.team_size = team_size;
    this.team_1 = team_1;
    this.team_2 = team_2;
    this.level = level;
    this.chat_id = chat_id;
    this.words = words;
    this.score = score;
    this.won = won;
  }
}

export { GameDto };
