import {makeLoggedAsync} from './make-logged-async';
import Journal from '../index';

jest.mock('../index');

beforeEach(() => {
    const stopTimer = jest.fn();
    jest.spyOn(Journal, 'startTimer').mockImplementation(name => () => stopTimer(name));
})

it('returns a function that wraps an async function with logging behavior', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');
    const loggedFn = makeLoggedAsync('mockFn')(mockFn);

    const result = await loggedFn('arg1', 'arg2');

    expect(result).toEqual('result');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(Journal.startTimer).toHaveBeenCalledWith('mockFn');
    expect(Journal.exception).not.toHaveBeenCalled();
});

it('returns a function that wraps an async function and handles errors', async () => {
    const mockFn = jest.fn().mockImplementation(() => {
        throw 'error'
    });
    const loggedFn = makeLoggedAsync('mockFn')(mockFn);

    const result = loggedFn('arg1', 'arg2');

    await expect(result).rejects.toEqual('error');
});