import {debug, error, info, send, trace, warn} from './log';
import {getLogger} from './logger';
import { Journal } from "../Journal";
import { getLogLevel } from "./configure";

jest.mock('./logger');
jest.mock("../Journal");
jest.mock('./configure');

beforeEach(() => {
    const mockLogger = new Journal();
    (getLogLevel as jest.Mock).mockReturnValue(0);
    (getLogger as jest.Mock).mockReturnValue(mockLogger);
})

it('sends a log with the provided data', () => {
    const data = {key: 'value'};

    send(data);

    expect(getLogger().log).toHaveBeenCalledWith(data);
});

it('logs a debug message with the provided key and value', () => {
    debug('key', 'value');

    expect(getLogger().annotate).toHaveBeenCalledWith('debug.key', 'value');
});

it('logs a trace message with the provided message', () => {
    trace('message');

    expect(getLogger().annotate).toHaveBeenCalledWith('trace.count', 1);
    expect(getLogger().annotate).toHaveBeenCalledWith('trace.1', 'message');
});

it('logs an info message with the provided message', () => {
    info('message');

    expect(getLogger().annotate).toHaveBeenCalledWith('message', 'message');
});

it('logs an error message with the provided message and prefix', () => {
    error('message', 'prefix');

    expect(getLogger().annotate).toHaveBeenCalledWith('error', '1 errors have occurred');
    expect(getLogger().annotate).toHaveBeenCalledWith('error.prefix', 'message');
});

it('logs a warning message with the provided message', () => {
    warn('message');

    expect(getLogger().annotate).toHaveBeenCalledWith('warn', 'message');
});