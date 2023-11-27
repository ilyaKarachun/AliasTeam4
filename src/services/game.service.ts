import { chatDao } from '../dao/chat.dao';
import { gameDao } from '../dao/game.dao';
import { GameDto } from '../dto/game.dto';
import { UserDto } from '../dto/user.dto';
import HttpException from '../exceptions/httpException';
import { GAME_STATUSES, TEAM_SIZE_LIMIT } from '../helpers/contstants';
import GameProcess from './gameProcess.service';

class GameService {
  games: Record<string, GameProcess>;

  constructor() {
    this.games = {};
  }

  async establishGameConnection(user: UserDto, gameId: string, conn: any) {
    if (!user) {
      throw new HttpException(400, 'User Does Not Exist!');
    }

    // check whether game exists
    const game = await this.getGameById(gameId);
    if (!game.game) {
      throw new HttpException(400, 'Game Does Not Exist!');
    }

    // check whether user in this game
    if (
      !game.game.team_1.includes(user.id) &&
      !game.game.team_2.includes(user.id)
    ) {
      throw new HttpException(
        400,
        'You can not join this chat because you are not playing this game!',
      );
    }

    // check whether games was finished
    if (game.game.status === GAME_STATUSES.FINISHED) {
      throw new HttpException(400, 'Game Was Finished!');
    }

    if (!(gameId in this.games)) {
      this.games[gameId] = new GameProcess();
    }
    const gameProcessInstance = this.games[gameId];
    const userTeam = game.game.team_1.includes(user.id) ? 'team_1' : 'team_2';

    gameProcessInstance.insertMember(userTeam, user.id, conn);
  }

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

    // user already connected to the one of the teams within this game
    if (
      teamsStructure &&
      (teamsStructure.team1.includes(user_id) ||
        teamsStructure.team2.includes(user_id))
    ) {
      throw new HttpException(400, 'User Has Joined To The Game Earlier!');
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

  async getGameById(id: string) {
    const result = await gameDao.getGameById(id);
    return { game: result?.dto, _rev: result?._rev };
  }
}

export const gameService = new GameService();
