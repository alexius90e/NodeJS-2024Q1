import fs from 'fs';
import path from 'path';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const timer = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(timer).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const timer = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, timeout);
    expect(timer).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = './file.txt';

  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    await readFileAsynchronously(pathToFile);
    expect(path.join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    const fileData = await readFileAsynchronously(pathToFile);
    expect(fileData).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const mockedFileContent = 'Some text...';
    const encoding = 'utf-8';
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(Buffer.from(mockedFileContent, encoding)),
      );
    const fileData = await readFileAsynchronously(pathToFile);
    expect(fileData).toBe(mockedFileContent);
  });
});
