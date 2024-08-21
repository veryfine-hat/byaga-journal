import { getStore} from "./get-store";
import {rootConfig} from "./local-storage";
import {Span} from "../Span";
import Journal from "../Journal";

// Constant for the logger key
export const LOGGER = 'logger'

/**
 * Retrieves the current logger from the store.
 *
 * @returns {Span} - The current logger.
 */
export const getLogger = (): Span => getStore().get(LOGGER) as Span

/**
 * Sets the current logger in the store.
 *
 * @param {Span} logger - The logger to set.
 */
export const setLogger = (logger: Span) => getStore().set(LOGGER, logger)

const existingLogger = rootConfig.get(LOGGER) as Journal
if (!existingLogger) { rootConfig.set(LOGGER, new Journal()) }

// Creates a new Journal instance
export const logger = (): Journal => rootConfig.get(LOGGER) as Journal
