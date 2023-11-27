import { ChatService } from './chat.service';
import { GAME_PLAYERS_LIMIT } from '../helpers/contstants';
import { GameDao } from '../dao/game.dao';
import gameMechanicsService from './gameMechanics.service';

const gameDAO = new GameDao();

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

  constructor() {
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

  newPlayerHandler(teamNumber: 'team_1' | 'team_2', userId: string, conn: any) {
    // welcome message to the player
    conn.send(`Welcome to the game!, You are ${teamNumber} member`);
    // notify all players about new member connection
    this.notifyAllMembers(
      `System: user ${userId} was connected to the ${teamNumber}`,
    );
    // disconnect handler
    this.disconnectHandler(userId, conn);
    // check whether we can start game
    if (!this.gameStarted && this.isReadyToStart()) {
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
          this.notifyAllMembers(`<<${userId}>>: ${msg}`);

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

  checkWord(word: string, userId: string) {
    if (this.roundData.word === word) {
      this.guessWordHandler(userId);
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
      const gameInfo = await gameDAO.getGameById(gameId);
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
    // get game result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameInfo: any = await this.getGameInfoFromDB(gameId);

    this.roundData.word = gameMechanicsService.randomWord(
      gameInfo.level,
      gameInfo.words,
    );
    // setup round data
    this.roundData.leadingPlayerId = teamIdsList[leadingPlayerIdx];
    this.roundData.turn = teamTurn as 'team_1' | 'team_2';
    this.roundData.word = words[Math.floor(Math.random() * words.length)];

    // set new word in gameDB words array
    const sendNewWordInDB = await this.notifyAllMembers(
      `ROUND ${this.currentRound}. Score: team_1: ${this.score.team_1} | team_2: ${this.score.team_2}`,
    );
    this.sendWordToLeadingPlayer();
    this.notifyUsersAboutTurn();

    setTimeout(() => this.endRound(), this.roundDuration);
  }

  makeTurn() {
    if (this.roundData.turn) {
      const teamToPlay = this.teamConnections[this.roundData.turn];
      const teamIdsList = Object.keys(teamToPlay);
      this.roundData.word = words[Math.floor(Math.random() * words.length)];

      this.sendWordToLeadingPlayer();
      this.notifyUsersAboutTurn();
    }
  }

  endRound() {
    if (this.currentRound < this.rounds) {
      this.score[this.roundData.turn as string] += this.roundData.score;
      this.roundData.score = 0;
      this.startRound();
    } else {
      const winner =
        this.score.team_1 > this.score.team_2 ? 'team_1' : 'team_2';
      this.notifyAllMembers(
        `${winner} win! They have ${this.score[winner]} scores!`,
      );
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
   * check whether all users connected to the game chat
   * @returns boolean
   */
  isReadyToStart() {
    return this.getAllConnections().length === GAME_PLAYERS_LIMIT;
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
