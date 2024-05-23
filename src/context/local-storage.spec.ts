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

it('should preserve the local storage when multiple instances of the package are imported', () => {
    jest.resetModules(); // Forces the module to be reloaded
    const asyncLocalStorage1 = jest.requireActual('./local-storage').asyncLocalStorage;
    jest.resetModules(); // Forces the module to be reloaded to simulate importing a 2nd copy of the package
    const asyncLocalStorage2 = jest.requireActual('./local-storage').asyncLocalStorage;

    expect(asyncLocalStorage1).toBe(asyncLocalStorage2);
});