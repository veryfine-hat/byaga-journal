import { AsyncLocalStorage } from 'async_hooks';

/**
 * Creates a new instance of AsyncLocalStorage.
 * AsyncLocalStorage class is used to create asynchronous state within callbacks and promise chains.
 * @see {@link https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage|Node.js AsyncLocalStorage documentation}
 */
export const asyncLocalStorage = new AsyncLocalStorage();

/**
 * The main configuration map for the context management system.
 * It includes three entries:
 * - CONTEXT: A map for storing context data.
 * - CASCADED_CONTEXT: A map for storing cascaded context data.
 * - LOGGER: A logger instance, initially set to null.
 */
export const rootConfig: Map<string, unknown> = new Map()

/**
 * Enters a context with the given store.
 * This method is used to set the default map that forms the asynchronous state within the callback function and promise chains.
 * In this case, it's setting the rootConfig as the default state.
 */
asyncLocalStorage.enterWith(rootConfig);