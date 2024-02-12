import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 20, b: 7, action: Action.Subtract, expected: 13 },
  { a: 74, b: 28, action: Action.Subtract, expected: 46 },
  { a: 11, b: 7, action: Action.Subtract, expected: 4 },
  { a: 7, b: 9, action: Action.Multiply, expected: 63 },
  { a: 6, b: 8, action: Action.Multiply, expected: 48 },
  { a: 23, b: 4, action: Action.Multiply, expected: 92 },
  { a: 81, b: 9, action: Action.Divide, expected: 9 },
  { a: 196, b: 14, action: Action.Divide, expected: 14 },
  { a: 81, b: 27, action: Action.Divide, expected: 3 },
  { a: 21, b: 2, action: Action.Exponentiate, expected: 441 },
  { a: 2, b: 9, action: Action.Exponentiate, expected: 512 },
  { a: 28, b: 3, action: Action.Exponentiate, expected: 21952 },
  { a: '***', b: 10, action: Action.Add, expected: null },
  { a: 10, b: '***', action: Action.Subtract, expected: null },
  { a: '***', b: '***', action: Action.Multiply, expected: null },
  { a: 10, b: 10, action: '***', expected: null },
  { a: 10, b: 10, action: 123, expected: null },
  { a: 10, b: 10, action: false, expected: null },
  { a: 10, b: 10, action: {}, expected: null },
  { a: 10, b: 10, action: null, expected: null },
  { a: 10, b: 10, action: undefined, expected: null },
];

describe('simpleCalculator', () => {
  testCases.forEach((testCase) => {
    const { a, b, action, expected } = testCase;
    const message = `should calculate ${a} ${action} ${b} and return ${expected} `;
    test(message, () => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    });
  });
});
