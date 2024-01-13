import {StructuredLog} from "../StructuredLog";
import { getLogger } from "./logger";

/**
 * Logs an exception with the current logger.
 *
 * This function retrieves the current logger and calls its `exception` method with the provided parameters.
 *
 * @param error - The error to log.
 * @param [data] - Optional. Additional data to log with the error.
 */
export const exception = (error: unknown, data?: StructuredLog) => getLogger().exception(error, data);