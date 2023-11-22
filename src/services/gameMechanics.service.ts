import { db } from '../database/database';

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
