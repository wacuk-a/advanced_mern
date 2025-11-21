# Debugging Techniques for MERN Stack Application

## Client-Side Debugging

### 1. Browser Developer Tools
```javascript
// Use console methods for debugging
console.log('Basic logging');
console.error('Error logging');
console.warn('Warning logging');
console.table({ key: 'value' }); // For objects/arrays
console.trace(); // Stack trace

// Performance monitoring
console.time('operation');
// Your code here
console.timeEnd('operation');
2. React Developer Tools
Install React DevTools browser extension

Inspect component hierarchy and props

Monitor component re-renders

3. Error Boundaries
Wrap components with ErrorBoundary to catch runtime errors:

jsx
<ErrorBoundary fallback={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
4. Network Tab Debugging
Monitor API calls in Network tab

Check request/response payloads

Verify headers and status codes

Server-Side Debugging
1. Structured Logging
javascript
import logger from './utils/logger';

logger.info('User login successful', { userId: 123 });
logger.error('Database connection failed', { error: err.message });
logger.debug('Query executed', { query, duration });
2. Request/Response Logging
Use the requestLogger middleware to automatically log all HTTP requests.

3. Error Handling
Use globalErrorHandler for centralized error processing

Throw AppError for operational errors

Use asyncHandler for async route error handling

4. Database Debugging
javascript
// Enable Mongoose debug mode in development
mongoose.set('debug', process.env.NODE_ENV === 'development');
Performance Monitoring
1. Client Performance
javascript
// Use Performance API
const start = performance.now();
// Your operation
const end = performance.now();
console.log(`Operation took ${end - start}ms`);

// Monitor React performance with Profiler
<React.Profiler id="YourComponent" onRender={onRenderCallback}>
  <YourComponent />
</React.Profiler>
2. Server Performance
javascript
// Use performanceMonitor utility
const result = performanceMonitor('Database Query', () => {
  return db.query('SELECT * FROM users');
});
3. Memory Leak Detection
Use Chrome DevTools Memory tab

Take heap snapshots

Monitor memory usage over time

Common Issues and Solutions
1. CORS Issues
Verify CORS configuration

Check allowed origins and methods

2. Database Connection Issues
Verify connection string

Check network connectivity

Monitor connection pool

3. Authentication Problems
Verify JWT configuration

Check token expiration

Validate session storage

4. API Response Issues
Check status codes

Validate response format

Monitor error responses
