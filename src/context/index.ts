export { configure } from './configure';
export { annotate } from './annotate';
export { exception } from './exception';
export { createSpan } from './create-span';
export { withChildSpan } from './with-child-span';
export {
  setContextValue,
  setContextValues,
  getContextValue
} from './context';
export * as metrics from './metrics'
export { send } from './log'
export { startTimer } from './start-timer'