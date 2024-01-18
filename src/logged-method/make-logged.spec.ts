import {makeLogged} from './make-logged';
import {AsyncFunction} from './AsyncFunction'
import {Callback} from './FunctionWithCallback'

it('returns a function that wraps an async function with logging behavior', async () => {
    const mockFn: AsyncFunction = async () => 'result';
    const loggedFn = makeLogged('mockFn')(mockFn);

    const result = await loggedFn();

    expect(result).toEqual('result');
});

it('returns a function that wraps a function with a callback with logging behavior', done => {
    const mockFn = (callback: (error: unknown, result?: unknown) => void) => {
        callback(null, 'result');
    }
    const loggedFn = makeLogged('mockFn')(mockFn);

    const cb: Callback = (error: unknown, result: unknown): void => {
        expect(error).toBeNull();
        expect(result).toBe('result');
        done();
    }
    loggedFn(cb);
});

it('returns an error when the async function throws an error', async () => {
    const mockFn: AsyncFunction = async () => {
        throw 'error';
    };
    const loggedFn = makeLogged('mockFn')(mockFn);

    await expect(loggedFn()).rejects.toEqual('error');
});

it('calls the callback with an error when the function with a callback throws an error', done => {
    const mockFn = (callback: (error: unknown, result?: unknown) => void) =>{
        callback('error');
    }
    const loggedFn = makeLogged('mockFn')(mockFn);

    loggedFn((error: unknown, result: unknown) => {
        expect(error).toEqual('error');
        expect(result).toBeUndefined();
        done();
    });
});

