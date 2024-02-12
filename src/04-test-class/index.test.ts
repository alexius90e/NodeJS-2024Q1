import { getBankAccount } from '.';
import lodash from 'lodash';

const initiaBalance = 1000;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(initiaBalance);
    expect(bankAccount.getBalance()).toBe(initiaBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawing = initiaBalance + 1;
    const bankAccount = getBankAccount(initiaBalance);
    expect(() => bankAccount.withdraw(withdrawing)).toThrow(
      `Insufficient funds: cannot withdraw more than ${initiaBalance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const transferring = initiaBalance + 1;
    const bankAccount = getBankAccount(initiaBalance);
    const transferAccount = getBankAccount(initiaBalance);
    expect(() => bankAccount.transfer(transferring, transferAccount)).toThrow(
      `Insufficient funds: cannot withdraw more than ${initiaBalance}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transferring = initiaBalance + 1;
    const bankAccount = getBankAccount(initiaBalance);
    expect(() => bankAccount.transfer(transferring, bankAccount)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const deposit = 100;
    const bankAccount = getBankAccount(initiaBalance);
    expect(bankAccount.deposit(deposit).getBalance()).toBe(
      initiaBalance + deposit,
    );
  });

  test('should withdraw money', () => {
    const withdraw = 100;
    const bankAccount = getBankAccount(initiaBalance);
    expect(bankAccount.withdraw(withdraw).getBalance()).toBe(
      initiaBalance - withdraw,
    );
  });

  test('should transfer money', () => {
    const transfer = 100;
    const bankAccount = getBankAccount(initiaBalance);
    const transferAccount = getBankAccount(initiaBalance);
    expect(bankAccount.transfer(transfer, transferAccount).getBalance()).toBe(
      initiaBalance - transfer,
    );
    expect(transferAccount.getBalance()).toBe(initiaBalance + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const expectedBalance = 1;
    const bankAccount = getBankAccount(initiaBalance);
    jest.spyOn(lodash, 'random').mockReturnValue(expectedBalance);
    const balance = await bankAccount.fetchBalance();
    expect(balance).toBe(expectedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const bankAccount = getBankAccount(initiaBalance);
    const expectedBalans = 777;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(expectedBalans);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(expectedBalans);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const bankAccount = getBankAccount(initiaBalance);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);
    expect(async () => await bankAccount.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
