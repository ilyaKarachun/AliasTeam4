import { ChatService } from './chat.service';
import gameMechanicsService from './gameMechanics.service';
import { gameService } from './game.service';
import { userDao } from '../dao/user.dao';
import { gameDao } from '../dao/game.dao';

const words = ['hi', 'bye', 'car'];

type Round = {
  leadingPlayerId: string | null;
  turn: 'team_1' | 'team_2' | null;
  roundTimeout: any;
  score: number;
  word: string | null;
};

class GameProcess {
  teamConnections: Record<string, any>;
  score: Record<string, any>;
  gameStarted: boolean;
  chatService: ChatService;

  rounds: number;
  currentRound: number;
  roundDuration: number;
  roundData: Round;
  gameId: string;
  messageHistory: Array<{
    timestamp: string;
    sender: string;
    content: string;
  }>;

  constructor(gameId: string) {
    this.gameId = gameId;
    this.rounds = 4;
    this.teamConnections = {
      team_1: {},
      team_2: {},
    };
    this.score = {
      team_1: 0,
      team_2: 0,
    };
    this.gameStarted = false;
    this.chatService = new ChatService();
    this.currentRound = 0;
    this.roundDuration = 120000;
    this.messageHistory = [];

    this.roundData = {
      score: 0,
      roundTimeout: null,
      leadingPlayerId: null,
      turn: null,
      word: null,
    };
  }

  /**
   * handle new player connection to the chat
   */
  insertMember(teamNumber: 'team_1' | 'team_2', userId: string, conn: any) {
    this.teamConnections[teamNumber][userId] = conn;
    this.newPlayerHandler(teamNumber, userId, conn);
  }

  async newPlayerHandler(
    teamNumber: 'team_1' | 'team_2',
    userId: string,
    conn: any,
  ) {
    // welcome message to the player
    conn.send(`Welcome to the game!, You are ${teamNumber} member`);

    gameService
      .getRecentMessages(this.gameId, 10)
      .then((recentMessages) => {
        recentMessages.forEach((message) => {
          conn.send(
            `${message.timestamp} <<${message.sender}>>: ${message.content}`,
          );
        });
      })
      .catch((error) => {
        console.error('Error getting recent messages in GameProcess:', error);
      });

    // notify all players about new member connection
    this.notifyAllMembers(
      `System: user ${userId} was connected to the ${teamNumber}`,
    );
    // disconnect handler
    this.disconnectHandler(userId, conn);
    // check whether we can start game
    if (!this.gameStarted && (await this.isReadyToStart())) {
      await gameDao.updateGameFields(this.gameId, { status: 'playing' });
      this.startGame();
    }
    this.playerMessageHandler(userId, conn);
  }

  /**
   * handle new message event from each player
   */
  playerMessageHandler(userId: string, conn: any) {
    conn.on('message', (msg: string) => {
      if (this.gameStarted && this.roundData.turn) {
        // check whether user is in the team which are playing now
        // another team can not write in the chat while another team turn
        if (
          Object.keys(this.teamConnections[this.roundData.turn]).includes(
            userId,
          )
        ) {
          let validMessage = true;
          let resultValid;
          if (userId === this.roundData.leadingPlayerId) {
            resultValid = gameMechanicsService.rootWordRecognition(
              this.roundData.word || '',
              msg,
            );
            validMessage = !resultValid.wrong;
          }

          if (validMessage) {
            const timestamp = new Date().toLocaleString();
            const message = {
              timestamp: timestamp,
              sender: userId,
              content: msg,
            };
            this.notifyAllMembers(`${timestamp} <<${userId}>>: ${msg}`);
            this.addMessageToHistory(message);
          } else {
            conn.send(`${resultValid.message}: ${resultValid.words}`);
          }

          // check word if author is not leading player
          if (userId !== this.roundData.leadingPlayerId) {
            this.checkWord(msg.trim(), userId);
          }
        } else {
          conn.send('You can not write messages yet!');
        }
      } else {
        conn.send('It is not your turn yet!');
      }
    });
  }

  addMessageToHistory(message: any) {
    this.messageHistory.push(message);
    gameService.addMessageToHistory(this.gameId, message);
  }

  checkWord(message: string, userId: string) {
    if (this.roundData.word) {
      const isGuessed = gameMechanicsService.hiddenWordRecognition(
        this.roundData.word,
        message,
      );

      if (isGuessed) {
        this.guessWordHandler(userId);
      }
    }
  }

  startGame() {
    this.gameStarted = true;
    this.notifyAllMembers(
      'System: All Players Are Here! We are ready to start!',
    );
    this.startRound();
  }

  async getGameInfoFromDB(gameId: string) {
    try {
      const gameInfo = await gameDao.getGameById(gameId);
      return gameInfo;
    } catch (error) {
      console.error('Error while fetching game info from the database:', error);
      return null;
    }
  }

