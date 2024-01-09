import { AsyncLocalStorage } from 'async_hooks';
import {duration} from './duration';
import {ContextConfiguration} from "./ContextConfiguration";
import {StructuredLog} from "./StructuredLog";
import {Journal} from "./Journal";
import {LogOptions} from "./LogOptions";

const CONTEXT = 'context';
const CASCADED_CONTEXT = 'cascaded-context'
const LOGGER = 'logger'

const asyncLocalStorage = new AsyncLocalStorage();
const config = new Map()
config.set(CONTEXT, new Map())
config.set(CASCADED_CONTEXT, new Map())
config.set(LOGGER, null)
asyncLocalStorage.enterWith(config)

export const configure = (config: ContextConfiguration) => {
  const store: Map<string, any> = getStore();
  config.logger && store.set(LOGGER, config.logger)
  store.get(LOGGER).configure(config)
}

const getStore = (): Map<string, any> => asyncLocalStorage.getStore() as Map<string, any>;
const getContext = () => getStore().get(CONTEXT);
const getSharedContext = () => getStore().get(CASCADED_CONTEXT);
const getLogger = (): Journal => getStore().get(LOGGER);
export const annotate = (name: string | StructuredLog, value?: LogOptions | any, options: LogOptions = {}) => getLogger().annotate(name, value, options);
export const exception = (error: any, data?: StructuredLog) => getLogger().exception(error, data);
export const createSpan = async (fn: () => unknown) => {
  const config = getStore();
  const childConfig = new Map()
  const logger = getLogger().beginSpan()
  childConfig.set(LOGGER, logger);
  childConfig.set(CONTEXT, new Map())
  childConfig.set(CASCADED_CONTEXT, new Map(config.get(CASCADED_CONTEXT)))
  const result = await asyncLocalStorage.run(childConfig, fn)
  logger.end()
  return result;
}
export const setContext = (name: string, value: any, shared = false) => {
  if (shared) { getSharedContext().set(name, value)}
  else { getContext().set(name, value)}
  return value
}
export const set = setContext
export const bulkSetContext = (data: {[key: string]: any}, shared = false) =>
  Object.entries(data).forEach(([name, value]) => setContext(name, value, shared));
export const bulkSet = bulkSetContext

export const get = (name:string): any => getContext().get(name) || getSharedContext().get(name)
const sum = (name: string, add: number) => setContext(name, (get(name) || 0) + add)

export const withSpan = (fn: ()=>unknown, journal: Journal) => async () => {
  const config = getStore();
  const childConfig = new Map();
  const logger = journal.beginSpan();
  childConfig.set(LOGGER, logger);
  childConfig.set(CONTEXT, new Map());
  childConfig.set(CASCADED_CONTEXT, new Map(config.get(CASCADED_CONTEXT)));
  return await asyncLocalStorage.run(childConfig, fn);
};
export const withChildSpan = (fn: (...args: any[]) => unknown, name:string) => (...args: any[]) => createSpan(async () => {
  if (name) annotate({name})
  try {
    return await fn(...args)
  } catch(error) {
    exception(error as Error);
    return {statusCode: 500, error}
  }
})
export const log = (...args: any[]) => getLogger().log(...args)
export const startTimer = (name?: string) => {
  const end = duration();
  let once = true;
  return () => {
    if (!once) throw new Error('Done method should only be called once');

    once = false;
    const key = name ? `metrics.${name}_dur_ms` : 'duration_ms'
    annotate({ [key]: end() });
  }
}

export const metrics = {
  total: (name: string, add: number=1) => {
    const total = sum(name, add)
    annotate({[`metrics.${name}_ct`]  :  total  })
  },

  startTimer: (name: string) => {
    const end = duration();
    let once = true;
    return () => {
      if (!once) throw new Error('Done method should only be called once');

      once = false;
      const duration = sum(name, end())
      metrics.total(name)
      annotate({[`metrics.${name}_total_dur_ms`]: duration });
    }
  }
}