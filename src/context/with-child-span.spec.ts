import {withChildSpan} from './with-child-span';
import {annotate} from './annotate';
import {exception} from './exception';
import * as createSpanModule from './create-span';

jest.spyOn(createSpanModule, 'createSpan');
jest.mock('./annotate');
jest.mock('./exception');

it('returns a function when called with a name', () => {
    const name = 'test';
    const result = withChildSpan(name);
    expect(typeof result).toBe('function');
});

it('returns a function that returns a function when called with a function', () => {
    const name = 'test';
    const fn = jest.fn();
    const result = withChildSpan(name)(fn);
    expect(typeof result).toBe('function');
});

it('calls createSpan with a function when the returned function is called', async () => {
    const name = 'test';
    const fn = jest.fn();
    const args = [1, 2, 3];
    const span = withChildSpan(name)(fn);
    await span(...args);
    expect(createSpanModule.createSpan).toHaveBeenCalledWith(expect.any(Function));
});

it('calls annotate with the provided name when the returned function is called', async () => {
    const name = 'test';
    const fn = jest.fn();
    const args = [1, 2, 3];
    const span = withChildSpan(name)(fn);
    await span(...args);
    expect(annotate).toHaveBeenCalledWith('name', name);
});

it('calls the provided function with the provided arguments when the returned function is called', async () => {
    const name = 'test';
    const fn = jest.fn();
    const args = [1, 2, 3];
    const span = withChildSpan(name)(fn);
    await span(...args);
    expect(fn).toHaveBeenCalledWith(...args);
});

it('calls exception with the error when the provided function throws an error', async () => {
    const name = 'test';
    const error = new Error('test error');
    const fn = jest.fn().mockRejectedValue(error);
    const args = [1, 2, 3];
    const span = withChildSpan(name)(fn);
    await span(...args);
    expect(exception).toHaveBeenCalledWith(error);
});