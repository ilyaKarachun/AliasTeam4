const request = require('supertest');

const creds = {
  username: 'test-user',
  email: 'email-test@test.com',
  password: 'password213',
};

const loginRequest = async (app) => {
  const response = await request(app)
    .post(`${process.env.API}/users/login`)
    .send(creds);

  return response;
};

const getLoginnedUser = async (app) => {
  let result;

  const response = await loginRequest(app);

  if (response.status !== 200) {
    await request(app).post(`${process.env.API}/users/register`).send(creds);

    let res = await loginRequest(app);
    result = res.body;
  } else {
    result = response.body;
  }

  return result;
};

module.exports = getLoginnedUser;
