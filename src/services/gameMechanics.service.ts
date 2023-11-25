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
}

export default gameMechanicsService;
