import { chatDao } from '../dao/chat.dao';
import { gameDao } from '../dao/game.dao';
import { GameDto } from '../dto/game.dto';
import { UserDto } from '../dto/user.dto';
import { GAME_STATUSES } from '../helpers/contstants';

class GameService {
  async create(data: UserDto) {
    const userID = data.id;

    const newGame: Omit<GameDto, 'id'> = {
      status: GAME_STATUSES.CREATING,
      team_1: [`${userID}`],
      team_2: [],
      level: '',
      chat_id: '',
      words: [],
      score: [{ team1: 0, team2: 0 }],
    };

    const gameMeta = await gameDao.create(newGame);

    return { gameID: gameMeta.id };
  }
  async getAll() {
    return gameDao.getAll();
  }
  // async join({
  //   user_id,
  //   game_id,
  //   number,
  // }: {
  //   user_id: string;
  //   game_id: string;
  //   number: number;
  // }) {
  //   await gameDao.join({ user_id, game_id, number });
  //   return;
  // }
}

export const gameService = new GameService();
