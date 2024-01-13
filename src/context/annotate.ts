import {StructuredLog, LogItem} from "../StructuredLog";
import {LogOptions} from "../LogOptions";
import {getLogger} from "./logger";

/**
 * Annotates the current span with additional data.
 *
 * @param {string} name - The name of the annotation.
 * @param {LogItem} value - The value of the annotation.
 * @param {LogOptions} [options={}] - Additional options for the annotation.
 */
export function annotate(name: string, value: LogItem, options?: LogOptions): void;

/**
 * Annotates the current span with multiple annotations.
 *
 * @param {StructuredLog} log - A StructuredLog object containing multiple annotations.
 * @param {LogOptions} [options={}] - Additional options for the annotations.
 */
export function annotate(log: StructuredLog, options?: LogOptions): void;

export function annotate(nameOrLog: string | StructuredLog, valueOrOptions?: LogItem | LogOptions, options?: LogOptions) {
    if (typeof nameOrLog === 'string') {
        getLogger().annotate(nameOrLog, valueOrOptions as LogItem, options);
    } else {
        getLogger().annotate(nameOrLog, valueOrOptions as LogOptions);
    }
}