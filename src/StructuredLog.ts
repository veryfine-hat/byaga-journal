export interface StructuredLog {
    duration_ms?: number,
    [key: string]: number | string | boolean | undefined
}
