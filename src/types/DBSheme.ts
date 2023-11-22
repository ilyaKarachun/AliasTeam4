export interface User {
  username: string;
  email: string;
  password: string;
  statistic?: string[];
  status?: 'active' | 'not active';
}

export interface Team {
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
  status?: 'creating' | 'playing' | 'finished';
  team1: Team;
  team2: Team;
  won?: string;
}

export interface Chat {
  messages: {
    timestamp: string;
    sender: string;
    type: 'description' | 'message';
    content: string;
  }[];
}

export interface Words {
  words: string[];
}
