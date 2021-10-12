export enum TestMode {
    target_url="target_url",
    sitemap="sitemap"
}
export enum DbSchema {
    metric="stress_tests"
}

export enum MyMethod {
    GET="GET",
    POST="POST",
}

export interface IOptions extends IThreadOptions{
    readonly threads: number
}

export interface IThreadOptions {
    readonly rps: number
    readonly testMode: TestMode
    readonly rampApPeriodSec: number
    readonly testDurationSec: number
}

export interface IAnswer {
    readonly createdAt: Date
    readonly statusCode: number
    readonly statusText: string
    readonly request: IRequest
}

export interface IRequest {
    readonly url: string
    readonly method: MyMethod
    readonly createdAt: Date
}