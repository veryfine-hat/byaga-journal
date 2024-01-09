import { ConfigurationOptions} from "./ConfigurationOptions";
import {Journal} from "./Journal";

export interface ContextConfiguration extends ConfigurationOptions {
    logger?: Journal
}