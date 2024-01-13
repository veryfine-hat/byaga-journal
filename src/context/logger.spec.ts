import {getLogger, LOGGER, setLogger} from './logger';
import {getStore} from './get-store';
import {Span} from '../Span';

jest.mock('./get-store');

const mockLogger = {} as Span;
const map = {get: jest.fn(), set: jest.fn()} as unknown as Map<string, unknown>
beforeEach(() => {
    jest.resetAllMocks();

    (getStore as jest.Mock).mockReturnValue(map);
    (map.get as jest.Mock).mockReturnValue(mockLogger);
})

it('retrieves the current logger from the store', () => {
    const logger = getLogger();

    expect(logger).toBe(mockLogger);
});

it('sets the current logger in the store', () => {
    const mockLogger = {} as Span;
    setLogger(mockLogger);

    expect(map.set).toHaveBeenCalledWith(LOGGER, mockLogger);
});