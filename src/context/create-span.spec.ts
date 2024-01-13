import {createSpan} from './create-span';
import {getLogger} from './logger';

jest.mock('./logger');
jest.mock('./context')

it('creates a new span and runs a function within the context of the span', async () => {
    const mockFn = jest.fn().mockResolvedValue('result');
    const end = jest.fn()
    const mockBeginSpan = jest.fn().mockReturnValue({end});
    (getLogger as jest.Mock).mockReturnValue({beginSpan: mockBeginSpan});

    const result = await createSpan(mockFn);

    expect(result).toBe('result');
    expect(mockFn).toHaveBeenCalled();
    expect(mockBeginSpan).toHaveBeenCalled();
});

it('throws an error if the function throws an error', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('error'));
    const mockBeginSpan = jest.fn().mockReturnValue({end: jest.fn()});
    (getLogger as jest.Mock).mockReturnValue({beginSpan: mockBeginSpan});

    await expect(createSpan(mockFn)).rejects.toThrow('error');
});