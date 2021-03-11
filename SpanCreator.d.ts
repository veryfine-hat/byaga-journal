import {ILogger, ISpan, ISpanCreator} from "./byaga";

export declare class SpanCreator implements ISpanCreator {
    constructor(log: ILogger, parent?: ILogger)

    beginSpan(data: object): Span;

    span(fn: () => Promise<any>, data: object): any;
    span(fn: () => Promise<any>, ...args: string[]): any;
    span(fn: () => any, data: object): any;
    span(fn: () => any, ...args: string[]): any;

    annotate(data: object, host?: boolean) : void

    readonly context: object
}

export declare class Span implements ISpan {
    constructor(log: ILogger, parent?: ILogger)
    beginSpan(data: object): Span;

    end(...args: string[]): void;
    end(object): void;

    exception(error: Error, data?: object): void;

    span(fn: () => Promise<any>, data: object): any;
    span(fn: () => Promise<any>, ...args: string[]): any;
    span(fn: () => any, data: object): any;
    span(fn: () => any, ...args: string[]): any;

    startTimer(name: string, start?: object): (end?: object) => void;
    time(fn: () => any, name: string): Promise<any>;
    time(fn: () => Promise<any>, name: string): Promise<any>;

    annotate(data: object, host?: boolean): void;
    readonly context: Object;
}