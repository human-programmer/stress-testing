export interface IThread {
    readonly startedRequests: number
    readonly endedRequests: number
    run(): void
}