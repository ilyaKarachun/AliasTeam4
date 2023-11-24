/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
  _id?: string;
  _rev?: string;
  type?: 'user';
  username?: string;
  email?: string;
  password?: string;
  statistic?: string[];
  status?: 'active' | 'not active';
}

export interface Team {
  _id?: string;
  _rev?: string;
  type?: 'team';
  participants?: string[];
  chatID?: string;
  words?: string[];
  score?: {
    word?: string;
    status?: 'guessed' | 'not guessed';
    guessed?: string | 'not';
  }[];
}

export interface Game {
  _id?: string;
  _rev?: string;
  type?: 'game';
  status?: 'creating' | 'playing' | 'finished';
  team1?: Team;
  team2?: Team;
  won?: string;
}

export interface Chat {
  _id?: string;
  _rev?: string;
  type?: 'chat';
  messages?: {
    timestamp?: string;
    sender?: string;
    type?: 'description' | 'message';
    content?: string;
  }[];
}

export interface Words {
  _id?: string;
  _rev?: string;
  type?: 'words';
  words?: string[];
}
