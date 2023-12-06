const app = require('../app');
const request = require('supertest');
const { gameService } = require('../services/game.service');
const { userService } = require('../services/user.service');
const { gameDao } = require('../dao/game.dao');

const creds = {
  username: 'test-user-game',
  email: 'email-test-game@test.com',
  password: 'password213',
};

const loginRequest2 = async (app) => {
  const response = await request(app)
    .post(`${process.env.API}/users/login`)
    .send(creds);

  return response;
};

const getLoginnedUser2 = async (app) => {
  let result;

  const response = await loginRequest2(app);

  if (response.status !== 200) {
    await request(app).post(`${process.env.API}/users/register`).send(creds);

    let res = await loginRequest2(app);
    result = res.body;
  } else {
    result = response.body;
  }

  return result;
};

const testGameFullData = {
  name: 'game-test-done2',
  teamSize: 3,
  level: 'medium',
};

const testGameNotAllData = {
  level: 'medium',
};

describe('Games', () => {
  let token;
  let userId;
  let count = 0;
  let gameID;

  beforeEach(async () => {
    const userData = await getLoginnedUser2(app);
    token = userData.token;
    userId = userData.user.id;
  });

  gameID = describe('POST create a new Game', () => {
    it('should respond with a 201 status code', async () => {
      return request(app)
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` })
        .send(testGameFullData)
        .expect(201)
        .then(({ body }) => {
          gameID = body.gameID;
        });
    });
  });

  describe('Create Game', () => {
    it('should respond with a 201 status code', async () => {
      const response = await request(app)
        // eslint-disable-next-line no-undef
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` })
        .send(testGameFullData);
      const gameId = response.body.gameID;

      expect(response.statusCode).toBe(201);
      await gameService.delete(gameId);
    });

    it('should respond with a 400 status code', async () => {
      const response = await request(app)
        // eslint-disable-next-line no-undef
        .post(`${process.env.API}/games`)
        .send(testGameFullData);
      const gameId = response.body.gameID;

      expect(response.statusCode).toBe(401);
      await gameService.delete(gameId);
    });

    it('should respond with a 400 status code without payload', async () => {
      const response = await request(app)
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.statusCode).toBe(400);
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});
    });

    it('should respond with a 400 status if teamSize > 10', async () => {
      const response = await request(app)
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'game-test-done3',
          teamSize: 11,
          level: 'medium',
        });
      expect(response.statusCode).toBe(400);
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});
    });

    it('should respond with a 400 status code if level wrong', async () => {
      const response = await request(app)
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'game-test-done3',
          teamSize: 11,
          level: 'wrongLevel',
        });
      expect(response.statusCode).toBe(400);
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});
    });

    it('should respond with a 400 status code without required payload', async () => {
      const response = await request(app)
        .post(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` })
        .send(testGameNotAllData);
      expect(response.statusCode).toBe(400);
      const consoleErrorSpy = jest.spyOn(console, 'error');
      consoleErrorSpy.mockImplementation(() => {});
    });
  });

  describe('Get Games', () => {
    it('should get all games and return status 200', async () => {
      const response = await request(app)
        .get(`${process.env.API}/games`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.statusCode).toBe(200);
    });

    it('should get game by ID', async () => {
      const response = await request(app)
        .get(`${process.env.API}/games/${gameID}`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
    });
  });

  describe('Delete game by ID', () => {
    it('should delete game and return status 204', async () => {
      const response = await request(app)
        .delete(`${process.env.API}/games/${gameID}`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.statusCode).toBe(204);
    });
  });

  describe('Enter the game', () => {
    const fullDataJoin = {
      user_id: userId,
      game_id: gameID,
      number: 1,
    };

    const partlyDataJoin = {
      game_id: gameID,
      number: 1,
    };

    it('should join the game and return status 200 if data correct', async () => {
      const response = await request(app)
        .put(`${process.env.API}/games/${gameID}/join`)
        .set({ Authorization: `Bearer ${token}` })
        .send(fullDataJoin);
      expect(response.statusCode).toBe(500);
    });

    it('should join the game and return status 500 if data correct', async () => {
      const response = await request(app)
        .put(`${process.env.API}/games/${gameID}/join`)
        .set({ Authorization: `Bearer ${token}` })
        .send(partlyDataJoin);
      expect(response.statusCode).toBe(500);
    });

    it('should successfully join team 1 if conditions are met', async () => {
      jest.spyOn(gameDao, 'getTeams').mockResolvedValue({
        team1: [],
        team2: [],
        team_size: 3,
      });

      const response = await request(app)
        .put(`${process.env.API}/games/${gameID}/join`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ user_id: userId, game_id: gameID, number: 1 });

      expect(response.statusCode).toBe(200);
    });

    it('should return 400 if the user has already joined a team', async () => {
      jest.spyOn(gameDao, 'getTeams').mockResolvedValue({
        team1: ['someOtherUserId', userId],
        team2: [],
        team_size: 3,
      });

      const response = await request(app)
        .put(`${process.env.API}/games/${gameID}/join`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ user_id: userId, game_id: gameID, number: 1 });

      expect(response.statusCode).toBe(400);
    });
  });

  const mockUpdateMessageHistory = jest.fn();

  gameDao.updateMessageHistory = mockUpdateMessageHistory;

  describe('addMessageToHistory', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return true on successful update', async () => {
      const gameId = 'someGameId';
      const newMessage = { text: 'Hello, world!' };

      mockUpdateMessageHistory.mockResolvedValue(true);

      const result = await gameService.addMessageToHistory(gameId, newMessage);

      expect(result).toBe(true);
      expect(mockUpdateMessageHistory).toHaveBeenCalledWith(gameId, newMessage);
    });

    it('should return false and log error on update failure', async () => {
      const gameId = 'someGameId';
      const newMessage = { text: 'Hello, world!' };

      // Мокаем неудачный вызов updateMessageHistory
      mockUpdateMessageHistory.mockRejectedValue(new Error('Update failed'));

      const result = await gameService.addMessageToHistory(gameId, newMessage);

      expect(result).toBe(false);
      expect(mockUpdateMessageHistory).toHaveBeenCalledWith(gameId, newMessage);
      expect(console.error).toHaveBeenCalledWith(
        'addMessageToHistory Service error:',
        expect.any(Error),
      );
    });
  });

  const mockGetRecentMessages = jest.fn();

  gameDao.getRecentMessages = mockGetRecentMessages;

  describe('getRecentMessages', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return recent messages based on count', async () => {
      const gameId = 'someGameId';
      const count = 5;
      const mockRecentMessages = [
        'message1',
        'message2',
        'message3',
        'message4',
        'message5',
      ];

      mockGetRecentMessages.mockResolvedValue(mockRecentMessages);

      const result = await gameService.getRecentMessages(gameId, count);

      expect(result).toEqual([
        'message1',
        'message2',
        'message3',
        'message4',
        'message5',
      ]);
      expect(mockGetRecentMessages).toHaveBeenCalledWith(gameId);
    });

    it('should return an empty array and log error on error', async () => {
      const gameId = 'someGameId';
      const count = 5;

      mockGetRecentMessages.mockRejectedValue(
        new Error('Error getting recent messages'),
      );

      const result = await gameService.getRecentMessages(gameId, count);

      expect(result).toEqual([]);
      expect(mockGetRecentMessages).toHaveBeenCalledWith(gameId);
      expect(console.error).toHaveBeenCalledWith(
        'Error getting recent messages in GameProcess:',
        expect.any(Error),
      );
    });
  });

  afterAll(() => {
    userService.deleteUser({ id: userId });
  });
});
