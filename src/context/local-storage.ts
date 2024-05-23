import { AsyncLocalStorage } from 'async_hooks';

const JOURNAL_CONTEXT = '__journal__context__';
const JOURNAL_CONFIG = '__journal__config__';

if (typeof (global as Record<string, unknown>)[JOURNAL_CONTEXT] == 'undefined') {
    /**
     * Creates a new instance of AsyncLocalStorage.
     * AsyncLocalStorage class is used to create asynchronous state within callbacks and promise chains.
     * @see {@link https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage|Node.js AsyncLocalStorage documentation}
     */
    const newLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();
    const config = new Map<string, unknown>();

    /**
     * Enters a context with the given store.
     * This method is used to set the default map that forms the asynchronous state within the callback function and promise chains.
     * In this case, it's setting the rootConfig as the default state.
     */
    newLocalStorage.enterWith(config);

    (global as Record<string, unknown>)[JOURNAL_CONTEXT] = newLocalStorage;
    (global as Record<string, unknown>)[JOURNAL_CONFIG] = config;
}


export const asyncLocalStorage = (global as Record<string, unknown>)[JOURNAL_CONTEXT] as AsyncLocalStorage<Map<string, unknown>>;

/**
 * The main configuration map for the context management system.
 * It includes three entries:
 * - CONTEXT: A map for storing context data.
 * - CASCADED_CONTEXT: A map for storing cascaded context data.
 * - LOGGER: A logger instance, initially set to null.
 */
export const rootConfig = (global as Record<string, unknown>)[JOURNAL_CONFIG] as Map<string, unknown>;