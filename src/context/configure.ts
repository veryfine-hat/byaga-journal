import {ContextConfiguration, LogLevel} from "./ContextConfiguration";
import {rootConfig} from "./local-storage";
import {logger} from "./logger";

/**
 * Configures the context management system.
 *
 * This function takes a `ContextConfiguration` object and passes it to the `configure` method of the logger.
 *
 * @param {ContextConfiguration} config - The configuration object for the context management system.
 */
export const configure = (config: ContextConfiguration) => {
  logger().configure(config)
  if (config.logLevel !== undefined) setLogLevel(config.logLevel);
}

const LOG_LEVEL = 'log-level';
/**
 * Sets the log level for the context management system.
 *
 * This function takes a `LogLevel` and passes it to the `setLogLevel` method of the logger.
 *
 * @param {LogLevel} level - The log level to set.
 */
export const setLogLevel = (level: LogLevel) => rootConfig.set(LOG_LEVEL, level)

/**
 * Gets the log level for the context management system.
 *
 * This function returns the log level from the `rootConfig` map.
 *
 * @returns {LogLevel} The log level.
 */
export const getLogLevel = (): LogLevel => rootConfig.get(LOG_LEVEL) as LogLevel

setLogLevel(LogLevel.Error); // Initial log level is set to Errors Only because structured logging isn't really intended for log-level style logging
