import {IAnswer, IOptions, IRequest, MyMethod, TestMode} from "../app/i/i.structures";

export function testAnswer(method: MyMethod): IAnswer {
    return {
        createdAt: new Date(+new Date() + Math.round(Math.random() * 1000)),
        request: testRequest(method),
        statusCode: 200,
        statusText: "test"
    }
}

export function testRequest(method: MyMethod): IRequest {
    return {createdAt: new Date(), method: MyMethod.GET, url: "https://www.google.by/"}
}

export function testOptions(testMode: TestMode): IOptions {
    return {rampApPeriodSec: 4, testDurationSec: 5, rps: 2, threads: 1, testMode}
}