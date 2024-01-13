import { asyncLocalStorage, rootConfig } from "./local-storage";

/**
 * Retrieves the current store from the asyncLocalStorage.
 *
 * This function calls the `getStore` method of the asyncLocalStorage and casts the result to a `Map<string, unknown>`.
 *
 * @returns {Map<string, unknown>} - The current store.
 */
export const getStore = (): Map<string, unknown> => asyncLocalStorage.getStore() as Map<string, unknown>  || rootConfig ;