import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const array = [1, 2, 3];

  test('should generate linked list from values 1', () => {
    const linkedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };
    expect(generateLinkedList(array)).toStrictEqual(linkedList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(array)).toMatchSnapshot();
  });
});
