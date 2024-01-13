export interface SafeResponse<T> {
    result?: T,
    error?: unknown;
}

export type AsyncFunction = (...args: any[]) => Promise<any> | any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type SafeFunction<T extends AsyncFunction> = (...args: Parameters<T>) => Promise<SafeResponse<ReturnType<T>>> | SafeResponse<ReturnType<T>>;