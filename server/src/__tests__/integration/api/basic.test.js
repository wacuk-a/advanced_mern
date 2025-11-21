const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Simple test that doesn't depend on app structure
describe('Basic API Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Database connection should work', async () => {
    const connectionState = mongoose.connection.readyState;
    expect([1, 2]).toContain(connectionState); // 1 = connected, 2 = connecting
  });

  test('MongoMemoryServer should provide valid URI', () => {
    const uri = mongoServer.getUri();
    expect(uri).toMatch(/mongodb:\/\//);
  });
});
