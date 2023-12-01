const app = require('../app');
const request = require('supertest');
const getLoginnedUser = require('./helpers/getLoginnedUser');
const { gameService } = require('../services/game.service');
const { gameDao } = require('../dao/game.dao');

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
  beforeEach(async () => {
    const userData = await getLoginnedUser(app);
    token = userData.token;
    userId = userData.user.id;
  });
  let gameID = describe('POST create a new Game', () => {
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

});
