import { asyncLocalStorage} from "./local-storage";
import {getLogger, setLogger} from "./logger";
import {setLocalContext, getSharedContext, setSharedContext} from "./context";

type method = (...args: unknown[]) => unknown

/**
 * Creates a new span for logging and runs a given function within the context of that span.
 *
 * This function begins a new span using the current logger, then creates a new context for the span.
 * It then runs the given function within the context of the span, and ends the span after the function has finished executing.
 *
 * @param fn - The function to run within the context of the span. It should be a function that takes any number of arguments and returns a value.
 * @returns A promise that resolves to the return value of the function.
 */
export async function createSpan<T extends method>(fn: T): Promise<ReturnType<T>> {
    const childConfig: Map<string, unknown> = new Map()
    const span = getLogger().beginSpan()
    const parentContext = getSharedContext()
    const result = await asyncLocalStorage.run(childConfig, function() {
        setLogger(span);
        setLocalContext(new Map());
        setSharedContext(new Map(parentContext))
        return fn()
    }) as ReturnType<T>
    span.end()
    return result;
}