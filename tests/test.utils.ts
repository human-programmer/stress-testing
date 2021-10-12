import {IAnswer, IOptions, IRequest, MyMethod} from "../app/i/i.structures";

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

export function testOptions(): IOptions {
    return {rampApPeriodSec: 2, testDurationSec: 3, rps: 2, threads: 1}
}