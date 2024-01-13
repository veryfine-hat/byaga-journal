import { sum, total, startTimer } from './metrics';
import { setContextValue } from './context';
import { annotate } from './annotate';
import { duration } from '../duration';

jest.mock('./annotate');
jest.mock('../duration');

describe('sub', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sum.reset('key');
        sum.reset('key1');
        sum.reset('key2');
    })

    it('initialize a new value  with the specified amount', () => {
        const result = sum('key', 2);

        expect(result).toBe(2);
    });


    it('sums are calculated by name', () => {
        const result = sum('key1', 3);
        const result1 = sum('key2');
        const result2 = sum('key2', 5);
        const result3 = sum('key1');

        expect(result).toBe(3);
        expect(result1).toBe(1);
        expect(result2).toBe(6);
        expect(result3).toBe(4);
    });

    it('increments a value in the context by a specified amount', () => {
        setContextValue('sum.key', 5)
        const result = sum('key', 2);

        expect(result).toBe(7);
    });

    it('increments a value in the context by 1 if no amount is specified', () => {
        sum('key', 5);
        const result = sum('key');

        expect(result).toBe(6);
    });
});
describe('total', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        total.reset('key');
        total.reset('key1');
        total.reset('key2');
    })

    it('creates a value in the context and logs the total', () => {
        total('key', 2);

        expect(annotate).toHaveBeenCalledWith('metrics.key_ct', 2);
    });

    it('increments a value in the context and logs the total', () => {
        total('key', 2);
        total('key', 100);

        expect(annotate).toHaveBeenCalledWith('metrics.key_ct', 102);
    });
    it('totals are calculated by name', () => {
        total('key1', 2);
        total('key2', 12);
        total('key2', 42);
        expect(annotate).toHaveBeenLastCalledWith('metrics.key2_ct', 54);

        total('key1', 64);
        expect(annotate).toHaveBeenLastCalledWith('metrics.key1_ct', 66);
    });
});

describe('startTimer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        startTimer.reset('key');
        startTimer.reset('key1');
        startTimer.reset('key2');

    })
    it('starts a timer and returns a function that stops the timer when called', () => {
        (duration as jest.Mock).mockReturnValue(() => 5);

        const stopTimer = startTimer('key');

        stopTimer();

        expect(duration).toHaveBeenCalled();
        expect(annotate).toHaveBeenCalledWith('metrics.key_total_dur_ms', 5);
    });

    it('will sum timers if multiple are called with the same name', () => {
        (duration as jest.Mock)
            .mockReturnValueOnce(() => 1)
            .mockReturnValueOnce(() => 4);

        const stopTimer1 = startTimer('key');
        const stopTimer2 = startTimer('key');

        stopTimer2();
        stopTimer1();

        expect(duration).toHaveBeenCalled();
        expect(annotate).toHaveBeenCalledWith('metrics.key_total_dur_ms', 5);
    });

    it('will track how many timers are called with the same name', () => {
        (duration as jest.Mock)
            .mockReturnValueOnce(() => 5)
            .mockReturnValueOnce(() => 3);

        const stopTimer1 = startTimer('key');
        const stopTimer2 = startTimer('key');

        stopTimer2();
        stopTimer1();

        expect(duration).toHaveBeenCalled();
        expect(annotate).toHaveBeenCalledWith('metrics.key_call_ct', 2);
    });

    it('throws an error if the stop timer function is called more than once', () => {
        (duration as jest.Mock).mockReturnValue(() => 5);

        const stopTimer = startTimer('key');

        stopTimer();

        expect(() => stopTimer()).toThrow('Done method should only be called once');
    });
});