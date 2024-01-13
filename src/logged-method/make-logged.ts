import { makeLoggedAsync} from "./make-logged-async";
import { makeLoggedCallback } from "./make-logged-callback";
import {AsyncFunction} from './AsyncFunction'
import {FunctionWithCallback} from './FunctionWithCallback'

/**
 * Creates a higher-order function that wraps a given function with logging behavior.
 * It checks if the last parameter of the function is a function (callback).
 * If it is, it uses `makeLoggedCallback` to create a function that wraps the original function with logging behavior for callback-based functions.
 * If it's not, it uses `makeLoggedAsync` to create a function that wraps the original function with logging behavior for promise-based functions.
 *
 * @param name - The name to be used for logging.
 * @returns A higher-order function that takes a function and returns a new function with the same signature that has been wrapped with logging behavior.
 */
export function makeLogged(name: string) {
    return function <T extends AsyncFunction | FunctionWithCallback>(fn: T): T {
        // Cast fn to the Function type
        const fnAsFunction = fn as unknown as unknown[];

        // Check if the last parameter is a function (callback)
        if (typeof fnAsFunction[fnAsFunction.length - 1] === 'function') {
            // If it is, use makeLoggedCallback to create a function that wraps the original function with logging behavior for callback-based functions
            return makeLoggedCallback(name)(fn as FunctionWithCallback) as T;
        }

        // If the last parameter is not a function, assume the function returns a Promise
        // Use makeLoggedAsync to create a function that wraps the original function with logging behavior for promise-based functions
        return makeLoggedAsync(name)(fn as AsyncFunction) as T;
    };
}
export default makeLogged;