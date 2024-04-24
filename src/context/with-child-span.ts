/**
 * This module provides a higher-order function generator for creating child spans.
 * @module withChildSpan
 */

import {createSpan, method} from "./create-span";
import {annotate} from "./annotate";
import {exception} from "./exception";
import {SafeResponse} from "../logged-method/AsyncFunction";


/**
 * A higher-order function generator that creates a child span.
 * @function withChildSpan
 * @param name - The name of the child span.
 * @returns - A higher-order function generator.
 */
export function withChildSpan (name:string) {
    /**
     * A higher-order function generator.
     * @function higherOrderFunctionGenerator
     * @param fn - The function to be wrapped.
     * @returns - A higher-order function.
     */
    function higherOrderFunctionGenerator<Args extends unknown[], Result>(fn: (...args: Args) => Result) {
        type ResolvedFunctionReturn = Promise<SafeResponse<Awaited<Result>>>
        /**
         * A higher-order function that creates a child span, annotates it with the given name,
         * executes the wrapped function, and handles any exceptions that occur during execution.
         * @function higherOrderFunction
         * @param args - The arguments to be passed to the wrapped function.
         * @returns A promise that resolves with the result of the wrapped function,
         * or rejects with an error object if an exception occurs.
         */
        function higherOrderFunction(...args: Args): ResolvedFunctionReturn {
            return createSpan(async (): ResolvedFunctionReturn => {
                annotate('name', name);
                try {
                    return { result: (await fn(...args)) as Awaited<Result> };
                } catch (error) {
                    exception(error);
                    return { error };
                }
            });
        }
        return higherOrderFunction;
    }
    return higherOrderFunctionGenerator
}
export default withChildSpan;