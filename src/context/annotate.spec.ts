import {annotate} from './annotate';
import {getLogger} from './logger';
import {LogOptions} from '../LogOptions';

jest.mock('./logger');

it('calls the annotate method of the logger with the provided parameters', () => {
    const mockAnnotate = jest.fn();
    (getLogger as jest.Mock).mockReturnValue({annotate: mockAnnotate});

    const name = 'mockName';
    const value: string = 'value';
    const options: LogOptions = { hoist: true };

    annotate(name, value, options);

    expect(getLogger().annotate).toHaveBeenCalledWith(name, value, options);
});

it('calls the annotate method of the logger with a StructuredLog instance', () => {
    const mockAnnotate = jest.fn();
    (getLogger as jest.Mock).mockReturnValue({annotate: mockAnnotate});

    const log = { test: 'log'};
    const options: LogOptions = {cascade: true};

    annotate(log, options);

    expect(getLogger().annotate).toHaveBeenCalledWith(log, options);
});