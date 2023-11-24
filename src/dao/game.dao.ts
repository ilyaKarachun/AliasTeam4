import { db } from '../database/database';
import { GameDto } from '../dto/game.dto';

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
  // async joinTeam({
  //   user_id,
  //   game_id,
  //   number,
  // }: {
  //   user_id: string;
  //   game_id: string;
  //   number: number;
  // }) {}
}

const gameDao = new GameDao();
export { GameDao, gameDao };
