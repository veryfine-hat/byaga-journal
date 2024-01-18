import Journal from '../index'
import {AsyncFunction, SafeFunction, SafeResponse} from "./AsyncFunction";

/**
 * Creates a higher-order function that wraps a given async function with logging behavior.
 * It starts a timer before calling the function and stops the timer after the function has finished executing.
 * If the function throws an error, it logs the error and returns a SafeResponse object with the error.
 * If the function resolves successfully, it returns a SafeResponse object with the result.
 *
 * @param name - The name to be used for logging.
 * @returns A higher-order function that takes an async function and returns a new function with the same signature that has been wrapped with logging behavior.
 */
export const makeLoggedAsync = (name: string) => {
    function decorator<T extends AsyncFunction>(fn: T): T {
        const decoratedFunction = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
            const done = Journal.startTimer(name);
            try {
                return await fn(...args);
            } catch (error) {
                Journal.exception(error);
                throw error;
            } finally {
                done();
            }
        }
        return decoratedFunction as T;
    }

    return decorator;
}
export default makeLoggedAsync;