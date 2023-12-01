const { GameProcess } = require('../services/gameProcess.service');
const { ChatService } = require('../services/chat.service');
const { gameService } = require('../services/game.service');
const { gameMechanicsService } = require('../services/gameMechanics.service')

jest.mock('../services/chat.service');

const gameProcess = new GameProcess('someGameId');

describe('GameProcess', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an instance of GameProcess with initial values', () => {
    expect(gameProcess.rounds).toBe(4);
    expect(gameProcess.rounds).toBe(4);
    expect(gameProcess.teamConnections).toEqual({ team_1: {}, team_2: {} });
    expect(gameProcess.score).toEqual({ team_1: 0, team_2: 0 });
    expect(gameProcess.gameStarted).toBe(false);
    expect(gameProcess.chatService).toBeInstanceOf(ChatService);
    expect(gameProcess.currentRound).toBe(0);
    expect(gameProcess.roundDuration).toBe(120000);
    expect(gameProcess.messageHistory).toEqual([]);

    expect(gameProcess.roundData).toEqual({
      score: 0,
      roundTimeout: null,
      leadingPlayerId: null,
      turn: null,
      word: null,
    });
  });

  it('should handle process of inserting new member in a chat ', async () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    class Connection {}
    const conn = new Connection();

    gameProcess.newPlayerHandler = jest.fn(() => {
      return true;
    });

    gameProcess.teamConnections[teamNumber] = { userId: '' };

    gameProcess.insertMember(teamNumber, userId, conn);
    expect(gameProcess.newPlayerHandler).toHaveBeenCalledWith(
      teamNumber,
      userId,
      conn,
    );
    expect(gameProcess.teamConnections[teamNumber][userId]).toBe(conn);
  });

  // it('should handle new player connection to the chat', async () => {
  //   const teamNumber = 'team_1';
  //   const userId = 'userId';
  //   const conn = { send: jest.fn(), on: jest.fn() };

  //   await gameProcess.newPlayerHandler(teamNumber, userId, conn);

  //   expect(conn.send).toHaveBeenCalled();
  // });

  it('should add message to the history', async () => {
    const message = {
      timestamp: '12.12.12',
      sender: 'userId',
      content: 'Happy message',
    };

    gameService.addMessageToHistory = jest.fn(() => {
      return true;
    });

    await gameProcess.addMessageToHistory(message);

    expect(gameProcess.messageHistory).toEqual([
      {
        timestamp: '12.12.12',
        sender: 'userId',
        content: 'Happy message',
      },
    ]);
    expect(gameService.addMessageToHistory).toBeTruthy();
  });

  it('should check words', async () => {
    const message = 'Happy message';
    const userId = 'userId';
    gameProcess.roundData.word = 'word';

    gameMechanicsService.hiddenWordRecognition = jest.fn(() => {return true;});
    gameProcess.guessWordHandler(userId) = jest.fn(() => {return true;});
    gameProcess.checkWord(message, userId);
    

    expect(gameProcess.roundData.word).not.toBeUndefined();
    expect(isGuessed).toBeTruthy()
    expect( gameProcess.guessWordHandler).toBeTruthy()
  });

});