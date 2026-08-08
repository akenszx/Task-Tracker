const request = require('supertest');
const jwt = require('jsonwebtoken');

// mocking Task/Category here too - this suite is really about checking
// the auth middleware blocks unauthorized requests, not the query itself
jest.mock('../models', () => ({
  Task: { findAndCountAll: jest.fn() },
  Category: {},
}));

const { Task } = require('../models');
const app = require('../app');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

describe('GET /api/tasks', () => {
  it('rejects requests with no Authorization header', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
    expect(Task.findAndCountAll).not.toHaveBeenCalled();
  });

  it('rejects requests with a malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'NotBearer sometoken');

    expect(res.statusCode).toBe(401);
  });

  it('rejects requests with an invalid/expired token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer this.is.not.a.valid.jwt');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid or expired/i);
  });

  it('allows the request through with a valid token', async () => {
    const token = jwt.sign({ id: 7 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    Task.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('tasks');
    expect(res.body).toHaveProperty('pagination');
    // confirms tasks are actually scoped to the logged-in user's id
    expect(Task.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ user_id: 7 }),
      })
    );
  });
});