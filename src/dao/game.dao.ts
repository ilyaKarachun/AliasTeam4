import { db } from '../database/database';
import { GameDto } from '../dto/game.dto';

interface GameTeamData {
  _id: string;
  _rev: string;
  team_size: number;
  team_1: string[];
  team_2: string[];
}

interface GameHistoryData {
  _id: string;
  _rev: string;
  type: 'game';
  messageHistory: any[];
}

class GameDao {
  async create(data: object) {
    const result = db.insert({
      ...data,
      type: 'game',
    } as any);
    return result;
  }
  async getAll() {
    const req = await db.find({
      selector: {
        type: 'game',
      },
    });
    if (!req) return [];

    return req.docs.map(
      // @ts-expect-error
      (game) => new GameDto({ ...game, id: game._id }),
    );
  }
  async join({
    user_id,
    game_id,
    number,
  }: {
    user_id: string;
    game_id: string;
    number: number;
  }) {
    const req = await db.find({
      selector: {
        type: 'game',
        _id: { $eq: game_id },
      },
    });
    const gameData = req?.docs?.[0] as GameTeamData;
    const teamToUpdate = number == 1 ? 'team_1' : 'team_2';

    const updatedGame = { ...gameData };
    if (!gameData) {
      return null;
    }

    updatedGame[teamToUpdate].push(user_id);

    const result = await db.insert({
      ...updatedGame,
    });
    return result.ok;
  }

  async getGameById(
    id: string,
  ): Promise<{ dto: GameDto; _rev: string } | null> {
    const req = await db.find({
      selector: {
        type: 'game',
        _id: { $eq: id },
      },
    });
    const gameData = req?.docs?.[0];

    if (gameData) {
      return {
        // @ts-expect-error
        dto: new GameDto({ ...gameData, id: gameData._id }),
        _rev: gameData._rev,
      };
    }
    return null;
  }

  async getTeams(
    id: string,
  ): Promise<{ team_size: number; team1: string[]; team2: string[] }> {
    const req = await db.find({
      selector: {
        type: 'game',
        _id: { $eq: id },
      },
    });
    const gameData = req?.docs?.[0] as GameTeamData;

    return {
      team_size: gameData.team_size,
      team1: gameData.team_1,
      team2: gameData.team_2,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateGameFields(id: string, fieldsToUpdate: Record<string, any>) {
    try {
      const req = await db.find({
        selector: {
          type: 'game',
          _id: { $eq: id },
        },
      });

      const gameData = req?.docs?.[0];

      if (!gameData) {
        throw new Error('Game not found');
      }
      let updatedGame = { ...gameData };
      for (const field in fieldsToUpdate) {
        updatedGame[field] = fieldsToUpdate[field];
      }

      const result = await db.insert({
        ...updatedGame,
      });

      if (result.ok) {
        return true;
      } else {
        throw new Error('Error updating game fields');
      }
    } catch (error) {
      console.error('Error updating game fields:', error);
      return false;
    }
  }

  async updateMessageHistory(
    game_id: string,
    newMessage: any,
  ): Promise<boolean> {
    try {
      const findResult = await db.find({
        selector: {
          type: 'game',
          _id: { $eq: game_id },
        },
      });

      const gameData = findResult?.docs?.[0] as GameHistoryData;

      if (!gameData) {
        return false;
      }
      gameData.messageHistory = gameData.messageHistory || [];
      gameData.messageHistory.push(newMessage);

      const insertResult = await db.insert(gameData, game_id);

      if (insertResult.ok) {
        return true;
      } else {
        console.error('Failed to update document:', insertResult);
        return false;
      }
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  }

  async getRecentMessages(gameId: string): Promise<any[]> {
    try {
      const findResult = await db.find({
        selector: {
          type: 'game',
          _id: { $eq: gameId },
        },
      });

      const gameData = findResult?.docs?.[0] as GameHistoryData;

      if (!gameData || !gameData.messageHistory) {
        return [];
      }

      const recentMessages = gameData.messageHistory;

      return recentMessages;
    } catch (error) {
      console.error('Error getting recent messages:', error);
      return [];
    }
  }
  async delete(id: string) {
    const game = await this.getGameById(id);
    if (game) {
      await db.destroy(game.dto.id, game._rev);
    }

    return;
  }
}

const gameDao = new GameDao();
export { GameDao, gameDao };
