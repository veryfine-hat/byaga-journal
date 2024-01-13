import {startTimer} from './start-timer';
import {duration} from '../duration';
import {annotate} from './annotate';

jest.mock('../duration');
jest.mock('./annotate');

it('starts a timer and returns a function that stops the timer when called', () => {
    (duration as jest.Mock).mockReturnValue(() => 5);

    const stopTimer = startTimer('key');

    stopTimer();

    expect(duration).toHaveBeenCalled();
    expect(annotate).toHaveBeenCalledWith({'metrics.key_dur_ms': 5});
});

it('uses "duration_ms" as the key if no name is provided', () => {
    (duration as jest.Mock).mockReturnValue(() => 5);

    const stopTimer = startTimer();

    stopTimer();

    expect(duration).toHaveBeenCalled();
    expect(annotate).toHaveBeenCalledWith({'duration_ms': 5});
});

it('throws an error if the stop timer function is called more than once', () => {
    (duration as jest.Mock).mockReturnValue(() => 5);

    const stopTimer = startTimer('key');

    stopTimer();

    expect(() => stopTimer()).toThrow('Done method should only be called once');
});