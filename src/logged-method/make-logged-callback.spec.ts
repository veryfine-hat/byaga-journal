import {makeLoggedCallback} from './make-logged-callback';
import Journal from '../index';
import {Callback} from "./FunctionWithCallback";

jest.mock('../index');

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Journal, 'startTimer').mockReturnValue(() => {});
})

it('returns a function that wraps a function with a callback with logging behavior', done => {
    const mockFn = jest.fn((callback: (error: unknown, result?: unknown) => void) => {
        callback(null, 'result')
    }) as Callback;
    const loggedFn = makeLoggedCallback('mockFn')(mockFn);

    loggedFn((error: unknown, result: unknown) => {
        expect(error).toBeNull();
        expect(result).toBe('result');
        expect(mockFn).toHaveBeenCalled();
        expect(Journal.startTimer).toHaveBeenCalledWith('mockFn');
        expect(Journal.exception).not.toHaveBeenCalled();
        done();
    });
});

it('returns a function that wraps a function with a callback and handles errors', done => {
    const mockFn = jest.fn((callback: (error: unknown, result?: unknown) => void) => {
        callback(new Error('error'))
    }) as Callback;
    const loggedFn = makeLoggedCallback('mockFn')(mockFn);

    loggedFn((error: unknown, result: unknown) => {
        expect(error).toBeInstanceOf(Error);
        expect(result).toBeUndefined();
        expect(mockFn).toHaveBeenCalled();
        expect(Journal.startTimer).toHaveBeenCalledWith('mockFn');
        expect(Journal.exception).toHaveBeenCalledWith(new Error('error'));
        done();
    });
});