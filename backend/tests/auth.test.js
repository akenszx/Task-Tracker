const request = require('supertest');

// mocking the User model here so these tests don't need a real database
// connection - we're testing the route logic, not Sequelize/MySQL itself
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const { User } = require('../models');
const app = require('../app');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '7d';
});

describe('POST /api/auth/register', () => {
  it('rejects a request missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'jake@example.com' }); // missing name and password on purpose

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('rejects a password shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jake', email: 'jake@example.com', password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/at least 6 characters/i);
  });

  it('rejects registration when the email is already taken', async () => {
    // pretend a user with this email already exists
    User.findOne.mockResolvedValue({ id: 1, email: 'jake@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jake', email: 'jake@example.com', password: 'password123' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('creates a new user and returns a token on valid input', async () => {
    User.findOne.mockResolvedValue(null); // no existing user with this email yet
    User.create.mockResolvedValue({
      id: 42,
      name: 'Jake',
      email: 'jake@example.com',
      password: 'hashed-password',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jake', email: 'jake@example.com', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toEqual({ id: 42, name: 'Jake', email: 'jake@example.com' });
    // making sure the password hash never gets sent back to the client
    expect(res.body.user).not.toHaveProperty('password');
  });
});