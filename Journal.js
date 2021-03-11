const logParamsToData = require("./logParamsToData")
const { SpanCreator } = require("./SpanCreator")

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
        const startAt = Date.now();
        return (...endArgs) => {
            const end = logParamsToData(endArgs);
            const durationMs = Date.now() - startAt;
            write({
                ...start, ...end,
                'duration_ms': durationMs
            });
        };
    };
}

module.exports = Journal;