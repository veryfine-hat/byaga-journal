declare namespace Byaga {
    export interface ISpanCreator {
        span(fn: () => Promise<any>, data: object): any
        span(fn: () => Promise<any>, ...args: string[]): any
        span(fn: () => any, data: object): any
        span(fn: () => any, ...args: string[]): any
        beginSpan(data:object) : ISpan
        beginSpan(data:object) : ISpan

        annotate(data: object, host: boolean) : void
        readonly context: Object
    }
    export interface ILogger extends ISpanCreator {
        configure(options: IConfiguration)
        startTimer(...startArgs: string[]): (...endArgs: string[]) => void
        log(data: object): void
        log(...args: string[]) :void
    }
    export interface ISpan extends ISpanCreator {
        startTimer(name:string, start?:object): (end?:object)=>void
        time(fn: () => any, name: string): Promise<any>
        time(fn: () => Promise<any>, name: string): Promise<any>

        end(...args: string[]): void
        end(object): void
        exception(error: Error, data?:object) : void
    }

    export interface IConfiguration {
        write: (data: object) => void
    }
}
export = Byaga;