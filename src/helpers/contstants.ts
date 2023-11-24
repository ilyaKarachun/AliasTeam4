import * as path from 'path';

const DOC_TYPES: Record<string, string> = {
  USER: 'user',
};

const USER_STATUSES: Record<string, string> = {
  ACTIVE: 'active',
  NOT_ACTIVE: 'not active',
};

const WORDS_PATH = path.join(__dirname, '../../public/words.xlsx');

export { DOC_TYPES, USER_STATUSES, WORDS_PATH };
