import { ConfigurationOptions} from "../ConfigurationOptions";

export interface ContextConfiguration extends ConfigurationOptions {
    logLevel?: LogLevel;
}

export enum LogLevel {
    Debug = 0,
    Trace = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}