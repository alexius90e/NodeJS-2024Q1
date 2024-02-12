import axios, { AxiosStatic } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const axiosMockup = axios as jest.Mocked<AxiosStatic>;
  const mockedData = { data: 'any data' };
  const relativePath = '/anypath';

  beforeEach(() => {
    axiosMockup.create.mockReturnThis();
    axiosMockup.get.mockResolvedValueOnce(mockedData);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    expect(axios.create().get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const responseData = await throttledGetDataFromApi(relativePath);
    expect(responseData).toEqual(mockedData.data);
  });
});
