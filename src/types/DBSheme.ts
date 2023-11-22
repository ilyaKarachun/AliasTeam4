export interface User {
  type: 'user';
  username: string;
  email: string;
  password: string;
  statistic?: string[];
  status?: 'active' | 'not active';
}

export interface Team {
  type: 'team';
  participants: string[];
  chatID?: string;
  words: string[];
  score: {
    word: string;
    status?: 'guessed' | 'not guessed';
    guessed?: string | 'not';
  }[];
}

export interface Game {
  type: 'game';
  status?: 'creating' | 'playing' | 'finished';
  team1: Team;
  team2: Team;
  won?: string;
}

export interface Chat {
  type: 'chat';
  messages: {
    timestamp: string;
    sender: string;
    type: 'description' | 'message';
    content: string;
  }[];
}

export interface Words {
  type: 'words';
  words: string[];
}
