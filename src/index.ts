import * as Context from './context';
export { logger} from "./context/logger";
export { Journal } from './Journal';

export { makeLogged } from './logged-method/make-logged'
export { makeLoggedAsync } from './logged-method/make-logged-async'
export { makeLoggedCallback } from './logged-method/make-logged-callback'

export {StructuredLog} from './StructuredLog'
export {Context}
export default Context