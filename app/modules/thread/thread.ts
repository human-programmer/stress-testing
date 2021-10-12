import {IThread} from "../../i/thread/i.thread";
import {IRequest, IThreadOptions} from "../../i/i.structures";
import {IGateway} from "../../i/gateway/i.gateway";
import {IDb} from "../../i/db/i.db";
import {Gateway} from "../gateway/gateway";
import {PgDb} from "../db/pg.db";

export class Thread implements IThread {
    static create(options: IThreadOptions, request: IRequest): IThread {
        return new Thread(options, request, new Gateway(), new PgDb())
    }

    private currentIteration: number = 0
    private currentRps: number = 1
    private startedRequestsCounter: number = 0
    private endedRequestsCounter: number = 0
    private readonly boost: number
    private intervalId: any
    private resolvePromise: any
    private readonly iterations: any[] = []

    constructor(private readonly threadOptions: IThreadOptions,
                private readonly request: IRequest,
                private readonly gateway: IGateway,
                private readonly db: IDb) {
        this.boost = this.threadOptions.rps / this.threadOptions.testDurationSec
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
        const promises: any[] = [], request = this.clonedRequest()
        while (rps--){promises.push(this.sendRequest(request))}
        await Promise.all(promises)
    }

    private clonedRequest(): IRequest {
        return {...this.request, createdAt: new Date()}
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