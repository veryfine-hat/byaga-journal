import {configure} from './configure';
import {logger} from './logger';
import {ContextConfiguration} from './ContextConfiguration';

jest.mock('./logger');

it('calls the configure method of the logger with the provided configuration', () => {
    const configureLogger = jest.fn() as jest.Mock;
    (logger as jest.Mock).mockReturnValue({configure:configureLogger});
    const config: ContextConfiguration = {write: jest.fn()};

    configure(config);

    expect(configureLogger).toHaveBeenCalledWith(config);
});