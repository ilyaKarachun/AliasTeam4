const DOC_TYPES: Record<string, string> = {
  USER: 'user',
};

const USER_STATUSES: Record<string, string> = {
  ACTIVE: 'active',
  NOT_ACTIVE: 'not active',
};

const GAME_STATUSES: Record<string, string> = {
  CREATING: 'creating',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

const LEVELS: Record<string, string> = {
  SIMPLE: 'simple',
  MIDDLE: 'middle',
  HARD: 'hard',
};

export { DOC_TYPES, USER_STATUSES, GAME_STATUSES, LEVELS };
