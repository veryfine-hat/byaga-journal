const { AsyncLocalStorage } = require('async_hooks');
const duration = require('./duration')
const CONTEXT = 'context';
const CASCADED_CONTEXT = 'cascaded-context'
const LOGGER = 'logger'

const asyncLocalStorage = new AsyncLocalStorage();
const config = new Map()
config.set(CONTEXT, new Map())
config.set(CASCADED_CONTEXT, new Map())
config.set(LOGGER, null)
asyncLocalStorage.enterWith(config)

const configure = ({ logger, ...options }) => {
  const store = asyncLocalStorage.getStore();
  logger && store.set(LOGGER, logger)
  store.get(LOGGER).configure(options)
}

const getContext = () => asyncLocalStorage.getStore().get(CONTEXT);
const getSharedContext = () => asyncLocalStorage.getStore().get(CASCADED_CONTEXT);
const getLogger = () => asyncLocalStorage.getStore().get(LOGGER);
const annotate = (...args) => getLogger().annotate(...args);
const exception = (...args) => getLogger().exception(...args);
const createSpan = async (fn) => {
  const config = asyncLocalStorage.getStore();
  const childConfig = new Map()
  const logger = getLogger().beginSpan()
  childConfig.set(LOGGER, logger);
  childConfig.set(CONTEXT, new Map())
  childConfig.set(CASCADED_CONTEXT, new Map(config.get(CASCADED_CONTEXT)))
  const result = await asyncLocalStorage.run(childConfig, fn)
  logger.end()
  return result;
}
const setContext = (name, value, shared = false) => {
  if (shared) { getSharedContext().set(name, value)}
  else { getContext().set(name, value)}
  return value
}
const bulkSetContext = (data, shared = false) =>
  Object.entries(data).forEach(([name, value]) => setContext(name, value, shared));

const get = (name) => getContext().get(name) || getSharedContext().get(name)
const sum = (name, add) => setContext(name, (get(name) || 0) + add)

module.exports.createSpan = createSpan
module.exports.withSpan = (fn, journal) => async () => {
  const config = asyncLocalStorage.getStore();
  const childConfig = new Map();
  const logger = journal.beginSpan();
  childConfig.set(LOGGER, logger);
  childConfig.set(CONTEXT, new Map());
  childConfig.set(CASCADED_CONTEXT, new Map(config.get(CASCADED_CONTEXT)));
  return await asyncLocalStorage.run(childConfig, fn);
};
module.exports.withChildSpan = (fn, name) => (...args) => createSpan(async () => {
  if (name) annotate({name})
  try {
    return await fn(...args)
  } catch(error) {
    exception(error);
    return {statusCode: 500, error}
  }
})
module.exports.configure = configure
module.exports.log = (...args) => getLogger().log(...args)
module.exports.annotate = annotate
module.exports.startTimer = name => {
  const end = duration();
  return () => {
    const key = name ? `${name}_dur_ms` : 'duration_ms'
    annotate({ [key]: end() });
  }
}
module.exports.exception = exception
module.exports.get = get;
module.exports.set = setContext
module.exports.bulkSet = bulkSetContext
module.exports.metrics = {
  total: (name, add=1) => {
    const total = sum(name, add)
    annotate({[`metrics.${name}`]  :  total  })
  },
  startTimer: (name) => {
    const end = duration();
    return () => {
      const duration = sum(name, end())
      annotate({[`${name}_total_dur_ms`]: duration });
    }
  }
}