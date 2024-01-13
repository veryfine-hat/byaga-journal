import { getLogger } from "./logger";
import { StructuredLog } from "../StructuredLog";
import { sum } from "./metrics";
import { getLogLevel } from "./configure";
import { LogLevel } from "./ContextConfiguration";

/**
 * Checks if the provided log level is greater than the current log level.
 *
 * @param level - The log level to check.
 * @returns True if the provided log level is greater than the current log level, false otherwise.
 */
const ifLogLevel = (level: number): boolean => level >= getLogLevel();

/**
 * Sends a log with the provided data.
 *
 * @param {StructuredLog} data - The data to log.
 */
export const send = (data: StructuredLog) => getLogger().log(data);

/**
 * Logs a debug message with the provided key and value if the current log level is Debug or lower.
 *
 * @param {string} key - The key of the debug message.
 * @param {string} value - The value of the debug message.
 */
export const debug = (key: string, value: string) => ifLogLevel(LogLevel.Debug) && getLogger().annotate(`debug.${key}`, value);

/**
 * Logs a trace message if the current log level is Trace or lower.
 *
 * @param {string} message - The trace message to log.
 */
export const trace = (message: string) => {
    if (!ifLogLevel(LogLevel.Trace)) return;

    const idx = sum('traces');
    getLogger().annotate('trace.count', idx);
    getLogger().annotate(`trace.${idx}`, message);
}

/**
 * Logs an info message if the current log level is Info or lower.
 *
 * @param {string} message - The info message to log.
 */
export const info = (message: string) => ifLogLevel(LogLevel.Info) && getLogger().annotate('message', message);

/**
 * Logs an error message if the current log level is Error or lower.
 *
 * @param {string} message - The error message to log.
 * @param {string} [prefix='message'] - Optional. The prefix for the error message. Defaults to 'message'.
 */
export const error = (message: string, prefix: string = 'message') => {
    if (!ifLogLevel(LogLevel.Error)) return;

    const errors = sum('error_count');
    getLogger().annotate('error', `${errors} errors have occurred`);
    getLogger().annotate(`error.${prefix}`, message)
}

/**
 * Logs a warning message if the current log level is Warn or lower.
 *
 * @param {string} message - The warning message to log.
 */
export const warn = (message: string) => ifLogLevel(LogLevel.Warn) && getLogger().annotate('warn', message);