import {ILogger, ISpan, IConfiguration} from "./byaga"

export default class Journal implements ILogger{
    constructor()

    configure(options: IConfiguration);

    readonly context: Object;

    annotate(data: object, host: boolean): void;

    beginSpan(data: object): ISpan;

    span(fn: () => Promise<any>, data: object): any;
    span(fn: () => Promise<any>, ...args: string[]): any;
    span(fn: () => any, data: object): any;
    span(fn: () => any, ...args: string[]): any;

    startTimer(...startArgs: string[]): (...endArgs: string[]) => void;

    log(data: object): void;
    log(...args: string[]): void;
}