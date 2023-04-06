const logParamsToData = require("./logParamsToData");
const duration = require('./duration');
const { v4: uuid } = require('uuid');

function SpanCreator(log, parent) {
  let context = {};
  let cascadedContext = {};

  this.beginSpan = (...args) => {
    const child = new Span(log, this);
    child.annotate(logParamsToData(args));
    child.annotate({
      'time': new Date(Date.now()).toISOString(),
      'trace.span_id': uuid()
    });
    return child;
  };
  this.span = async (fn, ...args) => {
    const span = this.beginSpan(...args);
    const result = await fn(span);
    span.end();
    return result;
  };

  this.annotate = (name, value, options = {}) => {
    if (typeof name === 'string') {
      setOne(name, value, options)
    } else {
      setMany(name, value)
    }
  };

  Object.defineProperties(this, {
    'context': {
      get() {
        return context;
      }
    },
    'cascadedContext': {
      get() {
        return cascadedContext;
      }
    }
  });

  function setOne(name, value, options={}) {
    const {cascade, hoist} = options
    if (hoist && parent) {
      parent.annotate(name, value, { hoist });
    }

    context[name] = value
    if (cascade) cascadedContext[name] = value
  }
  function setMany(data, options) {
    Object.entries(data).forEach(([name, value]) => {
      setOne(name, value, options)
    })
  }
}

function Span(log, parent) {
  SpanCreator.call(this, log, parent);

  const spanStart = duration();

  this.end = (...args) => {
    const data = logParamsToData(args);
    log.log({
      time: spanStart.time, ...parent.cascadedContext, ...this.cascadedContext,
      duration_ms: spanStart(), ...this.context, ...data
    });
  };
  this.startTimer = (name, start = {}) => {
    const startAt = duration();
    return (end = {}) => {
      this.annotate({
        ...start, ...end,
        [`metrics.timers.${name}_ms`]: startAt()
      });
    };
  };
  this.time = async (fn, name) => {
    const done = this.startTimer(name);
    try {
      return await fn();
    } finally {
      done();
    }
  };

  this.exception = (error, data) => {
    error = error || "Unknown Error";
    const details = {
      'error': error.message || error.toString(),
      'error.details': error.stack,
      'error.type': typeof error
    };
    const annotations = Object.entries(data || {}).reduce((logData, [key, value]) => ({
      ...logData,
      [`error.${key}`]: value
    }), details);

    this.annotate(annotations);
  };
}

exports.SpanCreator = SpanCreator;
exports.Span = Span;