const app = require('../app');
const request = require('supertest');
const getLoginnedUser = require('./helpers/getLoginnedUser');

describe('auth logic', () => {
  let user;
  let token;

  beforeEach(async () => {
    const userData = await getLoginnedUser(app);
    user = userData.user;
    token = userData.token;
  });

  it('try to register new user any data without', async () => {
    const response = await request(app)
      .post(`${process.env.API}/users/login`)
      .send({});

    expect(response.statusCode).toBe(400);
  });

  it('try to login new user any data without', async () => {
    const response = await request(app)
      .post(`${process.env.API}/users/register`)
      .send({});

    expect(response.statusCode).toBe(400);
  });

  it('try to get users without token', async () => {
    const response = await request(app).get(`${process.env.API}/users`);

    expect(response.statusCode).toBe(401);
  });

  it('try to get users with token', async () => {
    const response = await request(app)
      .get(`${process.env.API}/users`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(200);
  });

  it('try to get user by id without token', async () => {
    const response = await request(app).get(
      `${process.env.API}/users/${user.id}`,
    );

    expect(response.statusCode).toBe(401);
  });

  it('try to get user by id with token', async () => {
    const response = await request(app)
      .get(`${process.env.API}/users/${user.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(200);
  });

  it('try to get not existing user', async () => {
    const response = await request(app)
      .get(`${process.env.API}/users/1111111f`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(404);
  });

  it('try to update statisic without token', async () => {
    const response = await request(app)
      .put(`${process.env.API}/users/${user.id}`)
      .send({ statistic: '10' });

    expect(response.statusCode).toBe(401);
  });

  it('try to update statisic with token', async () => {
    const response = await request(app)
      .put(`${process.env.API}/users/${user.id}`)
      .send({ statistic: '10' })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(200);
  });

  it('try to delete user without token', async () => {
    const response = await request(app).delete(
      `${process.env.API}/users/${user.id}`,
    );

    expect(response.statusCode).toBe(401);
  });

  it('try to delete user with token', async () => {
    const response = await request(app)
      .delete(`${process.env.API}/users/${user.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(204);
  });
});
