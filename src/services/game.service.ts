import { gameDao } from '../dao/game.dao';
import { userDao } from '../dao/user.dao';
import { GameDto } from '../dto/game.dto';
import { UserDto } from '../dto/user.dto';
import HttpException from '../exceptions/httpException';
import { GAME_STATUSES, LEVELS } from '../helpers/contstants';
import GameProcess from './gameProcess.service';
import { tokenService } from './token.service';

class GameService {
  games: Record<string, GameProcess>;

  constructor() {
    this.games = {};
  }

  async establishGameConnection(userToken: string, gameId: string, conn: any) {
    const tokenData = tokenService.verifyToken(userToken);

    if (!tokenData) {
      throw new HttpException(400, 'Session Does Not Exist');
    }

    const user = tokenData.user;

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
      this.games[gameId] = new GameProcess(gameId);
    }
    const gameProcessInstance = this.games[gameId];
    const userTeam = game.game.team_1.includes(user.id) ? 'team_1' : 'team_2';

    gameProcessInstance.insertMember(userTeam, user.id, conn);
  }

  async create(data: UserDto, name: string, teamSize?: number, level?: string) {
    const userID = data.id;

    const levelInDB: string = level || 'Easy';
    const lowerCaseDifficulty = levelInDB.toLowerCase();

    if (!Object.values(LEVELS).includes(lowerCaseDifficulty)) {
      throw new HttpException(400, 'Invalid difficulty level');
    }

    const teamSizeInDB: number = teamSize || 3;
    if (teamSizeInDB == 1 || teamSizeInDB > 10) {
      throw new HttpException(
        400,
        'Invalid team size (more than 1, less than 10)!',
      );
    }

    const newGame: Omit<GameDto, 'id'> = {
      status: GAME_STATUSES.CREATING,
      name: name,
      team_size: teamSizeInDB,
      team_1: [`${userID}`],
      team_2: [],
      level: levelInDB,
      chat_id: '',
      words: [],
      score: [{ team1: 0, team2: 0 }],
      messageHistory: [],
    };

    const gameMeta = await gameDao.create(newGame);

    await userDao.updateById(userID, { statistic: gameMeta.id });

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
    const teamSize = teamsStructure?.team_size;

    if (
      team1PlayersAmount !== undefined &&
      teamSize !== undefined &&
      number == 1 &&
      team1PlayersAmount < teamSize
    ) {
      await gameDao.join({ user_id, game_id, number });
      await userDao.updateById(user_id, { statistic: game_id });
      if (teamSize - team1PlayersAmount == 1) {
        return {
          message:
            'User was successfully added to team 1. Now team 1 has full number of players.',
        };
      }
      return { message: 'User was successfully added to team 1.' };
    }

    if (
      team2PlayersAmount !== undefined &&
      teamSize !== undefined &&
      number == 2 &&
      team2PlayersAmount < teamSize
    ) {
      await gameDao.join({ user_id, game_id, number });
      await userDao.updateById(user_id, { statistic: game_id });
      if (teamSize - team2PlayersAmount == 1) {
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

  async delete(id: string) {
    return gameDao.delete(id);
  }

  async addMessageToHistory(gameId: string, newMessage: any): Promise<boolean> {
    try {
      const updateResult = await gameDao.updateMessageHistory(
        gameId,
        newMessage,
      );
      return updateResult;
    } catch (error) {
      console.error('addMessageToHistory Service error:', error);
      return false;
    }
  }

  async getRecentMessages(gameId: string, count: number): Promise<any[]> {
    try {
      const recentMessages = await gameDao.getRecentMessages(gameId);
      return recentMessages.slice(-count);
    } catch (error) {
      console.error('Error getting recent messages in GameProcess:', error);
      return [];
    }
  }
}

export const gameService = new GameService();
