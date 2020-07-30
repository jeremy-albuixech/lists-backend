import request from 'supertest';
import app from '../src/app';
import { OwlItemM } from '../src/models/OwlItem';

describe('post /item - Without any body parameters', () => {
  it('should return 400', () => {
    return request(app).post('/item').expect(400);
  });
});

describe('post /item - With an invalid list ID', () => {
  it('should return 400', () => {
    return request(app).post('/item').send({ list_id: 'test' }).expect(400);
  });
});

describe('post /item - With an existing list ID', () => {
  beforeAll(() => {
    OwlItemM.updateOne = jest.fn().mockResolvedValue({ updated: 1 });
    OwlItemM.findOne = jest.fn().mockResolvedValue({
      items: [{ text: 'test item', status: 'saved' }],
      _id: '5f2255d9a736e9e4dde2d547',
      list_id: '5f2255d26e6beada45a57029',
    });
  });
  it('should return 200', () => {
    return request(app)
      .post('/item')
      .send({ list_id: '5f2255d26e6beada45a57029' })
      .expect(200);
  });
});
describe('delete /item/:id - Without any body parameters', () => {
  it('should return 400', () => {
    return request(app).delete('/item/test').expect(400);
  });
});

describe('get /item/:id - With a non-existing ID', () => {
  it('should return 200 but no item', async done => {
    const response = await request(app).get('/item/tests');
    expect(response.status).toBe(200);
    done();
  });
});

describe('get /item/:id - With an existing ID', () => {
  it('should return the items', async done => {
    OwlItemM.findOne = jest.fn().mockResolvedValueOnce({
      items: [{ text: 'test item', status: 'saved' }],
      _id: '5f2255d9a736e9e4dde2d547',
      list_id: '5f2255d26e6beada45a57029',
    });
    const response = await request(app).get('/item/5f2255d26e6beada45a57029');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      items: [{ text: 'test item', status: 'saved' }],
      _id: '5f2255d9a736e9e4dde2d547',
      list_id: '5f2255d26e6beada45a57029',
    });

    done();
  });
});