  async startRound() {
    this.currentRound += 1;

    // first or second team
    const teamTurn = `team_${(this.currentRound % 2) + 1}`;
    // get team connections object
    const teamToPlay = this.teamConnections[teamTurn];
    // get all playing team ids
    const teamIdsList = Object.keys(teamToPlay);
    // calculate leading player
    const leadingPlayerIdx =
      Math.floor(this.currentRound / 2) % teamIdsList.length;

    // get game result for gameMechanicsService.randomWord
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameInfo = await this.getGameInfoFromDB(this.gameId);

    if (gameInfo) {
      this.roundData.word = gameMechanicsService.randomWord(
        gameInfo.dto.level,
        gameInfo.dto.words,
      );

      // set new word in gameDB words array
      await gameDao.updateGameFields(this.gameId, {
        words: [...gameInfo.dto.words, this.roundData.word],
      });
    }

    // setup round data
    this.roundData.leadingPlayerId = teamIdsList[leadingPlayerIdx];
    this.roundData.turn = teamTurn as 'team_1' | 'team_2';

    this.notifyAllMembers(
      `ROUND ${this.currentRound}. Score: team_1: ${this.score.team_1} | team_2: ${this.score.team_2}`,
    );
    this.sendWordToLeadingPlayer();
    this.notifyUsersAboutTurn();

    setTimeout(() => this.endRound(), this.roundDuration);
  }

  async makeTurn() {
    if (this.roundData.turn) {
      const gameInfo = await this.getGameInfoFromDB(this.gameId);
      this.roundData.word = gameMechanicsService.randomWord(
        gameInfo!.dto.level,
        gameInfo!.dto.words,
      );
      // set new word in gameDB words array
      await gameDao.updateGameFields(this.gameId, {
        words: [...gameInfo!.dto.words, this.roundData.word],
      });

      this.sendWordToLeadingPlayer();
      this.notifyUsersAboutTurn();
    }
  }

  async endRound() {
    if (this.currentRound < this.rounds) {
      this.score[this.roundData.turn as string] += this.roundData.score;
      this.roundData.score = 0;
      this.startRound();
    } else {
      let winner;
      let winMessage;

      if (this.score.team_1 === this.score.team_2) {
        winner = 'Peace, friendship, chewing gum - dead heat';
        winMessage = `${winner}! You both have ${this.score.team_1} scores!`;
      } else {
        winner = this.score.team_1 > this.score.team_2 ? 'team_1' : 'team_2';
        winMessage = `${winner} win! They have ${this.score[winner]} scores!`;
      }

      await gameDao.updateGameFields(this.gameId, {
        won: winner,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        score: { team_1: this.score.team_1, team_2: this.score.team_2 },
        status: 'finished',
      });

      const gameInfo = await this.getGameInfoFromDB(this.gameId);
      const allTeamMembers = (gameInfo?.dto.team_1 || []).concat(
        gameInfo?.dto.team_2 || [],
      );

      await Promise.all(
        allTeamMembers.map(async (el) => {
          await userDao.updateById(el, { status: 'not active' });
        }),
      );

      this.notifyAllMembers(winMessage);
    }
  }

  guessWordHandler(userId: string) {
    this.roundData.score += 1;
    this.notifyAllMembers(`System: word was guessed by ${userId}!`);
    this.makeTurn();
  }

  /**
   * SEND WORD ONLY TO LEADING PLAYER
   */
  sendWordToLeadingPlayer() {
    if (this.roundData.turn && this.roundData.leadingPlayerId) {
      const leadingPlayerConn =
        this.teamConnections[this.roundData.turn][
          this.roundData.leadingPlayerId
        ];
      leadingPlayerConn.send(`System: Your word: ${this.roundData.word}`);
    }
  }

  /**
   * NOTIFY ALL USERS ABOUT TURN
   */
  notifyUsersAboutTurn() {
    if (this.roundData.turn && this.roundData.leadingPlayerId) {
      const leadingPlayerConn =
        this.teamConnections[this.roundData.turn][
          this.roundData.leadingPlayerId
        ];
      const connections = this.getAllConnections().filter(
        (conn) => conn !== leadingPlayerConn,
      );
      this.chatService.sendMessage(
        connections,
        `System: It is ${this.roundData.turn} turn, User ${this.roundData.leadingPlayerId} received his word!`,
      );
    }
  }

  /**
   * check how many users are in the game
   * @returns number
   */
  async checkTeamSize(gameId: string) {
    const teamData = await gameDao.getTeams(gameId);
    return teamData.team_size * 2;
  }

  /**
   * check whether all users connected to the game chat
   * @returns boolean
   */
  async isReadyToStart() {
    return (
      this.getAllConnections().length ===
      (await this.checkTeamSize(this.gameId))
    );
  }

  /**
   * notify all users that player was
   * disconnected
   */
  disconnectHandler(userId: string, conn: any) {
    conn.on('close', () => {
      this.notifyAllMembers(`System: user ${userId} was disconnected`);
    });
  }

  /**
   * return array of all connections
   */
  getAllConnections() {
    const result: any[] = [];
    Object.values(this.teamConnections).forEach((team) => {
      Object.values(team).forEach((conn) => {
        result.push(conn);
      });
    });
    return result;
  }

  /**
   * send message to all members
   */
  notifyAllMembers(msg: string) {
    const allConnections = this.getAllConnections();
    this.chatService.sendMessage(allConnections, msg);
  }
}

export default GameProcess;
