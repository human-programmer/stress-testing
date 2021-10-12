import {IOptions, IRequest, MyMethod} from "./i/i.structures";
import {Thread} from "./modules/thread/thread";

require("dotenv").config({path:".env.public"})
require("dotenv").config({path:".env.private"})

async function run(): Promise<void> {
    const options = createOptions()
    const request = createRequest()
    const thread = Thread.create(options, request)
    await thread.run()
    console.log("\nEND")
    process.exit()
}


run()


function createOptions(): IOptions {
    return {
        rampApPeriodSec: 40,
        rps: 50,
        testDurationSec: 60,
        threads: 1
    }
}

function createRequest(): IRequest {
    return {createdAt: new Date(), method: MyMethod.GET, url: process.env.TARGET_URL || ""}
}