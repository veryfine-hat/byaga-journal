const logParamsToData = require("./logParamsToData")

function SpanCreator(log, parent) {
    let context = {};

    this.beginSpan = (...args) => {
        const child = new Span(log, this);
        child.annotate(logParamsToData(args));
        return child;
    };
    this.span = async (fn, ...args) => {
        const span = this.beginSpan(...args);
        const result = await fn(span);
        span.end();
        return result;
    };

    this.annotate = (data, hoist = false) => {
        if (hoist && parent) {
            parent.annotate(data, hoist);
        }
        context = { ...context, ...data };
    };
    Object.defineProperty(this, 'context', {
        get() { return context; }
    });
}

function Span(log, parent) {
    SpanCreator.call(this, log, parent)

    const spanStart = Date.now();

    this.end = (...args) => {
        const data = logParamsToData(args);
        log.log({ duration_ms: Date.now() - spanStart, ...this.context, ...data });
    };
    this.startTimer = (name, start = {}) => {
        const startAt = Date.now();
        return (end = {}) => {
            const durationMs = Date.now() - startAt;
            this.annotate({
                ...start, ...end,
                [`metrics.timers.${name}_ms`]: durationMs
            });
        };
    };
    this.time = async (fn, name) => {
        const done = this.startTimer(name)
        try {
            return await fn()
        } finally {
            done()
        }
    };

    this.exception = (error, data = {}) => {
        const details = {
            'error.stack': error.stack,
            'error.message': error.message || error.toString()
        };
        const annotations = Object.entries(data).reduce((logData, [key, value]) => ({
            ...logData,
            [`error.${key}`]: value
        }), details);

        this.annotate(annotations);
    };
}

exports.SpanCreator = SpanCreator
exports.Span = Span