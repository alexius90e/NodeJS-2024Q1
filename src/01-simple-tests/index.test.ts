import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 5, action: Action.Add })).toBe(7);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 11, b: 7, action: Action.Subtract })).toBe(4);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 7, b: 8, action: Action.Multiply })).toBe(56);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 121, b: 11, action: Action.Divide })).toBe(11);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 7, action: Action.Exponentiate })).toBe(
      128,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 12, b: 15, action: null })).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({ a: null, b: null, action: Action.Divide })).toBe(
      null,
    );
  });
});
