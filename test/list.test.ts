import request from 'supertest';
import app from '../src/app';

describe('GET /list', () => {
  it('should return 503 OK', () => {
    return request(app).get('/list').expect(503);
  });
});
