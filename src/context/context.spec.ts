import {
    getContextValue,
    getLocalContext,
    getLocalContextValue,
    getSharedContext,
    getSharedContextValue,
    setContextValue,
    setContextValues,
    setLocalContext,
    setLocalContextValue,
    setLocalContextValues,
    setSharedContext,
    setSharedContextValue,
    setSharedContextValues
} from './context';
import {getStore} from './get-store';

jest.mock('./get-store', () => {
    const store = new Map();
    return ({getStore: jest.fn().mockReturnValue(store)})
});

beforeEach(() => {
    (getStore as jest.Mock).mockReturnValue(new Map());
    setLocalContext(new Map());
    setSharedContext(new Map());
});

it('sets and gets local context', () => {
    const context = new Map();
    setLocalContext(context);
    expect(getLocalContext()).toBe(context);
});

it('sets and gets local context value', () => {
    setLocalContextValue('key', 'value');
    expect(getLocalContextValue('key')).toBe('value');
});

it('sets and gets multiple local context values', () => {
    setLocalContextValues({key1: 'value1', key2: 'value2'});
    expect(getLocalContextValue('key1')).toBe('value1');
    expect(getLocalContextValue('key2')).toBe('value2');
});

it('sets and gets shared context', () => {
    const context = new Map();
    setSharedContext(context);
    expect(getSharedContext()).toBe(context);
});

it('sets and gets shared context value', () => {
    setSharedContextValue('key', 'value');
    expect(getSharedContextValue('key')).toBe('value');
});

it('sets and gets multiple shared context values', () => {
    setSharedContextValues({key1: 'value1', key2: 'value2'});
    expect(getSharedContextValue('key1')).toBe('value1');
    expect(getSharedContextValue('key2')).toBe('value2');
});

it('sets and gets context value', () => {
    setContextValue('key', 'value');
    expect(getContextValue('key')).toBe('value');
});

it('sets and gets multiple context values', () => {
    setContextValues({key1: 'value1', key2: 'value2'});
    expect(getContextValue('key1')).toBe('value1');
    expect(getContextValue('key2')).toBe('value2');
});

it('gets context value from local context if it exists', () => {
    setLocalContextValue('key', 'localValue');
    setSharedContextValue('key', 'sharedValue');
    expect(getContextValue('key')).toBe('localValue');
});

it('gets context value from shared context if it does not exist in local context', () => {
    setSharedContextValue('key', 'sharedValue');
    expect(getContextValue('key')).toBe('sharedValue');
});