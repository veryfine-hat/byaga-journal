import { getStore } from "./get-store";

// Constants for different context types
const CONTEXT = 'context';
const CASCADED_CONTEXT = 'cascaded-context'

type ContextItem = unknown
// Helper function to iterate over each entry in a data object and apply a given function.
const forEachEntry = (fn: (name: string, value: ContextItem) => void, data: Record<string, ContextItem>) => Object.entries(data).forEach(([name, value]) => fn(name, value));

/**
 * Retrieves the local context from the store.
 *
 * @returns {Map<string, ContextItem>} - The local context.
 */
export const getLocalContext = (): Map<string, ContextItem> => getStore().get(CONTEXT) as Map<string, ContextItem>;

/**
 * Sets the local context in the store.
 *
 * @param {Map<string, ContextItem>} context - The local context to set.
 */
export const setLocalContext = (context: Map<string, ContextItem>) => getStore().set(CONTEXT, context);

/**
 * Sets a value in the local context.
 *
 * @param {string} name - The name of the context item.
 * @param {ContextItem} value - The value of the context item.
 */
export const setLocalContextValue = (name: string, value: ContextItem) => getLocalContext().set(name, value);

/**
 * Sets multiple values in the local context.
 *
 * @param {Record<string, ContextItem>} data - An object containing the context items to set.
 */
export const setLocalContextValues = (data: Record<string, ContextItem>) => forEachEntry(setLocalContextValue, data)

/**
 * Retrieves a value from the local context.
 *
 * @param {string} name - The name of the context item.
 * @returns {ContextItem} - The value of the context item.
 */
export const getLocalContextValue = (name: string): ContextItem => getLocalContext().get(name);

/**
 * Retrieves the shared context from the store.
 *
 * @returns {Map<string, ContextItem>} - The shared context.
 */
export const getSharedContext = (): Map<string, ContextItem> => getStore().get(CASCADED_CONTEXT) as Map<string, ContextItem>;

/**
 * Sets the shared context in the store.
 *
 * @param {Map<string, ContextItem>} context - The shared context to set.
 */
export const setSharedContext = (context: Map<string, ContextItem>) => getStore().set(CASCADED_CONTEXT, context);

/**
 * Sets a value in the shared context.
 *
 * @param {string} name - The name of the context item.
 * @param {ContextItem} value - The value of the context item.
 */
export const setSharedContextValue = (name: string, value: ContextItem) => getSharedContext().set(name, value);

/**
 * Sets multiple values in the shared context.
 *
 * @param {Record<string, ContextItem>} data - An object containing the context items to set.
 */
export const setSharedContextValues = (data: Record<string, ContextItem>) => forEachEntry(setSharedContextValue, data)

/**
 * Retrieves a value from the shared context.
 *
 * @param {string} name - The name of the context item.
 * @returns {ContextItem} - The value of the context item.
 */
export const getSharedContextValue = (name: string): ContextItem => getSharedContext().get(name);

/**
 * Sets a value in the local or shared context.
 *
 * @param {string} name - The name of the context item.
 * @param {ContextItem} value - The value of the context item.
 * @param {boolean} shared - Whether to set the value in the shared context. Defaults to false.
 * @returns {ContextItem} - The value that was set.
 */
export const setContextValue = (name: string, value: ContextItem, shared = false) => {
    if (shared) { getSharedContext().set(name, value)}
    else { getLocalContext().set(name, value)}
    return value
}

/**
 * Sets multiple values in the local or shared context.
 *
 * @param {Record<string, ContextItem>} data - An object containing the context items to set.
 * @param {boolean} shared - Whether to set the values in the shared context. Defaults to false.
 */
export const setContextValues = (data: Record<string, ContextItem>, shared = false) => shared ? setSharedContextValues(data) : setLocalContextValues(data)

/**
 * Retrieves a value from the local or shared context.
 *
 * @param {string} name - The name of the context item.
 * @returns {ContextItem} - The value of the context item.
 */
export const getContextValue = (name:string): ContextItem => getLocalContext().get(name) || getSharedContext().get(name)

/**
 * Initializes the context management system.
 */
setLocalContext(new Map())
setSharedContext(new Map())