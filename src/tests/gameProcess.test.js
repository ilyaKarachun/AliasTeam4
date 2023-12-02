const { GameProcess } = require('../services/gameProcess.service');
const { ChatService } = require('../services/chat.service');
const { gameService } = require('../services/game.service');
const { gameMechanicsService } = require('../services/gameMechanics.service');
const { gameDao } = require('../dao/game.dao');

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

  it('should return all connections from teamConnections', () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    const conn1 = { send: jest.fn(), on: jest.fn() };
    const conn2 = { send: jest.fn(), on: jest.fn() };

    gameProcess.teamConnections[teamNumber] = {
      [userId + '1']: conn1,
      [userId + '2']: conn2,
    };

    const connections = gameProcess.getAllConnections();

    expect(connections).toContain(conn1);
    expect(connections).toContain(conn2);
    expect(connections.length).toBe(2);
  });

  it('should notify all members with the given message', () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    const conn1 = { send: jest.fn(), on: jest.fn() };
    const conn2 = { send: jest.fn(), on: jest.fn() };

    gameProcess.teamConnections[teamNumber] = {
      [userId + '1']: conn1,
      [userId + '2']: conn2,
    };
    gameProcess.chatService = { sendMessage: jest.fn() };
    const message = 'Hello, everyone!';
    gameProcess.notifyAllMembers(message);

    expect(gameProcess.chatService.sendMessage).toHaveBeenCalledWith(
      [conn1, conn2],
      message,
    );
  });

  it('should notify all members when a user is disconnected', () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    const conn = { send: jest.fn(), on: jest.fn() };

    gameProcess.teamConnections[teamNumber] = {
      [userId]: conn,
    };
    gameProcess.notifyAllMembers = jest.fn((mes) => {
      return mes;
    });
    gameProcess.disconnectHandler(userId, conn);

    conn.on.mock.calls[0][1]();

    expect(gameProcess.notifyAllMembers).toHaveBeenCalledWith(
      `System: user ${userId} was disconnected`,
    );
  });

  it('should add message to the history', async () => {
    const message = {
      timestamp: '12.12.12',
      sender: 'userId',
      content: 'Happy message',
    };

    gameService.addMessageToHistory = jest.fn(() => {
      return true;
    });

    gameProcess.addMessageToHistory(message);

    expect(gameProcess.messageHistory).toEqual([
      {
        timestamp: '12.12.12',
        sender: 'userId',
        content: 'Happy message',
      },
    ]);
    expect(gameService.addMessageToHistory).toBeTruthy();
  });

  it('should handle player messages during the game round', () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    const conn = { send: jest.fn(), on: jest.fn() };
    const message = 'Test message';

    gameProcess.teamConnections[teamNumber] = {
      [userId]: conn,
    };

    gameProcess.gameStarted = true;
    gameProcess.roundData.turn = teamNumber;
    gameProcess.roundData.leadingPlayerId = 'otherPlayerId';
    gameProcess.checkWord = jest.fn();
    gameProcess.addMessageToHistory = jest.fn();

    gameProcess.playerMessageHandler(userId, conn);

    conn.on.mock.calls[0][1](message);
    expect(gameProcess.notifyAllMembers).toHaveBeenCalledWith(
      expect.stringContaining(message),
    );
    expect(gameProcess.addMessageToHistory).toHaveBeenCalled();
    expect(gameProcess.checkWord).toHaveBeenCalled();
  });

  it('should handle new player connection', async () => {
    const teamNumber = 'team_1';
    const userId = 'userId';
    const conn = { send: jest.fn(), on: jest.fn() };

    gameProcess.isReadyToStart = jest.fn(() => Promise.resolve(true));
    gameDao.updateGameFields = jest.fn(() => Promise.resolve());
    gameProcess.startGame = jest.fn();
    gameProcess.notifyAllMembers = jest.fn();
    gameProcess.disconnectHandler = jest.fn((a, b) => {
      return true;
    });
    gameService.getRecentMessages = jest.fn(() =>
      Promise.resolve([
        {
          timestamp: '12.12.12',
          sender: 'otherUserId',
          content: 'Other message',
        },
      ]),
    );
    gameProcess.playerMessageHandler = jest.fn(() => {
      return true;
    });
    await gameProcess.newPlayerHandler(teamNumber, userId, conn);

    expect(conn.send).toHaveBeenCalledWith(
      `Welcome to the game!, You are ${teamNumber} member`,
    );
    expect(gameService.getRecentMessages).toHaveBeenCalledWith(
      gameProcess.gameId,
      10,
    );
    expect(conn.send).toHaveBeenCalledWith(
      '12.12.12 <<otherUserId>>: Other message',
    );
    expect(gameProcess.notifyAllMembers).toHaveBeenCalledWith(
      `System: user ${userId} was connected to the ${teamNumber}`,
    );
    expect(gameProcess.disconnectHandler).toHaveBeenCalledWith(userId, conn);
    expect(gameProcess.playerMessageHandler).toHaveBeenCalledWith(userId, conn);
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

  it('should check words', async () => {
    const message = 'Happy message';
    const userId = 'userId';
    gameProcess.roundData.word = 'word';

    gameMechanicsService.hiddenWordRecognition = jest.fn(() => {
      return true;
    });
    gameProcess.guessWordHandler = jest.fn(() => {
      return true;
    });
    gameProcess.checkWord(message, userId);

    expect(gameProcess.roundData.word).not.toBeUndefined();
    expect(gameProcess.guessWordHandler).toBeTruthy();
  });
});
