import { db } from '../database/database';
import { GameDto } from '../dto/game.dto';

interface GameTeamData {
  _id: string;
  _rev: string;
  team_1: string[];
  team_2: string[];
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
    const req = await db.view<GameDto>('game', 'all');
    if (!req) return [];
    return req.rows.map((game) => new GameDto({ ...game.value, id: game.id }));
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
  ): Promise<{ team1: string[]; team2: string[] } | null> {
    const req = await db.find({
      selector: {
        type: 'game',
        _id: { $eq: id },
      },
    });
    const gameData = req?.docs?.[0] as GameTeamData;

    if (gameData) {
      return {
        team1: gameData.team_1,
        team2: gameData.team_2,
      };
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateGameFields(id: string, fieldsToUpdate: Record<string, any>) {
    try {
      const gameData = await this.getGameById(id);

      if (!gameData) {
        throw new Error('Game not found');
      }

      for (const field in fieldsToUpdate) {
        if (field in fieldsToUpdate) {
          gameData.dto[field] = fieldsToUpdate[field];
        }
      }

      const result = await db.insert({
        ...gameData.dto,
        _rev: gameData._rev,
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
}

const gameDao = new GameDao();
export { GameDao, gameDao };
