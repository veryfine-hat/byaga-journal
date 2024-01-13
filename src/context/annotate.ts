import {StructuredLog} from "../StructuredLog";
import {LogOptions} from "../LogOptions";
import {getLogger} from "./logger";
import {LogItem} from "../Span";

/**
 * Annotates a log with additional information.
 *
 * This function retrieves the current logger and calls its `annotate` method with the provided parameters.
 *
 * @param name - The name of the log or a `StructuredLog` instance.
 * @param [value] - Optional. The value to annotate the log with. Can be a `LogOptions` or `LogItem` instance.
 * @param [options={}] - Optional. Additional options for the log. Defaults to an empty object.
 */
export const annotate = (name: string | StructuredLog, value?: LogOptions | LogItem, options?: LogOptions) => getLogger().annotate(name, value, options);