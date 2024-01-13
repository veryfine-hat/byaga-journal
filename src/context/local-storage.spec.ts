import {asyncLocalStorage, rootConfig} from './local-storage';
import {AsyncLocalStorage} from 'async_hooks';

jest.mock('async_hooks');

it('creates a new instance of AsyncLocalStorage', () => {
    expect(asyncLocalStorage).toBeInstanceOf(AsyncLocalStorage);
});

it('enters a context with the rootConfig', () => {
    const mockEnterWith = jest.fn();
    (AsyncLocalStorage.prototype.enterWith as jest.Mock) = mockEnterWith;

    new AsyncLocalStorage().enterWith(rootConfig);

    expect(mockEnterWith).toHaveBeenCalledWith(rootConfig);
});