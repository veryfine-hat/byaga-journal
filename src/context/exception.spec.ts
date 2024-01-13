import {exception} from './exception';
import {getLogger} from './logger';
import {StructuredLog} from '../StructuredLog';

jest.mock('./logger');

it('calls the exception method of the logger with the provided error and data', () => {
    const mockException = jest.fn();
    (getLogger as jest.Mock).mockReturnValue({exception: mockException});

    const error = new Error('mockError');
    const data: StructuredLog = {key: 'value'};

    exception(error, data);

    expect(mockException).toHaveBeenCalledWith(error, data);
});

it('calls the exception method of the logger with the provided error and no data', () => {
    const mockException = jest.fn();
    (getLogger as jest.Mock).mockReturnValue({exception: mockException});

    const error = new Error('mockError');

    exception(error);

    expect(mockException).toHaveBeenCalledWith(error, undefined);
});