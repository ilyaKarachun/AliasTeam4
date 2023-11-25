import { chatDao } from '../dao/chat.dao';
import { gameDao } from '../dao/game.dao';
import { GameDto } from '../dto/game.dto';
import { UserDto } from '../dto/user.dto';
import { GAME_STATUSES, TEAM_SIZE_LIMIT } from '../helpers/contstants';

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
  async join({
    user_id,
    game_id,
    number,
  }: {
    user_id: string;
    game_id: string;
    number: number;
  }) {
    const teamsStructure = await gameDao.getTeams(game_id);

    console.log(
      'TEAMS',
      teamsStructure,
      user_id,
      teamsStructure?.team1.includes(user_id),
      teamsStructure?.team2.includes(user_id),
    );

    if (
      teamsStructure &&
      (teamsStructure.team1.includes(user_id) ||
        teamsStructure.team2.includes(user_id))
    ) {
      return {
        message: 'User has joined the game earlier.',
      };
    }

    const team1PlayersAmount = teamsStructure?.team1.length;
    const team2PlayersAmount = teamsStructure?.team2.length;

    if (
      team1PlayersAmount !== undefined &&
      number == 1 &&
      team1PlayersAmount < TEAM_SIZE_LIMIT
    ) {
      await gameDao.join({ user_id, game_id, number });
      if (TEAM_SIZE_LIMIT - team1PlayersAmount == 1) {
        return {
          message:
            'User was successfully added to team 1. Now team 1 has full number of players.',
        };
      }
      return { message: 'User was successfully added to team 1.' };
    }
    if (
      team2PlayersAmount !== undefined &&
      number == 2 &&
      team2PlayersAmount < TEAM_SIZE_LIMIT
    ) {
      await gameDao.join({ user_id, game_id, number });
      if (TEAM_SIZE_LIMIT - team2PlayersAmount == 1) {
        return {
          message:
            'User was successfully added to team 2. Now team 2 has full number of players.',
        };
      }
      return { message: 'User was successfully added to team 2.' };
    }

    return { message: `Team ${number} is full. Please, join another team.` };
  }
}

export const gameService = new GameService();
