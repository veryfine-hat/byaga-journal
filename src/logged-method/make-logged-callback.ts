import Journal from '../index'
import { Callback, FunctionWithCallback } from './FunctionWithCallback'

/**
 * Creates a higher-order function that wraps a given function with logging behavior.
 * It starts a timer before calling the function and stops the timer after the callback function has been called.
 * If the callback function is called with an error, it logs the error.
 *
 * @param name - The name to be used for logging.
 * @returns A higher-order function that takes a function and returns a new function with the same signature that has been wrapped with logging behavior.
 */
export const makeLoggedCallback = (name: string) => {
    function decorator<T extends FunctionWithCallback>(fn: T): T {

        const decoratedFunction = (...args: Parameters<T>): void => {
            const done = Journal.startTimer(name);
            const originalCallback = args[args.length - 1] as Callback;

            // Replace the callback with a new function
            args[args.length - 1] = (error: unknown, result: unknown) => {
                if (error) {
                    Journal.exception(error);
                }
                done();
                originalCallback(error, result);
            };

            // Call the original function with the new arguments
            fn(...args);
        }

        return decoratedFunction as T;
    }
    return decorator;
}
export default makeLoggedCallback