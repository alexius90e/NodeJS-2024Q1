import request from 'supertest';
import { server } from './main';

const baseUrl = '/api/users';

const requestBody = { username: 'John', age: 77, hobbies: [] };

describe('CRUD API tests', () => {
  test(`should get all users GET${baseUrl}`, async () => {
    const response = await request(server).get(baseUrl);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test(`should create user POST${baseUrl}`, async () => {
    const response = await request(server).post(baseUrl).send(requestBody);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: response.body.id,
      ...requestBody,
    });
  });

  test(`should delete user POST${baseUrl}`, async () => {
    const response = await request(server).post(baseUrl).send(requestBody);
    const responseBodyId = response.body.id;
    const deleteResponse = await request(server).delete(
      `${baseUrl}/${responseBodyId}`,
    );
    expect(deleteResponse.status).toBe(204);
  });
});
