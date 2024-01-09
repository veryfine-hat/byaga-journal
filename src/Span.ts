import {logParamsToData} from "./log-params-to-data";
import {duration} from "./duration";
import {v4 as uuid} from 'uuid';
import {StructuredLog} from "./StructuredLog";
import {LogOptions} from "./LogOptions";
import {normalizePropertyName} from './normalize-property-name'

export class Span {
    readonly context: StructuredLog = {};
    readonly cascadedContext: StructuredLog = {};
    private readonly spanStart = duration();
    private readonly _parent?: Span

    constructor(parent?: Span) {
        this._parent = parent;
    }

    get parent(): Span {
        return this._parent ? this._parent : this;
    }

    get root(): Span {
        if (this._parent) return this._parent.root
        return this
    }

    log(data: StructuredLog) {
        this.root.log(data);
    }

    beginSpan(...args: string[] | [StructuredLog]): Span {
        const child = new Span(this);
        child.annotate(logParamsToData(args));
        child.annotate({
            'time': new Date(Date.now()).toISOString(),
            'trace.span_id': uuid()
        });
        return child
    }

    annotate(name: string | StructuredLog, value?: LogOptions | any, options: LogOptions = {}) {
        if (typeof name === 'string') {
            this.setOne(name, value, options)
        } else {
            this.setMany(name as StructuredLog, value as LogOptions)
        }
    }

    async span(fn: Function, ...args: string[] | [StructuredLog]) {
        const span = this.beginSpan(...args);
        const result = await fn(span);
        span.end();
        return result;
    }

    end(...args: string[] | [StructuredLog]) {
        const data = logParamsToData(args);
        this.log({
            time: this.spanStart, ...this.parent?.cascadedContext, ...this.cascadedContext,
            duration_ms: this.spanStart(), ...this.context, ...data
        });
    }

    startTimer(name: string, start: StructuredLog = {}) {
        const startAt = duration();
        let once = true;
        return (end: StructuredLog = {}) => {
            if (!once) throw new Error('Done method should only be called once');

            once = false;
            this.annotate({
                ...start, ...end,
                [`metrics.timers.${name}_ms`]: startAt()
            });
        };
    }

    exception(error: any, data?: StructuredLog) {
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
    }

    private setOne(name: string, value: any, options: LogOptions = {}) {
        const {cascade, hoist} = options
        if (hoist && this._parent) {
            this.parent.annotate(name, value, {hoist});
        }

        name = normalizePropertyName(name);
        this.context[name] = value
        if (cascade) this.cascadedContext[name] = value
    }

    private setMany(data: StructuredLog, options: LogOptions) {
        Object.entries(data).forEach(([name, value]) => {
            this.setOne(name, value, options)
        })
    }
}