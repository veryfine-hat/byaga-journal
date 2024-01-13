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

    expect(result).toEqual({result: 'result'});
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(Journal.startTimer).toHaveBeenCalledWith('mockFn');
    expect(Journal.exception).not.toHaveBeenCalled();
});

it('returns a function that wraps an async function and handles errors', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('error'));
    const loggedFn = makeLoggedAsync('mockFn')(mockFn);

    const result = await loggedFn('arg1', 'arg2');

    expect(result).toEqual({error: new Error('error')});
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(Journal.startTimer).toHaveBeenCalledWith('mockFn');
    expect(Journal.exception).toHaveBeenCalledWith(new Error('error'));
});