import {IThread} from "../../i/thread/i.thread";
import {IRequest, IThreadOptions, MyMethod} from "../../i/i.structures";
import {ITestGateway} from "../../i/test.gateway/i.test.gateway";
import {IDb} from "../../i/db/i.db";
import {TestGateway} from "../test.gateway/test.gateway";
import {PgDb} from "../db/pg.db";

export class Thread implements IThread {
    static create(options: IThreadOptions, urls: string[], method: MyMethod): IThread {
        return new Thread(options, urls, method, new TestGateway(), new PgDb())
    }

    private currentIteration: number = 0
    private currentRps: number = 1
    private startedRequestsCounter: number = 0
    private endedRequestsCounter: number = 0
    private readonly boost: number
    private intervalId: any
    private resolvePromise: any
    private readonly iterations: any[] = []
    private readonly carousel: Carousel

    constructor(private readonly threadOptions: IThreadOptions,
                urls: string[],
                private readonly method: MyMethod,
                private readonly gateway: ITestGateway,
                private readonly db: IDb) {
        this.boost = this.threadOptions.rps / this.threadOptions.testDurationSec
        this.carousel = new Carousel(urls)
    }
    async run(): Promise<void> {
        this.intervalId = setInterval(() => this.startIteration(), 1000)
        return new Promise((res, rej) => {
            this.resolvePromise = res
        })
    }

    private async startIteration(): Promise<void> {
        this.iterations.push(this.iteration())
        await this.checkEnded()
    }


    private async iteration(): Promise<void> {
        ++this.currentIteration
        console.log("\niteration", this.currentIteration)
        this.checkIteration()
        if(this.isEnded) return;
        await this.executeIteration()
    }

    private async executeIteration(): Promise<void> {
        let rps = this.requestsQuantity
        console.log("executeIteration rps:", rps, "/", this.threadOptions.rps)
        const promises: any[] = [], createdAt = new Date()
        while (rps--){promises.push(this.sendRequest(this.clonedRequest(createdAt)))}
        await Promise.all(promises)
    }

    private clonedRequest(createdAt: Date): IRequest {
        return {createdAt, method: this.method, url: this.carousel.nextUrl}
    }

    private checkIteration(): void {
        this.isEnded && clearInterval(this.intervalId)
    }

    private async sendRequest(request: IRequest): Promise<void> {
        this.startedRequestsCounter++
        const answer = await this.gateway.request(request)
        await this.db.save(answer)
        this.endedRequestsCounter++
        console.log("endedRequests", this.endedRequests, "startedRequests", this.startedRequests)
    }

    private get requestsQuantity(): number {
        if(this.currentIteration >= this.threadOptions.rampApPeriodSec) return this.threadOptions.rps
        return Math.round(this.currentRps += this.boost)
    }

    private get isEnded(): boolean {
        return this.currentIteration > this.threadOptions.testDurationSec
    }

    private async checkEnded(): Promise<void> {
        if(!this.isEnded) return;
        await Promise.all(this.iterations)
        this.resolvePromise()
    }

    get startedRequests(): number {
        return this.startedRequestsCounter
    }

    get endedRequests(): number {
        return this.endedRequestsCounter
    }
}

class Carousel {
    private index: number = 0
    constructor(private readonly urls: string[]) {}

    get nextUrl(): string {
        return this.urls[this.nextIndex]
    }

    private get nextIndex(): number {
        if(this.index >= this.urls.length) this.index = 0
        return this.index++
    }
}