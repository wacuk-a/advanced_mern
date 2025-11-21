// Example unit test for Express middleware

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Simple token validation (in real app, verify JWT)
  if (token !== 'valid-token') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = { id: 1, username: 'testuser' };
  next();
};

// Tests
describe('Express Middleware', () => {
  test('loggerMiddleware should call next', () => {
    const req = { method: 'GET', path: '/api/test' };
    const res = {};
    const next = jest.fn();
    
    loggerMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });

  test('authMiddleware should return 401 for missing token', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  test('authMiddleware should call next for valid token', () => {
    const req = { headers: { authorization: 'valid-token' } };
    const res = {};
    const next = jest.fn();
    
    authMiddleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, username: 'testuser' });
  });
});

module.exports = { loggerMiddleware, authMiddleware };
