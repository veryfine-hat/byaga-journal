const logParamsToData = require("./logParamsToData");
const { SpanCreator } = require("./SpanCreator");
const duration = require('./duration');

function Journal() {
  SpanCreator.call(this, this);

  let write = console.log;
  this.configure = options => {
    write = options.write || write;
  };
  this.log = (...args) => {
    const data = logParamsToData(args);
    write({
      ...this.context, ...data
    });
  };
  this.startTimer = (...startArgs) => {
    const start = logParamsToData(startArgs);
    const end = duration();
    return (...endArgs) => {
      const durationMs = end();
      write({
        ...start,
        ...logParamsToData(endArgs),
        'duration_ms': durationMs
      });
    };
  };
}

module.exports = Journal;