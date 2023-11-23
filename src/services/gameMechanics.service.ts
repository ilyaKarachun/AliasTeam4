/* eslint-disable @typescript-eslint/naming-convention */
import { db } from '../database/database';
import { Team } from '../types/DBSheme';

class gameMechanicsService {
  async getWords() {
    const result = await db.find({
      selector: {
        type: 'words',
      },
    });
    const words = result.docs;
    return words;
  }
  async getTeamCurrentWord(id: string) {
    const result: Team = await db.find({
      selector: {
        type: 'team',
        _id: id,
      },
    });
    const turnCount = result.score.length;
    const currWord = result.words[turnCount];
    return currWord;
  }
}

export default gameMechanicsService;
